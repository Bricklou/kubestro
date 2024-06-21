# kubestro

A kubernetes automated dashboard to deploy your Minecraft servers.

## Description

When deploying a Minecraft server, we often use the same tools : hosting providers, bare bones linux server,
docker container, Pterodactyl instance, etc. What i'm looking for, is something similar to what we know with
Pterodactyl : a good and simple to use web dashboard to deploy servers but, this time, inside a Kubernetes cluster.

This mainly answer a personal desire to take the advantage of my own Kubernetes cluster to deploy any kind of Minecraft servers.

## Getting Started

### How does it work?

The project is divived in 4 sub-projects: [api](./projects/api/), [operator](./projects/operator/), [download](./projects/download/)
and [webui](./projects/webui/).

- [**Operator**](./projects/operator/) handles all the deployment logic on the Kubernetes side. This means that, when we will deploy a custom resource (i.e. `MinecraftServer`),
  the operator will translate it into Kubernetes primitives kinds (`StatefulSet`, `Pods`, `Service`, etc.).
- [**Download**](./projects/download/) is a small tool used to download required files and ensure the hash match with the one expected.
  It is useful to download Minecraft required files like the `server.jar`, mods/plugins or even extra resources.
- [**api**](./projects/api/) is the actual HTTP API of the kubestro dashboard. The API will handle all the interaction and then process the deployment of
  custom resources on the cluster.
- [**webui**](./projects/webui/) is the dashboard itself. It will be served through the same container as the API, and will be presented to the user to
  interact with the cluster.

## Contributing

Contributions are always welcome!

See [contributing.md](./CONTRIBUTING.md) for ways to get started.

Please also adhere to this project's [CODE OF CONDUCT](./CODE_OF_CONDUCT.md)

## License

This project is under MIT license. It can be found [here](./LICENSE) or on https://opensource.org/license/mit.

## Acknowledgements

- [Kubebuilder](https://book.kubebuilder.io/)
- [bagashiz's Go POS project](https://github.com/bagashiz/go-pos/) for its pretty implementation of hexagonal architecture in Golang
- [Kubecraft](https://github.com/serainville/Kubecraft) and [kubernetes-minecraft-operator](https://github.com/JamesLaverack/kubernetes-minecraft-operator)
  for the inspirations for my own operator implementation.
