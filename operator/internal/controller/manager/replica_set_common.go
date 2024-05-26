package manager

import (
	"fmt"
	minecraftserverv1 "github.com/bricklou/kubestro/api/manager/v1"
	appsv1 "k8s.io/api/apps/v1"
	corev1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/resource"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/utils/pointer"
)

const minecraftJarVolumeName = "minecraft-jar"
const minecraftWorkingDirVolumeName = "minecraft-workingdir"
const overworldMountName = "world-overworld"
const netherMountName = "world-nether"
const theEndMountName = "world-the-end"
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
		Ports: []corev1.ContainerPort{
			{
				Name:          "minecraft",
				ContainerPort: 25565,
				Protocol:      corev1.ProtocolTCP,
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
			// Mount the various world directories under /var/minecraft
			{
				Name:      overworldMountName,
				MountPath: "/var/minecraft/world",
			},
			{
				Name:      netherMountName,
				MountPath: "/var/minecraft/world_nether",
			},
			{
				Name:      theEndMountName,
				MountPath: "/var/minecraft/world_the_end",
			},
			// Mount the datapacks at /var/minecraft/world/datapacks
			{
				Name:      dataPacksMountName,
				MountPath: "/var/minecraft/world/datapacks",
			},
		},
	}
}

func baseReplicatSet(server *minecraftserverv1.MinecraftServer, mainJavaContainer corev1.Container, initContainers []corev1.Container, replicas int32) appsv1.ReplicaSet {
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

	if false {
		// TODO server world
	} else {
		// No World to persist, so mount EmptyDir volumes
		rs.Spec.Template.Spec.Volumes = append(rs.Spec.Template.Spec.Volumes,
			corev1.Volume{
				Name: overworldMountName,
				VolumeSource: corev1.VolumeSource{
					EmptyDir: &corev1.EmptyDirVolumeSource{},
				},
			},
			corev1.Volume{
				Name: netherMountName,
				VolumeSource: corev1.VolumeSource{
					EmptyDir: &corev1.EmptyDirVolumeSource{},
				},
			},
			corev1.Volume{
				Name: theEndMountName,
				VolumeSource: corev1.VolumeSource{
					EmptyDir: &corev1.EmptyDirVolumeSource{},
				},
			},
		)
	}

	// TODO Vanilla tweaks

	rs.Spec.Template.Spec.InitContainers = initContainers
	rs.Spec.Template.Spec.Containers = append(rs.Spec.Template.Spec.Containers, mainJavaContainer)

	// Put the security context on *everything*
	for i := range rs.Spec.Template.Spec.InitContainers {
		rs.Spec.Template.Spec.InitContainers[i].SecurityContext = securityContext()
	}
	for i := range rs.Spec.Template.Spec.Containers {
		rs.Spec.Template.Spec.Containers[i].SecurityContext = securityContext()
	}

	return rs
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
