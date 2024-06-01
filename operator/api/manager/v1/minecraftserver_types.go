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
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// +kubebuilder:validation:Enum=Vanilla;Paper;Forge
// +kubebuilder:default:=Vanilla
type ServerType string

const (
	ServerTypeVanilla ServerType = "Vanilla"
	ServerTypePaper   ServerType = "Paper"
	ServerTypeForge   ServerType = "Forge"
)

// +kubebuilder:validation:Enum=Accepted;NotAccepted
type EulaAcceptance string

const (
	EulaAcceptanceAccepted    EulaAcceptance = "Accepted"
	EulaAcceptanceNotAccepted EulaAcceptance = "NotAccepted"
)

// Player is a Minecraft player defined by a username or a UUID
type Player struct {
	Name string `json:"name,omitempty"`
	UUID string `json:"uuid,omitempty"`
}

type WorldSpec struct {
	Seed      string                                    `json:"seed:seed,omitempty"`
	Overworld *corev1.PersistentVolumeClaimVolumeSource `json:"overworld,omitempty"`
	Nether    *corev1.PersistentVolumeClaimVolumeSource `json:"nether,omitempty"`
	TheEnd    *corev1.PersistentVolumeClaimVolumeSource `json:"theEnd,omitempty"`
}

type VanillaTweaks struct {
	Datapacks []VanillaTweaksDatapack `json:"datapacks,omitempty"`
}

type VanillaTweaksDatapack struct {
	Name     string `json:"name"`
	Category string `json:"category"`
}

// +kubebuilder:validation:Enum=Disabled;PrometheusServiceMonitor
type MonitoringType string

const (
	MonitoringTypeDisabled                 MonitoringType = "Disabled"
	MonitoringTypePrometheusServiceMonitor MonitoringType = "PrometheusServiceMonitor"
)

type MonitoringSpec struct {
	Type MonitoringType `json:"type"`
}

// +kubebuilder:validation:Enum=Survival;Creative;Adventure;Spectator
// +kubebuilder:default:=Survial
type GameMode string

const (
	GameModeSurvival  GameMode = "Survival"
	GameModeCreative  GameMode = "Creative"
	GameModeAdventure GameMode = "adventure"
	GameModeSpectator GameMode = "spectator"
)

// +kubebuilder:validation:Enum=Public;AllowListOnly
// +kubebuilder:default:=AllowListOnly
type AccessMode string

const (
	AccessModeAllowListOnly AccessMode = "AllowListOnly"
	AccessModePublic        AccessMode = "Public"
)

// MinecraftServerSpec defines the desired state of MinecraftServer
type MinecraftServerSpec struct {
	// The EULA need to be accepted to allow the Minecraft server to boot.
	EULA EulaAcceptance `json:"eula"`
	// The minecraft version that the server will run with. By default, the value will be "latest".
	// +kubebuilder:validation:Optional
	// +kubebuilder:default:=latest
	MinecraftVersion string `json:"minecraftVersion"`
	// Server type that will run
	Type ServerType `json:"type"`
	// The access mode determine if the whitelist is enabled or not
	AccessMode AccessMode `json:"accessMode"`
	// List of players allowed to connect when AccessMode is true
	AllowList []Player `json:"allowList,omitempty"`
	// List of players with OP permissions
	OpsList []Player `json:"opsList,omitempty"`
	// Worlds configuration, this will allow to specify custom volumes or particular seed
	World *WorldSpec `json:"world,omitempty"`
	// Message of the day
	MOTD string `json:"motd"`
	// Default game mode when a player join
	GameMode GameMode `json:"gameMode"`
	// Total number of players that can join the server
	// +kubebuilder:validation:min=0
	// +kubebuilder:default:=10
	MaxPlayers int `json:"maxPlayers"`
	// Number of chunks a player will be able to load at the same time
	// +kubebuilder:validation:min=1
	// +kubebuilder:validation:Optional
	// +kubebuilder:default:=10
	ViewDistance int `json:"viewDistance"`
	// Service type used to expose the minecraft server
	Service *ServiceSpec `json:"service"`
	// Vanilla tweaks to enable when running the server
	VanillaTweaks *VanillaTweaks `json:"vanillaTweaks,omitempty"`
	// If specified, the server will be configured to be monitored by Prometheus
	Monitoring *MonitoringSpec `json:"monitoring,omitempty"`
}

// +kubebuilder:validation:Enum=None;ClusterIP;NodePort;LoadBalancer
type ServiceType string

const ServiceTypeNone ServiceType = "None"
const ServiceTypeClusterIP ServiceType = "ClusterIP"
const ServiceTypeNodePort ServiceType = "NodePort"
const ServiceTypeLoadBalancer ServiceType = "LoadBalancer"

// ServiceSpec is very much like a corev1.ServiceSpec, but with only *some* fields.
type ServiceSpec struct {
	Type ServiceType `json:"type"`
	// Port to bind Minecraft to if using a NodePort or LoadBalancer service
	MinecraftNodePort *int32 `json:"minecraftNodePort,omitempty"`
}

// +kubebuilder:validation:Enum=Pending;Running;Error
type State string

const (
	StatePending State = "Pending"
	StateRunning State = "Running"
	StateError   State = "Error"
)

// MinecraftServerStatus defines the observed state of MinecraftServer
type MinecraftServerStatus struct {
	State State `json:"state"`
}

//+kubebuilder:object:root=true
//+kubebuilder:subresource:status

// MinecraftServer is the Schema for the minecraftservers API
type MinecraftServer struct {
	metav1.TypeMeta   `json:",inline"`
	metav1.ObjectMeta `json:"metadata,omitempty"`

	Spec   MinecraftServerSpec   `json:"spec,omitempty"`
	Status MinecraftServerStatus `json:"status,omitempty"`
}

//+kubebuilder:object:root=true

// MinecraftServerList contains a list of MinecraftServer
type MinecraftServerList struct {
	metav1.TypeMeta `json:",inline"`
	metav1.ListMeta `json:"metadata,omitempty"`
	Items           []MinecraftServer `json:"items"`
}

func init() {
	SchemeBuilder.Register(&MinecraftServer{}, &MinecraftServerList{})
}
