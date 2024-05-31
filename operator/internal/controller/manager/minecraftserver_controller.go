/*
Copyright 2024.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package manager

import (
	"context"
	appsv1 "k8s.io/api/apps/v1"
	corev1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/runtime"
	ctrl "sigs.k8s.io/controller-runtime"
	"sigs.k8s.io/controller-runtime/pkg/client"
	"sigs.k8s.io/controller-runtime/pkg/log"

	managerv1 "github.com/bricklou/kubestro/api/manager/v1"
)

// MinecraftServerReconciler reconciles a MinecraftServer object
type MinecraftServerReconciler struct {
	client.Client
	Scheme *runtime.Scheme
}

//+kubebuilder:rbac:groups=manager.bricklou.ovh,resources=minecraftservers,verbs=get;list;watch;create;update;patch;delete
//+kubebuilder:rbac:groups=manager.bricklou.ovh,resources=minecraftservers/status,verbs=get;update;patch
//+kubebuilder:rbac:groups=manager.bricklou.ovh,resources=minecraftservers/finalizers,verbs=update

// Reconcile is part of the main kubernetes reconciliation loop which aims to
// move the current state of the cluster closer to the desired state.
// TODO(user): Modify the Reconcile function to compare the state specified by
// the MinecraftServer object against the actual cluster state, and then
// perform operations to make the cluster state reflect the state specified by
// the user.
//
// For more details, check Reconcile and its Result here:
// - https://pkg.go.dev/sigs.k8s.io/controller-runtime@v0.18.2/pkg/reconcile
func (r *MinecraftServerReconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
	logger := log.FromContext(ctx).WithValues(
		"name", req.Name,
		"namespace", req.Namespace,
		"controller", "MinecraftServer")

	logger.Info("beginning reconciliation")

	// Go back to the API server with a get to find the full definition of he MinecraftServer object (we're only given
	// the name and namespace at this point). We also might fail to find it, as we might have been triggered to
	// reconcile because the object was deleted. In this case, we don't need to do any cleanup, as we set the owner
	// references on every other object we create so the API server's normal cascading delete behaviour will clean up
	// everything
	var server managerv1.MinecraftServer
	if err := r.Get(ctx, req.NamespacedName, &server); err != nil {
		return ctrl.Result{}, client.IgnoreNotFound(err)
	}

	// We'll now create each resource we need. In general, we'll "reconcile" each resource in turn. If there's work to be
	// done, we'll do it an exit instantly. This is because this function is triggered on changes to owned resources, so
	// the act of creating or modifying an owned resource will cause this function to be called anyway.

	// ConfigMap
	done, err := ConfigMap(ctx, r.Client, &server)
	if err != nil {
		return ctrl.Result{}, err
	}
	if done {
		return ctrl.Result{}, nil
	}

	// Services
	done, err = Service(ctx, r.Client, &server)
	if err != nil {
		return ctrl.Result{}, err
	}
	if done {
		return ctrl.Result{}, nil
	}
	done, err = RCONService(ctx, r.Client, &server)
	if err != nil {
		return ctrl.Result{}, err
	}
	if done {
		return ctrl.Result{}, nil
	}

	// Replicat Set
	done, err = ReplicatSet(ctx, r.Client, &server)
	if err != nil {
		return ctrl.Result{}, err
	}
	if done {
		return ctrl.Result{}, nil
	}

	// All good, return
	logger.Info("All good")
	return ctrl.Result{}, nil
}

// SetupWithManager sets up the controller with the Manager.
func (r *MinecraftServerReconciler) SetupWithManager(mgr ctrl.Manager) error {
	return ctrl.NewControllerManagedBy(mgr).
		For(&managerv1.MinecraftServer{}).
		Owns(&corev1.ConfigMap{}).
		Owns(&corev1.Service{}).
		Owns(&appsv1.ReplicaSet{}).
		Complete(r)
}
