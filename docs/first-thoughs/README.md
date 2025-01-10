# What is this folder for?

It contains my first thoughts about the project. Especially, how I want to
structure and design it.

## How do I want to structure the project?

Globally, i want to arrange the project in the cleaner way possible, so it will
be easier to maintain and extend. To achieve this, I was thinking about a
micro-services architecture. This way, anyone would be able to integrate new
games or services to the core project without having to touch the core code.

We can divide the project in 3 main parts:

1. **Frontend**: The client sie of the project. This is the dashboard from where
   the users will be able to manage their game servers. The idea will be to take
   advantage of [Modules Federations](https://module-federation.io/) to create a
   micro-frontend architecture.

2. **Core**: The core of the project. All the main logic will be located here.
   It will be responsible for managing the game servers, the users with
   authentication (passwod, OAuth2, etc).

3. **Game server gateway**: A gateway will be the dedicated implementation to
   manage gate servers. Let's say we want to add a new game server, we will have
   to create a new gateway for it. This gateway will be registered to the core
   and will also provide frontend files to extend the interface.

> ![INFO] At the moment, I am only thinking about deploying to Kubernetes. But
> depending on how things evolves, I might also consider other backends like
> Docker/Podman.

From the explaination above, this should give something like this:

```mermaid
architecture-beta
  group core(cloud)[Core]

  service frontend(internet)[Frontend]
  service core(server)[Core]
  service database(database)[Database]
  service gateway1(server)[Game Server Gateway 1]
  service gateway2(server)[Game Server Gateway 2]

  frontend -- core
  core -- database
  core -- gateway1
  core -- gateway2
```

## How game servers will deployed?

To deploy game servers, gateways take take advantage of Kubernetes custom
resources. This are, in fact, kubernetes operators that will extends the
Kubernetes API with custom resources.

For example, let's say we want to deploy a Minecraft server. We will have to
ceate a new custom resource for it. This custom resource will be managed by the
Minecraft gateway. This gateway will be responsible for creating the game
server, managing it and also providing the frontend files to extend the
interface. This also include all the possible logic and actions related to a
servers like managings backups, worlds, mods, etc.

## How would the project be extensible?

Like explained in the previous section, the project will be extensible by
creating new gateways interacting with Kubernetes. Each gateway will be
responsible for managing a specific game server.

