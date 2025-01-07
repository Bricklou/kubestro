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
        pre-commit-hooks = pre-commit-hooks.lib.${system}.run {
          src = ".";
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
            };
          };
        };
      };

      devShells.default = pkgs.mkShell {
        buildInputs = with pkgs; [
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
        ];

        shellHook = ''
          export PATH=$PATH:$(pnpm bin)

          # Install Dependencies
          go-task install
        '';
      };
    });
}
