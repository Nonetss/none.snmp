export interface GetServerDocker {
  response: Response
  metadata: Metadata
}

export interface Metadata {
  exists: boolean
  total_stacks: number
  total_containers: number
  total_tags: number
  tags: string[]
}

export interface Response {
  id: string
  name: string
  description: string
  template: boolean
  tags: string[]
  state: string
  config: Config
  updated_at: number
  stacks: Stack[]
  containers: Container[]
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

export interface Container {
  id: string
  name: string
  image: string
  state: string
  status: string
  created: number
  image_id: string
}

export interface Stack {
  id: string
  name: string
  state: string
  status: null | string
  services: Service[]
}

export interface Service {
  service: string
  image: string
  update_available: boolean
}
