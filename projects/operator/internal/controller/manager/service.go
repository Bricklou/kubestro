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

func Service(ctx context.Context, k8s client.Client, server *minecraftserverv1.MinecraftServer) (bool, error) {
	logger := log.FromContext(ctx)

	var actualService corev1.Service
	err := k8s.Get(ctx, client.ObjectKeyFromObject(server), &actualService)
	if client.IgnoreNotFound(err) != nil {
		return false, err
	}

	if server.Spec.Service == nil || server.Spec.Service.Type == minecraftserverv1.ServiceTypeNone {
		// We should make sure we *don't* have a service.
		if apierrors.IsNotFound(err) {
			logger.Info("Service does not exists, creating")
			return false, nil
		}
		logger.Info("Service exists when it shoudln't, removing")
		return true, k8s.Delete(ctx, &actualService)
	}

	expectedService := serviceForServer(server)

	if apierrors.IsNotFound(err) {
		logger.Info("Service doesn't exists, creating")
		return true, k8s.Create(ctx, &expectedService)
	}

	// Check service for integrity
	if !hasCorrectOwnerReference(server, &actualService) {
		logger.Info("Service owner references incorrect, updating")
		actualService.OwnerReferences = append(actualService.OwnerReferences, serverOwnerReference(server))
		return true, k8s.Update(ctx, &actualService)
	}

	if actualService.Spec.Type != expectedService.Spec.Type {
		logger.Info("Service type incorrect, updating")
		actualService.Spec.Type = expectedService.Spec.Type
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

	logger.V(LogLevelDebug).Info("Service OK")
	return false, nil
}

func serviceForServer(server *minecraftserverv1.MinecraftServer) corev1.Service {
	prefer := corev1.IPFamilyPolicyPreferDualStack
	service := corev1.Service{
		ObjectMeta: metav1.ObjectMeta{
			Name:            server.Name,
			Namespace:       server.Namespace,
			OwnerReferences: []metav1.OwnerReference{serverOwnerReference(server)},
		},
		Spec: corev1.ServiceSpec{
			IPFamilyPolicy: &prefer,
			Type:           corev1.ServiceType(server.Spec.Service.Type),
			Selector:       podLabels(server),
			Ports: []corev1.ServicePort{
				{
					Name:     "minecraft",
					Port:     25565,
					Protocol: corev1.ProtocolTCP,
				},
			},
		},
	}

	if server.Spec.Service.MinecraftNodePort != nil && *server.Spec.Service.MinecraftNodePort > 0 {
		service.Spec.Ports[0].NodePort = *server.Spec.Service.MinecraftNodePort
	}

	return service
}
