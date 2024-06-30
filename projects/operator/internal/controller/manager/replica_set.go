package manager

import (
	"context"

	"github.com/pkg/errors"
	appsv1 "k8s.io/api/apps/v1"
	apierrors "k8s.io/apimachinery/pkg/api/errors"

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

func rsForServer(ctx context.Context, server *minecraftserverv1.MinecraftServer) (appsv1.ReplicaSet, error) {
	switch server.Spec.Type {
	case minecraftserverv1.ServerTypeVanilla:
		return rsForServerTypeVanilla(ctx, server)
	case minecraftserverv1.ServerTypePaper:
		return rsForServerTypePaper(ctx, server)
	case minecraftserverv1.ServerTypeForge:
		return rsForServerTypeForge(ctx, server)
	// TODO implement fabric server support
	default:
		return appsv1.ReplicaSet{}, errors.New("Unrecognised server type")
	}
}
