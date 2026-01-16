export interface ProxyInfo {
  response: Response
  metadata: Metadata
}

export interface Metadata {
  exists: boolean
  npm: PangolinClass
  pangolin: PangolinClass
  total_resources: number
}

export interface PangolinClass {
  exists: boolean
  total_org: number
}

export interface Response {
  npm: NpmElement[]
  pangolin: Pangolin[]
}

export interface NpmElement {
  url: string
  resource: NpmResource[]
}

export interface NpmResource {
  id: number
  created_on: Date
  modified_on: Date
  owner_user_id: number
  domain_names: string[]
  forward_host: string
  forward_port: number
  access_list_id: number
  certificate_id: number
  ssl_forced: boolean
  caching_enabled: boolean
  block_exploits: boolean
  advanced_config: string
  meta: Meta
  allow_websocket_upgrade: boolean
  http2_support: boolean
  forward_scheme: string
  enabled: boolean
  locations: Location[]
  hsts_enabled: boolean
  hsts_subdomains: boolean
}

export interface Location {
  path: string
  advanced_config: string
  forward_scheme: string
  forward_host: string
  forward_port: number
}

export interface Meta {
  letsencrypt_agree: boolean
  dns_challenge: boolean
  nginx_online: boolean
  nginx_err: null
}

export interface Pangolin {
  url: string
  org: string
  resource: PangolinResource[]
}

export interface PangolinResource {
  resourceId: number
  niceId: string
  name: string
  ssl: boolean
  fullDomain: string
  passwordId: null
  sso: boolean
  pincodeId: null
  whitelist: boolean
  http: boolean
  protocol: string
  proxyPort: null
  enabled: boolean
  domainId: string
  headerAuthId: null
  targets: Target[]
}

export interface Target {
  targetId: number
  ip: string
  port: number
  enabled: boolean
  healthStatus: HealthStatus
}

export enum HealthStatus {
  Healthy = 'healthy',
  Unhealthy = 'unhealthy',
  Unknown = 'unknown',
}
