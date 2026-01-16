export interface ListContainerDocker {
  response: Response[]
  metadata: Metadata
}

export interface Metadata {
  exists: boolean
  total_containers: number
  status: Status
}

export interface Status {
  running: number
  paused: number
  restarting: number
  exited: number
  created: number
  dead: number
}

export interface Response {
  server_id: string
  name: string
  id: string
  image: string
  image_id: string
  created: number
  state: string
  status: string
  network_mode: string
  networks?: string[]
  ports?: Port[]
  volumes?: string[]
  stats?: Stats
}

export interface Port {
  IP: string | null
  PrivatePort: number
  PublicPort: number | null
  Type: Type
}

export enum Type {
  TCP = 'tcp',
  UDP = 'udp',
}

export interface Stats {
  name: string
  cpu_perc: string
  mem_perc: string
  mem_usage: string
  net_io: string
  block_io: string
  pids: string
}
