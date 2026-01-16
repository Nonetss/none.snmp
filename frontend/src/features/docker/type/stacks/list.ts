export interface ListStackDocker {
  response: Response[]
  metadata: Metadata
}

export interface Metadata {
  exists: boolean
  total_stacks: number
  total_servers: number
  servers: string[]
  total_tags: number
  tags: string[]
}

export interface Response {
  id: string
  type: string
  name: string
  template: boolean
  tags: string[]
  info: Info
  server_name: string
}

export interface Info {
  server_id: string
  files_on_host: boolean
  file_contents: boolean
  linked_repo: string
  git_provider: string
  repo: string
  branch: string
  repo_link: string
  state: string
  status: string | null
  services: Service[]
  project_missing: boolean
  missing_files: any[]
  deployed_hash: null | string
  latest_hash: null | string
}

export interface Service {
  service: string
  image: string
  update_available: boolean
}
