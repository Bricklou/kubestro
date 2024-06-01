package manager

import (
	"context"
	"fmt"
	minecraftserverv1 "github.com/bricklou/kubestro/api/manager/v1"
	"github.com/bricklou/kubestro/internal/vanillatweaks"
	appsv1 "k8s.io/api/apps/v1"
	corev1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/resource"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/util/intstr"
	"k8s.io/utils/pointer"
	"path/filepath"
	"strings"
)

const minecraftJarVolumeName = "minecraft-jar"
const minecraftWorkingDirVolumeName = "minecraft-workingdir"
const dataPacksMountName = "data-packs"

func securityContext() *corev1.SecurityContext {
	return &corev1.SecurityContext{
		Privileged:               pointer.Bool(false),
		RunAsUser:                pointer.Int64(1000),
		RunAsGroup:               pointer.Int64(1000),
		RunAsNonRoot:             pointer.Bool(true),
		ReadOnlyRootFilesystem:   pointer.Bool(true),
		AllowPrivilegeEscalation: pointer.Bool(false),
	}
}

func baseMainJavaContainer(javaVersion int) corev1.Container {
	const minecraftPort int32 = 25565
	return corev1.Container{
		Name:  "minecraft",
		Image: fmt.Sprintf("eclipse-temurin:%d", javaVersion),
		// Minecraft expects to be able to write all kinds of stuff to it's working directory, so we give it a dedicated
		// scratch dir for it's use under /run/minecraft
		WorkingDir: "/run/minecraft",
		// TODO Make resources configurable
		Resources: corev1.ResourceRequirements{
			Limits: corev1.ResourceList{
				corev1.ResourceMemory: resource.MustParse("2Gi"),
				// No CPU limit to avoid CPU throttling
			},
			Requests: corev1.ResourceList{
				corev1.ResourceMemory: resource.MustParse("1Gi"),
				corev1.ResourceCPU:    resource.MustParse("2"),
			},
		},
		TTY:   true,
		Stdin: true,
		Ports: []corev1.ContainerPort{
			{
				Name:          "minecraft",
				ContainerPort: minecraftPort,
				Protocol:      corev1.ProtocolTCP,
			},
		},
		StartupProbe: &corev1.Probe{
			InitialDelaySeconds: 10,
			ProbeHandler: corev1.ProbeHandler{
				TCPSocket: &corev1.TCPSocketAction{
					Port: intstr.FromInt32(minecraftPort),
				},
			},
		},
		ReadinessProbe: &corev1.Probe{
			InitialDelaySeconds: 10,
			ProbeHandler: corev1.ProbeHandler{
				TCPSocket: &corev1.TCPSocketAction{
					Port: intstr.FromInt32(minecraftPort),
				},
			},
		},
		LivenessProbe: &corev1.Probe{
			InitialDelaySeconds: 10,
			PeriodSeconds:       20,
			ProbeHandler: corev1.ProbeHandler{
				TCPSocket: &corev1.TCPSocketAction{
					Port: intstr.FromInt32(minecraftPort),
				},
			},
		},
		VolumeMounts: []corev1.VolumeMount{
			// This gives minecraft a writeable runtime directory, this is used as the working directory
			{
				Name:      minecraftWorkingDirVolumeName,
				MountPath: "/run/minecraft",
			},
			// This will mount the JAR to /usr/local/minecraft/paper.jar
			{
				Name:      minecraftJarVolumeName,
				MountPath: "/usr/local/minecraft",
			},
			// Mount the datapacks at /var/minecraft/world/datapacks
			{
				Name:      dataPacksMountName,
				MountPath: "/var/minecraft/world/datapacks",
			},
		},
	}
}

func baseReplicatSet(ctx context.Context, server *minecraftserverv1.MinecraftServer, mainJavaContainer corev1.Container, initContainers []corev1.Container, replicas int32) (appsv1.ReplicaSet, error) {
	rs := appsv1.ReplicaSet{
		ObjectMeta: metav1.ObjectMeta{
			Name:            server.Name,
			Namespace:       server.Namespace,
			OwnerReferences: []metav1.OwnerReference{serverOwnerReference(server)},
		},

		Spec: appsv1.ReplicaSetSpec{
			Replicas: &replicas,
			Selector: &metav1.LabelSelector{
				MatchLabels: podLabels(server),
			},
			Template: corev1.PodTemplateSpec{
				ObjectMeta: metav1.ObjectMeta{
					Labels: podLabels(server),
				},
				Spec: corev1.PodSpec{
					Volumes: []corev1.Volume{
						{
							Name: minecraftJarVolumeName,
							VolumeSource: corev1.VolumeSource{
								EmptyDir: &corev1.EmptyDirVolumeSource{},
							},
						},
						{
							Name: minecraftWorkingDirVolumeName,
							VolumeSource: corev1.VolumeSource{
								EmptyDir: &corev1.EmptyDirVolumeSource{},
							},
						},
						{
							Name: dataPacksMountName,
							VolumeSource: corev1.VolumeSource{
								EmptyDir: &corev1.EmptyDirVolumeSource{},
							},
						},
					},
				},
			},
		},
	}

	if server.Spec.VanillaTweaks != nil {
		vtDownloadContainer, err := vanillaTweaksDatapackContainer(ctx, dataPacksMountName, server.Spec.MinecraftVersion, server.Spec.VanillaTweaks)
		if err != nil {
			return appsv1.ReplicaSet{}, err
		}
		initContainers = append(initContainers, vtDownloadContainer)
	}

	rs.Spec.Template.Spec.InitContainers = initContainers
	rs.Spec.Template.Spec.Containers = append(rs.Spec.Template.Spec.Containers, mainJavaContainer)

	// Put the security context on *everything*
	for i := range rs.Spec.Template.Spec.InitContainers {
		rs.Spec.Template.Spec.InitContainers[i].SecurityContext = securityContext()
	}
	for i := range rs.Spec.Template.Spec.Containers {
		rs.Spec.Template.Spec.Containers[i].SecurityContext = securityContext()
	}

	return rs, nil
}

type HashType string

const (
	HashTypeSha256 HashType = "sha256"
	HashTypeSha1   HashType = "sha1"
)

func downloadContainer(url string, hashType HashType, hash string, filename string, volumeMountName string) corev1.Container {
	return corev1.Container{
		Name:            "download-" + strings.Replace(filename, ".", "-", -1),
		Image:           "ghcr.io/bricklou/kubestro-download:latest",
		ImagePullPolicy: corev1.PullAlways,
		Args: []string{
			"downloader",
			"--url",
			url,
			"--target",
			filepath.Join("/download", filename),
			"--hash-type",
			string(hashType),
			"--hash",
			hash,
		},
		VolumeMounts: []corev1.VolumeMount{
			{
				Name:      volumeMountName,
				MountPath: "/download",
			},
		},
	}
}

// Spigot really, *really* wants to be able to write to its config files. So we copy them over from the configmap to
// the Spigot server's working directory in /run/minecraft to let it run all over them.
// TODO Handle live changes to these files, maybe with some kind of sidecar?
func copyConfigContainer(configVolumeMountName, paperWorkingDirVolumeName string) corev1.Container {
	return corev1.Container{
		Name:  "copy-config",
		Image: "busybox",
		// We use sh here to get file globbing with the *.
		Args: []string{"sh", "-c", "cp /etc/minecraft/* /run/minecraft/"},
		VolumeMounts: []corev1.VolumeMount{
			// This will mount config files, like server.properties, under /etc/minecraft/server.properties
			{
				Name:      configVolumeMountName,
				MountPath: "/etc/minecraft",
			},
			// This gives paper a writeable runtime directory, this is used as the working directory.
			{
				Name:      paperWorkingDirVolumeName,
				MountPath: "/run/minecraft",
			},
		},
	}
}

func vanillaTweaksDatapackContainer(ctx context.Context, datapacksVolumeMountName string, version string, tweaks *minecraftserverv1.VanillaTweaks) (corev1.Container, error) {
	url, err := vanillatweaks.GetDatapackDownloadURL(ctx, version, tweaks.Datapacks)
	if err != nil {
		return corev1.Container{}, err
	}

	return corev1.Container{
		Name:  "install-vanillatweaks",
		Image: "busybox",
		Args:  []string{"sh", "-c", "cd /var/minecraft/world/datapacks && wget -O vt.zip '" + url + "' && unzip vt.zip && rm vt.zip"},
		VolumeMounts: []corev1.VolumeMount{
			{
				Name:      datapacksVolumeMountName,
				MountPath: "/var/minecraft/world/datapacks",
			},
		},
	}, nil
}

func applySecurityContext(rs *appsv1.ReplicaSet) {
	// Put the security context on *everything*
	for i := range rs.Spec.Template.Spec.InitContainers {
		rs.Spec.Template.Spec.InitContainers[i].SecurityContext = securityContext()
	}
	for i := range rs.Spec.Template.Spec.Containers {
		rs.Spec.Template.Spec.Containers[i].SecurityContext = securityContext()
	}
}
