package manager

import (
	"context"
	minecraftserverv1 "github.com/bricklou/kubestro/api/manager/v1"
	corev1 "k8s.io/api/core/v1"
	apierrors "k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"sigs.k8s.io/controller-runtime/pkg/client"
	"sigs.k8s.io/controller-runtime/pkg/log"
)

func RCONService(ctx context.Context, k8s client.Client, server *minecraftserverv1.MinecraftServer) (bool, error) {
	logger := log.FromContext(ctx)

	expectedService := RConServiceForServer(server)
	logger = logger.WithValues("rcon-service-name", expectedService.Name)

	var actualService corev1.Service
	err := k8s.Get(ctx, client.ObjectKeyFromObject(&expectedService), &actualService)
	if client.IgnoreNotFound(err) != nil {
		return false, err
	}

	if apierrors.IsNotFound(err) {
		logger.Info("Service doesn't exist, creating")
		return true, k8s.Create(ctx, &expectedService)
	}

	// Check service for integrity
	if !hasCorrectOwnerReference(server, &actualService) {
		logger.Info("Service owner references incorrect, adjusting")
		actualService.OwnerReferences = append(actualService.OwnerReferences, serverOwnerReference(server))
		return true, k8s.Update(ctx, &actualService)
	}

	for _, expectedPort := range expectedService.Spec.Ports {
		foundPort := false
		for i, actualPort := range actualService.Spec.Ports {
			if expectedPort.Name == actualPort.Name {
				foundPort = true
				if expectedPort.Protocol != actualPort.Protocol {
					logger.Info("Service port protocol incorrect, updating")
					actualService.Spec.Ports[i].Protocol = expectedPort.Protocol
					return true, k8s.Update(ctx, &actualService)
				}
				if expectedPort.Port != actualPort.Port {
					logger.Info("Service port number incorrect, updating")
					actualService.Spec.Ports[i].Port = expectedPort.Port
					return true, k8s.Update(ctx, &actualService)
				}
				if expectedPort.NodePort != 0 && expectedPort.NodePort != actualPort.NodePort {
					logger.Info("Service node port number incorrect, updating")
					actualService.Spec.Ports[i].NodePort = expectedPort.NodePort
					return true, k8s.Update(ctx, &actualService)
				}
				break

			}
		}

		if !foundPort {
			logger.Info("Service port missing, adding")
			actualService.Spec.Ports = append(actualService.Spec.Ports, expectedPort)
			return true, k8s.Update(ctx, &actualService)
		}
	}

	logger.V(LogLevelDebug).Info("RCON Service OK")
	return false, nil
}

func RConServiceForServer(server *minecraftserverv1.MinecraftServer) corev1.Service {
	prefer := corev1.IPFamilyPolicyPreferDualStack
	service := corev1.Service{
		ObjectMeta: metav1.ObjectMeta{
			Name:            server.Name + "-rcon",
			Namespace:       server.Namespace,
			OwnerReferences: []metav1.OwnerReference{serverOwnerReference(server)},
		},
		Spec: corev1.ServiceSpec{
			IPFamilyPolicy: &prefer,
			Selector:       podLabels(server),
			Ports: []corev1.ServicePort{
				{
					Name:     "rcon",
					Port:     25575,
					Protocol: corev1.ProtocolTCP,
				},
			},
		},
	}

	return service
}
