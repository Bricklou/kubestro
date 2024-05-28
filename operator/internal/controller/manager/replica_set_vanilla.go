package manager

import (
	"context"
	minecraftserverv1 "github.com/bricklou/kubestro/api/manager/v1"
	"github.com/bricklou/kubestro/internal/bookshelf/vanilla"
	appsv1 "k8s.io/api/apps/v1"
	corev1 "k8s.io/api/core/v1"
)

func rsForServerTypeVanilla(ctx context.Context, server *minecraftserverv1.MinecraftServer) (appsv1.ReplicaSet, error) {
	const configVolumeMountName = "config"
	var minecraftVersion = server.Spec.MinecraftVersion

	versionManifest, err := vanilla.GetVersionManifest(minecraftVersion)
	if err != nil {
		return appsv1.ReplicaSet{}, err
	}
	url, sha1, err := vanilla.GetDownloadURLAndSHA1(versionManifest)
	if err != nil {
		return appsv1.ReplicaSet{}, err
	}

	minecraftDownloadContainer := downloadContainer(url, HashTypeSha1, sha1, "minecraft.jar", minecraftJarVolumeName)
	copyConfigContainer := copyConfigContainer(configVolumeMountName, minecraftWorkingDirVolumeName)

	initContainers := []corev1.Container{minecraftDownloadContainer, copyConfigContainer}

	mainJavaContainer := baseMainJavaContainer(versionManifest.JavaVersion.MajorVersion)
	mainJavaContainer.Args = []string{
		"java",
		///////////////////////////////
		// Flags here are flags to Java
		///////////////////////////////
		"-jar",
		"/usr/local/minecraft/minecraft.jar",
		////////////////////////////////////////////////////////////
		// Flags after this point are flags to Minecraft, and not Java
		////////////////////////////////////////////////////////////
		// Set the world directory to be /var/minecraft (since 1.14)
		"--universe=/var/minecraft",
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
	)

	applySecurityContext(&rs)

	return rs, nil
}
