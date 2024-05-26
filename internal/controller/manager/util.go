package manager

import (
	minecraftserverv1 "github.com/bricklou/kubestro/api/manager/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func serverOwnerReference(server *minecraftserverv1.MinecraftServer) metav1.OwnerReference {
	return *metav1.NewControllerRef(server, minecraftserverv1.GroupVersion.WithKind("MinecraftServer"))
}

// hasCorrectOwnerReference verifies that the given object has the correct owner reference set on it
func hasCorrectOwnerReference(server *minecraftserverv1.MinecraftServer, actual metav1.Object) bool {
	expected := serverOwnerReference(server)
	for _, ow := range actual.GetOwnerReferences() {
		if ow.APIVersion == expected.APIVersion && ow.Name == expected.Name && ow.Kind == expected.Kind {
			return true
		}
	}
	return false
}

func podLabels(server *minecraftserverv1.MinecraftServer) map[string]string {
	return map[string]string{
		"app":       "minecraft",
		"minecraft": server.Name,
	}
}

const LogLevelDebug int = 4
