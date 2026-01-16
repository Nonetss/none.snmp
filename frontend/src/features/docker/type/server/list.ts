export interface ListServerDocker {
  response: Response[]
  metadata: Metadata
}

export interface Metadata {
  exists: boolean
  total_servers: number
  total_tags: number
  tags: string[]
}

export interface Response {
  _id: ID
  name: string
  description: string
  template: boolean
  tags: string[]
  info: null
  config: Config
  base_permission: BasePermission
  updated_at: number
  id: string
}

export interface ID {
  $oid: string
}

export enum BasePermission {
  None = 'None',
}

export interface Config {
  address: string
  external_address: string
  region: string
  enabled: boolean
  timeout_seconds: number
  passkey: string
  ignore_mounts: any[]
  stats_monitoring: boolean
  auto_prune: boolean
  links: any[]
  send_unreachable_alerts: boolean
  send_cpu_alerts: boolean
  send_mem_alerts: boolean
  send_disk_alerts: boolean
  send_version_mismatch_alerts: boolean
  cpu_warning: number
  cpu_critical: number
  mem_warning: number
  mem_critical: number
  disk_warning: number
  disk_critical: number
  maintenance_windows: any[]
}
