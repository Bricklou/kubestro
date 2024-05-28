package manager

import (
	"context"
	minecraftserverv1 "github.com/bricklou/kubestro/api/manager/v1"
	"github.com/bricklou/kubestro/internal/bookshelf/paper"
	"github.com/bricklou/kubestro/internal/bookshelf/vanilla"
	appsv1 "k8s.io/api/apps/v1"
	corev1 "k8s.io/api/core/v1"
)

func rsForServerTypePaper(ctx context.Context, server *minecraftserverv1.MinecraftServer) (appsv1.ReplicaSet, error) {
	const configVolumeMountName = "config"
	const pluginsMountName = "plugins"

	var minecraftVersion = server.Spec.MinecraftVersion

	latestBuild, err := paper.LatestBuildForVersion(minecraftVersion)
	if err != nil {
		return appsv1.ReplicaSet{}, err
	}
	url, sha256, err := paper.GetDownloadURLAndSHA256(minecraftVersion, latestBuild)
	if err != nil {
		return appsv1.ReplicaSet{}, err
	}

	paperDownloadContainer := downloadContainer(url, HashTypeSha256, sha256, "paper.jar", minecraftJarVolumeName)
	copyConfigContainer := copyConfigContainer(configVolumeMountName, minecraftWorkingDirVolumeName)

	initContainers := []corev1.Container{paperDownloadContainer, copyConfigContainer}

	minecraftManifest, err := vanilla.GetVersionManifest(minecraftVersion)
	if err != nil {
		return appsv1.ReplicaSet{}, err
	}

	mainJavaContainer := baseMainJavaContainer(minecraftManifest.JavaVersion.MajorVersion)
	mainJavaContainer.Args = []string{
		"java",
		///////////////////////////////
		// Flags here are flags to Java
		///////////////////////////////
		"-jar",
		"/usr/local/minecraft/paper.jar",
		////////////////////////////////////////////////////////////
		// Flags after this point are flags to PaperMC, and not Java
		////////////////////////////////////////////////////////////
		// Set the world directory to be /var/minecraft
		"--world-container=/var/minecraft",
		// Set the plugin directory to be /usr/local/minecraft/plugins
		"--plugins=/usr/local/minecraft/plugins",
		// Disable the on-disk logging, we'll use STDOUT logging always
		"--log-append=false",
		// Disable the GUI, no need in a container
		"--nogui",
	}
	mainJavaContainer.VolumeMounts = append(
		mainJavaContainer.VolumeMounts,
		// This will mount config files like server.properties, under /etc/minecraft/server.properties
		corev1.VolumeMount{
			Name:      configVolumeMountName,
			MountPath: "/etc/minecraft",
		},
		corev1.VolumeMount{
			Name:      pluginsMountName,
			MountPath: "/usr/local/minecraft/plugins",
		},
	)

	var replicas int32 = 1
	rs := baseReplicatSet(server, mainJavaContainer, initContainers, replicas)
	rs.Spec.Template.Spec.Volumes = append(
		rs.Spec.Template.Spec.Volumes,
		corev1.Volume{
			Name: configVolumeMountName,
			VolumeSource: corev1.VolumeSource{
				ConfigMap: &corev1.ConfigMapVolumeSource{
					LocalObjectReference: corev1.LocalObjectReference{
						Name: ConfigMapNameForServer(server),
					},
				},
			},
		},
		corev1.Volume{
			Name: pluginsMountName,
			VolumeSource: corev1.VolumeSource{
				EmptyDir: &corev1.EmptyDirVolumeSource{},
			},
		},
	)

	// TODO Vanilla tweaks

	// TODO dynmap ?

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
