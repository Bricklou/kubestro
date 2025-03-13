export interface ServiceStatus {
  status: 'installed' | 'not_installed'
  oidc?: {
    display_name?: string
    redirect_url: string
  }
}
