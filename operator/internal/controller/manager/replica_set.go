package manager

import (
	"context"
	"github.com/pkg/errors"
	corev1 "k8s.io/api/core/v1"
	apierrors "k8s.io/apimachinery/pkg/api/errors"
	"path/filepath"
	"strings"

	appsv1 "k8s.io/api/apps/v1"

	minecraftserverv1 "github.com/bricklou/kubestro/api/manager/v1"
	"sigs.k8s.io/controller-runtime/pkg/client"
	"sigs.k8s.io/controller-runtime/pkg/log"
)

func ReplicatSet(ctx context.Context, k8s client.Client, server *minecraftserverv1.MinecraftServer) (bool, error) {
	logger := log.FromContext(ctx)

	expectedRS, err := rsForServer(ctx, server)
	if err != nil {
		return false, err
	}

	var actualRS appsv1.ReplicaSet
	err = k8s.Get(ctx, client.ObjectKeyFromObject(&expectedRS), &actualRS)
	if apierrors.IsNotFound(err) {
		logger.Info("ReplicaSet does not exist, creating")
		return true, k8s.Create(ctx, &expectedRS)
	} else if err != nil {
		return false, errors.Wrap(err, "error performing GET on ReplicaSet")
	}

	if !hasCorrectOwnerReference(server, &actualRS) {
		// Set the right owner reference. Adding it to any existing ones.
		actualRS.OwnerReferences = append(actualRS.OwnerReferences, serverOwnerReference(server))
		logger.Info("ReplicaSet owner references incorrect, updating")
		return true, k8s.Update(ctx, &actualRS)
	}

	logger.V(LogLevelDebug).Info("ReplicatSet OK")
	return false, nil
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

func rsForServer(ctx context.Context, server *minecraftserverv1.MinecraftServer) (appsv1.ReplicaSet, error) {
	switch server.Spec.Type {
	case minecraftserverv1.ServerTypeVanilla:
		return rsForServerTypeVanilla(ctx, server)
	case minecraftserverv1.ServerTypePaper:
		return rsForServerTypePaper(ctx, server)
	case minecraftserverv1.ServerTypeForge:
		return rsForServerTypeForge(ctx, server)
	default:
		return appsv1.ReplicaSet{}, errors.New("Unrecognised server type")
	}
}
