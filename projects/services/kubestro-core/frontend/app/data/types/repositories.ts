export interface Repository {
  id: string
  name: string
  url: string
}

export interface RepositoryWithPackages extends Repository {
  packages: Package[]
}

export interface Package {
  id: string
  name: string
  version: string
  description: string
}
