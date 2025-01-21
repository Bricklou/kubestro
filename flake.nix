{
  description = "Kubestro project : deploy your games servers easily in kubernetes";

  inputs = {
    # NixOS official package source, using the nixos' unstable branch by default
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

    # Flake utils
    flake-utils = {
      url = "github:numtide/flake-utils";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    pre-commit-hooks = {
      # add git hooks to format code before commit
      url = "github:cachix/git-hooks.nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    rust-overlay = {
      url = "github:oxalica/rust-overlay";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  # Development shell
  outputs = {
    self,
    nixpkgs,
    flake-utils,
    pre-commit-hooks,
    rust-overlay,
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      overlays = [(import rust-overlay)];
      pkgs = import nixpkgs {
        inherit system overlays;
      };
    in {
      checks = {
        pre-commit-check = pre-commit-hooks.lib.${system}.run {
          src = "./.";
          hooks = {
            # Source code spell checker
            typos = {
              enable = true;
              settings = {
                write = true;
                configPath = ".typos.toml"; # relative to the flake root
              };
            };

            # Code and config formatter
            prettier = {
              enable = true;
              settings = {
                write = true;
                configPath = ".prettierrc.yaml"; # relative to the flake root
              };
              files = ".+\.(mdx?|ya?ml|json|css)";
            };

            # Rust code formatter
            clippy = {
              enable = true;
              packageOverrides = {
                cargo = pkgs.cargo;
                clippy = pkgs.clippy;
              };
              settings = {
                allFeatures = true;
                extraArgs = "--all-targets";
              };
            };

            # Ensure no one commits to the main branch
            no-commit-to-branch.enable = true;

            # Nix code formatter
            alejandra.enable = true; # formatter

            # ========================
            # Custom hooks
            # ========================

            # Format backend code
            format-backend = {
              enable = true;
              description = "Format backend code";
              entry = "cargo fmt -- --config-path=./configs/rustfmt.toml";
              files = "projects/[^/]+/backend/.+\.rs";
            };
            format-javascript = {
              enable = true;
              description = "Format and lint frontend code";
              entry = "eslint --flag unstable_config_lookup_from_file";
              files = ".+\.(m?jsx?|tsx?)";
            };
            lint-css = {
              enable = true;
              description = "Format and lint css code";
              entry = "stylelint --fix --config ./configs/stylelint-config.mjs";
              files = ".+\.css";
            };
          };
        };
      };

      devShells.default = pkgs.mkShell {
        buildInputs = with pkgs;
          [
            # fix https://discourse.nixos.org/t/non-interactive-bash-errors-from-flake-nix-mkshell/33310
            bashInteractive
            # fix `cc` replaced by clang, which causes nvim-treesitter compilation error
            gcc

            # task runner
            go-task

            # spell checker
            typos

            # nodejs deps
            nodejs_22
            pnpm

            # rust
            rustfmt
            rust-bin.stable.latest.default
            cargo-workspaces
            cargo-watch
          ]
          ++ self.checks.${system}.pre-commit-check.enabledPackages;

        shellHook = ''
          ${self.checks.${system}.pre-commit-check.shellHook}
          export PATH="$(${pkgs.pnpm}/bin/pnpm bin):$PATH"

          # Install Dependencies
          go-task install
        '';
      };
    });
}
