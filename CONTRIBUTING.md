# Contributing

First of all, thank you for considering contributing to the project! I will be happy to see new contributors and new ideas to improve the project.

Don't hesitate to open an [discussion](https://github.com/Bricklou/kubestro/discussions) if you have any question or if you want to discuss a new feature or enhancement. In the same way, you can also open a discussion if you want to give some feedback about this contribution guide.

## I have a question

If you have a question about the project, the code, the architecture, the roadmap, etc. you can open a [discussion](https://github.com/Bricklou/kubestro/discussions) and tag it with the `question` label. I will try to answer as soon as possible.

Please, don't open an issue for a question, use the discussions instead. And don't forget to check if your question has already been asked before.

## I have a bug to report

If you find a bug in the project, you can open an [issue](https://github.com/Bricklou/kubestro/issues/new/choose).
Be sure to include as much information as possible to help me reproduce the problem. If you can, please ensure the following:

- You are using the latest version of the project.
- You have determined if you bug is really a bug and not an error on your side. If you are not sure, you can open a discussion.
- You have searched the [issues](https://github.com/Bricklou/kubestro/issues) to see if the bug has already been reported.
  If this is the case, you can add a comment to the existing issue to give more information. The more information, the better!
- You have collected as many information as possible to help me reproduce the bug. This includes:
  - The project version
  - The Kubernetes version
  - The stack trace (if any)
  - The browser version (if the bug is in the web UI)
  - The steps to reproduce the bug (please ensure this is something that can be reliably reproduced)

## I have a feature request

Before opening a feature request, please ensure that the feature is not already in the roadmap. You can check the [project board](https://github.com/users/Bricklou/projects/11) to see the current status of the project.

If the feature is not in the roadmap, you can open a [discussion](https://github.com/Bricklou/kubestro/discussions) to talk about it. If the feature is interesting and can be a good addition to the project, I will add it to the roadmap. And if you want to implement it, you can open a pull request.

## I want to create a pull request

Before creating a pull request, please discuss the change you wish to make via [discussion](https://github.com/Bricklou/kubestro/discussions) like explained
above. This is to ensure that your contribution is in line with the project's roadmap and that it will have higher chances to be accepted.

What are you planning to do? Bug fix, new feature, enhancement, etc.? How will you do it? What are the expected results? What are the potential side effects?
Those are all the things that we can discuss before you start coding.

Once everything is clear, you can create a pull request. Please ensure that your pull request follows the following guidelines:

- The code is well formatted and follows the project's code style.
- The code is well documented. This includes comments in the code, but also the documentation of the new feature or enhancement.
- The code is tested. This includes unit tests, integration tests, end-to-end tests, etc. Ideally, try to work using the Test-Driven Development (TDD) approach.
- The code respect the project's architecture and design.

If you are not sure about one of those points, don't hesitate to ask for help. I will be happy to help you to improve your contribution.

## Repository setup

1. Start by cloning the repository on your local machine.

```bash
git clone <REPO_URL>
```

2. Create a new branch for your contribution.

```bash
git checkout -b <BRANCH_NAME>
```

For the branch name, you can use the git flow convention. For example, if you are working on a new feature, you can name your branch `feature/<FEATURE_NAME>`. If you are working on a bug fix, you can name your branch `bugfix/<BUG_NAME>`, etc.

3. Open the sub-project you want to work on.

The project is divided into 4 sub-projects:

```bash
cd projects/<SUB_PROJECT>
```

4. Install dependencies on your local machine. Please do not update any dependencies along with a feature request. If you find stale dependencies, please open a
   separate pull request to update them.

I am a bit eccentric and I used Nix Flake to manage my dependencies. Ideally, you should use the Nix Flake too. You can install Nix by following the instructions on the [Nix website](https://nixos.org/download.html).
On the other hand, if you don't want to use Nix, you can try installing the required dependencies manually. You can find the dependencies in the `flake.nix` file.

To have a local kubernetes cluster running, you can use K3D. You can install it by following the instructions on the [K3D website](https://k3d.io/#installation).

Please ensure you have the right version of the tools installed on your machine. The versions are the following:

- [NodeJS](https://nodejs.org/fr): ^22.0.0
- [PNPM](https://pnpm.io/): ^10.5.2
- [Rust & Cargo](https://rustup.rs/): ^1.85.0
- [K3D](https://k3d.io/) (optional): ^5.8.2
- [taskfile](https://taskfile.dev/): ^3.41.0
- [helm](https://helm.sh/): ^3.17.0

For all the projects, you can install the dependencies by running the following command:

```bash
task install
```

5. Start a sub-project on your local machine.

```bash
task dev
```

This will start a project in development mode. You can now start coding and see the changes in real-time.

6. To start k3d cluster, you can run the following command:

```bash
task k3d:up
```

7. Migrate the database by running the following command:

```bash
# in the projects/services/kubestro-core/backend directory
task migrate:up
```

8. Run the tests by executing the following command:

```bash
task test
```

9. Once you are done with your changes, you can commit them and push them to your fork. I'm using the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) convention for the commit messages. Please ensure that your commit messages follow this convention.

## Getting recognized as a contributor

We rely on Github to list all the repo contributors in the right-side panel of the repo. Following is an example of the same.

Also, we use the [auto generate release notes](https://docs.github.com/en/repositories/releasing-projects-on-github/automatically-generated-release-notes#about-automatically-generated-release-notes) feature of Github, which adds a reference to the contributor profile within the release notes.
