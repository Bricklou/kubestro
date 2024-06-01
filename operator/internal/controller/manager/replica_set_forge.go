package manager

import (
	"context"
	minecraftserverv1 "github.com/bricklou/kubestro/api/manager/v1"
	appsv1 "k8s.io/api/apps/v1"
)

func rsForServerTypeForge(ctx context.Context, server *minecraftserverv1.MinecraftServer) (appsv1.ReplicaSet, error) {
	// TODO implement forge server support
	return appsv1.ReplicaSet{}, nil
}
