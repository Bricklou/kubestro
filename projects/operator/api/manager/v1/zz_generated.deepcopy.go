//go:build !ignore_autogenerated

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

// Code generated by controller-gen. DO NOT EDIT.

package v1

import (
	corev1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/runtime"
)

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *MinecraftBackup) DeepCopyInto(out *MinecraftBackup) {
	*out = *in
	out.TypeMeta = in.TypeMeta
	in.ObjectMeta.DeepCopyInto(&out.ObjectMeta)
	out.Spec = in.Spec
	out.Status = in.Status
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new MinecraftBackup.
func (in *MinecraftBackup) DeepCopy() *MinecraftBackup {
	if in == nil {
		return nil
	}
	out := new(MinecraftBackup)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyObject is an autogenerated deepcopy function, copying the receiver, creating a new runtime.Object.
func (in *MinecraftBackup) DeepCopyObject() runtime.Object {
	if c := in.DeepCopy(); c != nil {
		return c
	}
	return nil
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *MinecraftBackupList) DeepCopyInto(out *MinecraftBackupList) {
	*out = *in
	out.TypeMeta = in.TypeMeta
	in.ListMeta.DeepCopyInto(&out.ListMeta)
	if in.Items != nil {
		in, out := &in.Items, &out.Items
		*out = make([]MinecraftBackup, len(*in))
		for i := range *in {
			(*in)[i].DeepCopyInto(&(*out)[i])
		}
	}
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new MinecraftBackupList.
func (in *MinecraftBackupList) DeepCopy() *MinecraftBackupList {
	if in == nil {
		return nil
	}
	out := new(MinecraftBackupList)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyObject is an autogenerated deepcopy function, copying the receiver, creating a new runtime.Object.
func (in *MinecraftBackupList) DeepCopyObject() runtime.Object {
	if c := in.DeepCopy(); c != nil {
		return c
	}
	return nil
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *MinecraftBackupSpec) DeepCopyInto(out *MinecraftBackupSpec) {
	*out = *in
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new MinecraftBackupSpec.
func (in *MinecraftBackupSpec) DeepCopy() *MinecraftBackupSpec {
	if in == nil {
		return nil
	}
	out := new(MinecraftBackupSpec)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *MinecraftBackupStatus) DeepCopyInto(out *MinecraftBackupStatus) {
	*out = *in
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new MinecraftBackupStatus.
func (in *MinecraftBackupStatus) DeepCopy() *MinecraftBackupStatus {
	if in == nil {
		return nil
	}
	out := new(MinecraftBackupStatus)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *MinecraftServer) DeepCopyInto(out *MinecraftServer) {
	*out = *in
	out.TypeMeta = in.TypeMeta
	in.ObjectMeta.DeepCopyInto(&out.ObjectMeta)
	in.Spec.DeepCopyInto(&out.Spec)
	out.Status = in.Status
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new MinecraftServer.
func (in *MinecraftServer) DeepCopy() *MinecraftServer {
	if in == nil {
		return nil
	}
	out := new(MinecraftServer)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyObject is an autogenerated deepcopy function, copying the receiver, creating a new runtime.Object.
func (in *MinecraftServer) DeepCopyObject() runtime.Object {
	if c := in.DeepCopy(); c != nil {
		return c
	}
	return nil
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *MinecraftServerList) DeepCopyInto(out *MinecraftServerList) {
	*out = *in
	out.TypeMeta = in.TypeMeta
	in.ListMeta.DeepCopyInto(&out.ListMeta)
	if in.Items != nil {
		in, out := &in.Items, &out.Items
		*out = make([]MinecraftServer, len(*in))
		for i := range *in {
			(*in)[i].DeepCopyInto(&(*out)[i])
		}
	}
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new MinecraftServerList.
func (in *MinecraftServerList) DeepCopy() *MinecraftServerList {
	if in == nil {
		return nil
	}
	out := new(MinecraftServerList)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyObject is an autogenerated deepcopy function, copying the receiver, creating a new runtime.Object.
func (in *MinecraftServerList) DeepCopyObject() runtime.Object {
	if c := in.DeepCopy(); c != nil {
		return c
	}
	return nil
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *MinecraftServerSpec) DeepCopyInto(out *MinecraftServerSpec) {
	*out = *in
	if in.AllowList != nil {
		in, out := &in.AllowList, &out.AllowList
		*out = make([]Player, len(*in))
		copy(*out, *in)
	}
	if in.OpsList != nil {
		in, out := &in.OpsList, &out.OpsList
		*out = make([]Player, len(*in))
		copy(*out, *in)
	}
	if in.World != nil {
		in, out := &in.World, &out.World
		*out = new(WorldSpec)
		(*in).DeepCopyInto(*out)
	}
	if in.Service != nil {
		in, out := &in.Service, &out.Service
		*out = new(ServiceSpec)
		(*in).DeepCopyInto(*out)
	}
	if in.VanillaTweaks != nil {
		in, out := &in.VanillaTweaks, &out.VanillaTweaks
		*out = new(VanillaTweaks)
		(*in).DeepCopyInto(*out)
	}
	if in.Monitoring != nil {
		in, out := &in.Monitoring, &out.Monitoring
		*out = new(MonitoringSpec)
		**out = **in
	}
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new MinecraftServerSpec.
func (in *MinecraftServerSpec) DeepCopy() *MinecraftServerSpec {
	if in == nil {
		return nil
	}
	out := new(MinecraftServerSpec)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *MinecraftServerStatus) DeepCopyInto(out *MinecraftServerStatus) {
	*out = *in
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new MinecraftServerStatus.
func (in *MinecraftServerStatus) DeepCopy() *MinecraftServerStatus {
	if in == nil {
		return nil
	}
	out := new(MinecraftServerStatus)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *MonitoringSpec) DeepCopyInto(out *MonitoringSpec) {
	*out = *in
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new MonitoringSpec.
func (in *MonitoringSpec) DeepCopy() *MonitoringSpec {
	if in == nil {
		return nil
	}
	out := new(MonitoringSpec)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *Player) DeepCopyInto(out *Player) {
	*out = *in
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new Player.
func (in *Player) DeepCopy() *Player {
	if in == nil {
		return nil
	}
	out := new(Player)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *ServiceSpec) DeepCopyInto(out *ServiceSpec) {
	*out = *in
	if in.MinecraftNodePort != nil {
		in, out := &in.MinecraftNodePort, &out.MinecraftNodePort
		*out = new(int32)
		**out = **in
	}
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new ServiceSpec.
func (in *ServiceSpec) DeepCopy() *ServiceSpec {
	if in == nil {
		return nil
	}
	out := new(ServiceSpec)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *VanillaTweaks) DeepCopyInto(out *VanillaTweaks) {
	*out = *in
	if in.Datapacks != nil {
		in, out := &in.Datapacks, &out.Datapacks
		*out = make([]VanillaTweaksDatapack, len(*in))
		copy(*out, *in)
	}
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new VanillaTweaks.
func (in *VanillaTweaks) DeepCopy() *VanillaTweaks {
	if in == nil {
		return nil
	}
	out := new(VanillaTweaks)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *VanillaTweaksDatapack) DeepCopyInto(out *VanillaTweaksDatapack) {
	*out = *in
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new VanillaTweaksDatapack.
func (in *VanillaTweaksDatapack) DeepCopy() *VanillaTweaksDatapack {
	if in == nil {
		return nil
	}
	out := new(VanillaTweaksDatapack)
	in.DeepCopyInto(out)
	return out
}

// DeepCopyInto is an autogenerated deepcopy function, copying the receiver, writing into out. in must be non-nil.
func (in *WorldSpec) DeepCopyInto(out *WorldSpec) {
	*out = *in
	if in.Overworld != nil {
		in, out := &in.Overworld, &out.Overworld
		*out = new(corev1.PersistentVolumeClaimVolumeSource)
		**out = **in
	}
	if in.Nether != nil {
		in, out := &in.Nether, &out.Nether
		*out = new(corev1.PersistentVolumeClaimVolumeSource)
		**out = **in
	}
	if in.TheEnd != nil {
		in, out := &in.TheEnd, &out.TheEnd
		*out = new(corev1.PersistentVolumeClaimVolumeSource)
		**out = **in
	}
}

// DeepCopy is an autogenerated deepcopy function, copying the receiver, creating a new WorldSpec.
func (in *WorldSpec) DeepCopy() *WorldSpec {
	if in == nil {
		return nil
	}
	out := new(WorldSpec)
	in.DeepCopyInto(out)
	return out
}