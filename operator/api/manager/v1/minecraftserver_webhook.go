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

package v1

import (
	"context"
	apierrors "k8s.io/apimachinery/pkg/api/errors"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apimachinery/pkg/runtime/schema"
	"k8s.io/apimachinery/pkg/util/validation/field"
	ctrl "sigs.k8s.io/controller-runtime"
	logf "sigs.k8s.io/controller-runtime/pkg/log"
	"sigs.k8s.io/controller-runtime/pkg/webhook"
	"sigs.k8s.io/controller-runtime/pkg/webhook/admission"
)

// log is for logging in this package.
var minecraftserverlog = logf.Log.WithName("minecraftserver-resource")

// SetupWebhookWithManager will setup the manager to manage the webhooks
func (r *MinecraftServer) SetupWebhookWithManager(mgr ctrl.Manager) error {
	return ctrl.NewWebhookManagedBy(mgr).
		For(r).
		Complete()
}

// TODO(user): EDIT THIS FILE!  THIS IS SCAFFOLDING FOR YOU TO OWN!

//+kubebuilder:webhook:path=/mutate-manager-bricklou-ovh-v1-minecraftserver,mutating=true,failurePolicy=fail,sideEffects=None,groups=manager.bricklou.ovh,resources=minecraftservers,verbs=create;update,versions=v1,name=mminecraftserver.kb.io,admissionReviewVersions=v1

var _ webhook.Defaulter = &MinecraftServer{}

// Default implements webhook.Defaulter so a webhook will be registered for the type
func (r *MinecraftServer) Default() {
	minecraftserverlog.Info("default", "name", r.Name)
}

// TODO(user): change verbs to "verbs=create;update;delete" if you want to enable deletion validation.
//+kubebuilder:webhook:path=/validate-manager-bricklou-ovh-v1-minecraftserver,mutating=false,failurePolicy=fail,sideEffects=None,groups=manager.bricklou.ovh,resources=minecraftservers,verbs=create;update,versions=v1,name=vminecraftserver.kb.io,admissionReviewVersions=v1

var _ webhook.CustomValidator = &MinecraftServer{}

// ValidateCreate implements webhook.Validator so a webhook will be registered for the type
func (r *MinecraftServer) ValidateCreate(ctx context.Context, obj runtime.Object) (admission.Warnings, error) {
	minecraftserverlog.Info("validate create", "name", r.Name)
	return nil, r.validateMinecraftServer()
}

// ValidateUpdate implements webhook.Validator so a webhook will be registered for the type
func (r *MinecraftServer) ValidateUpdate(ctx context.Context, oldObj runtime.Object, newObj runtime.Object) (admission.Warnings, error) {
	minecraftserverlog.Info("validate update", "name", r.Name)
	return nil, r.validateMinecraftServer()
}

// ValidateDelete implements webhook.Validator so a webhook will be registered for the type
func (r *MinecraftServer) ValidateDelete(ctx context.Context, obj runtime.Object) (admission.Warnings, error) {
	minecraftserverlog.Info("validate delete", "name", r.Name)
	return nil, nil
}

func (r *MinecraftServer) validateMinecraftServer() error {
	var allErrs field.ErrorList
	if err := r.validateMonitoring(); err != nil {
		allErrs = append(allErrs, err)
	}

	return apierrors.NewInvalid(schema.GroupKind{
		Group: "manager.bricklou.ovh",
		Kind:  "MinecraftServer",
	}, r.Name, allErrs)
}

func (r *MinecraftServer) validateMonitoring() *field.Error {
	// The field helpers from the kubernetes API machinery help us return nicely
	// structured validation errors.

	if r.Spec.Type == ServerTypeVanilla && r.Spec.Monitoring != nil {
		return field.NotSupported(
			field.NewPath("spec").Child("monitoring"),
			r.Spec.Monitoring,
			[]ServerType{ServerTypePaper, ServerTypeForge},
		)
	}
	return nil
}
