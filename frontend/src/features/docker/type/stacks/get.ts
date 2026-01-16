export interface GetStackDocker {
  response: Response
  metadata: Metadata
}

export interface Metadata {
  exists: boolean
}

export interface Response {
  _id: ID
  name: string
  description: string
  template: boolean
  tags: string[]
  info: Info
  config: Config
  base_permission: string
  updated_at: number
}

export interface ID {
  $oid: string
}

export interface Config {
  server_id: string
  links: any[]
  project_name: string
  auto_pull: boolean
  run_build: boolean
  poll_for_updates: boolean
  auto_update: boolean
  auto_update_all_services: boolean
  destroy_before_deploy: boolean
  skip_secret_interp: boolean
  linked_repo: string
  git_provider: string
  git_https: boolean
  git_account: string
  repo: string
  branch: string
  commit: string
  clone_path: string
  reclone: boolean
  webhook_enabled: boolean
  webhook_secret: string
  webhook_force_deploy: boolean
  files_on_host: boolean
  run_directory: string
  file_paths: any[]
  env_file_path: string
  additional_env_files: any[]
  config_files: any[]
  send_alerts: boolean
  registry_provider: string
  registry_account: string
  pre_deploy: Deploy
  post_deploy: Deploy
  extra_args: any[]
  build_extra_args: any[]
  ignore_services: any[]
  file_contents: string
  environment: string
}

export interface Deploy {
  path: string
  command: string
}

export interface Info {
  missing_files: any[]
  deployed_project_name: string
  deployed_hash: null
  deployed_message: null
  deployed_contents: DeployedContent[]
  deployed_services: Service[]
  deployed_config: string
  latest_services: Service[]
  remote_contents: null
  remote_errors: null
  latest_hash: null
  latest_message: null
}

export interface DeployedContent {
  path: string
  contents: string
}

export interface Service {
  service_name: string
  container_name: string
  image: string
}
