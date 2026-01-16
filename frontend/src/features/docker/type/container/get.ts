export interface GetContainerDocker {
  response: Response
  metadata: Metadata
}

export interface Metadata {
  exists: boolean
}

export interface Response {
  Id: string
  Created: Date
  Path: string
  Args: string[]
  State: State
  Image: string
  ResolvConfPath: string
  HostnamePath: string
  HostsPath: string
  LogPath: string
  Name: string
  RestartCount: number
  Driver: string
  Platform: string
  MountLabel: string
  ProcessLabel: string
  AppArmorProfile: string
  ExecIDs: any[]
  HostConfig: HostConfig
  GraphDriver: null
  SizeRw: number
  SizeRootFs: number
  Mounts: Mount[]
  Config: Config
  NetworkSettings: NetworkSettings
}

export interface Config {
  Hostname: string
  Domainname: string
  User: string
  AttachStdin: boolean
  AttachStdout: boolean
  AttachStderr: boolean
  ExposedPorts: { [key: string]: Volumes }
  Tty: boolean
  OpenStdin: boolean
  StdinOnce: boolean
  Env: string[]
  Cmd: string[]
  Healthcheck: null
  ArgsEscaped: null
  Image: string
  Volumes: Volumes
  WorkingDir: string
  Entrypoint: string[]
  NetworkDisabled: null
  MacAddress: null
  OnBuild: any[]
  Labels: Labels
  StopSignal: null
  StopTimeout: null
  Shell: any[]
}

export interface Volumes {}

export interface Labels {
  'org.opencontainers.image.vendor': string
  maintainer: string
  'org.opencontainers.image.licenses': string
  'org.opencontainers.image.revision': string
  'com.docker.compose.project.config_files': string
  'org.opencontainers.image.documentation': string
  'org.opencontainers.image.source': string
  'org.opencontainers.image.authors': string
  'org.opencontainers.image.description': string
  'org.opencontainers.image.url': string
  'org.opencontainers.image.created': Date
  'com.docker.compose.container-number': string
  'com.docker.compose.project': string
  'com.docker.compose.project.working_dir': string
  'com.docker.compose.replace': string
  'com.docker.compose.config-hash': string
  'com.docker.compose.image': string
  'com.docker.compose.oneoff': string
  'org.opencontainers.image.title': string
  'com.docker.compose.service': string
  'com.docker.compose.version': string
  'com.docker.compose.depends_on': string
  'org.opencontainers.image.version': string
}

export interface HostConfig {
  CpuShares: number
  Memory: number
  CgroupParent: string
  BlkioWeight: number
  BlkioWeightDevice: any[]
  BlkioDeviceReadBps: any[]
  BlkioDeviceWriteBps: any[]
  BlkioDeviceReadIOps: any[]
  BlkioDeviceWriteIOps: any[]
  CpuPeriod: number
  CpuQuota: number
  CpuRealtimePeriod: number
  CpuRealtimeRuntime: number
  CpusetCpus: string
  CpusetMems: string
  Devices: any[]
  DeviceCgroupRules: any[]
  DeviceRequests: any[]
  KernelMemoryTCP: null
  MemoryReservation: number
  MemorySwap: number
  MemorySwappiness: null
  NanoCpus: number
  OomKillDisable: null
  Init: null
  PidsLimit: null
  Ulimits: any[]
  CpuCount: number
  CpuPercent: number
  IOMaximumIOps: number
  IOMaximumBandwidth: number
  Binds: string[]
  ContainerIDFile: string
  LogConfig: LogConfig
  NetworkMode: string
  PortBindings: { [key: string]: Port[] }
  RestartPolicy: RestartPolicy
  AutoRemove: boolean
  VolumeDriver: string
  VolumesFrom: any[]
  Mounts: any[]
  ConsoleSize: number[]
  Annotations: Volumes
  CapAdd: any[]
  CapDrop: any[]
  CgroupnsMode: string
  Dns: string[]
  DnsOptions: any[]
  DnsSearch: any[]
  ExtraHosts: any[]
  GroupAdd: any[]
  IpcMode: string
  Cgroup: string
  Links: any[]
  OomScoreAdj: number
  PidMode: string
  Privileged: boolean
  PublishAllPorts: boolean
  ReadonlyRootfs: boolean
  SecurityOpt: any[]
  StorageOpt: Volumes
  Tmpfs: Volumes
  UTSMode: string
  UsernsMode: string
  ShmSize: number
  Sysctls: Volumes
  Runtime: string
  Isolation: string
  MaskedPaths: string[]
  ReadonlyPaths: string[]
}

export interface LogConfig {
  Type: string
  Config: Volumes
}

export interface Port {
  HostIp: string
  HostPort: string
}

export interface RestartPolicy {
  Name: string
  MaximumRetryCount: number
}

export interface Mount {
  Type: string
  Name: string
  Source: string
  Destination: string
  Driver: string
  Mode: string
  RW: boolean
  Propagation: string
}

export interface NetworkSettings {
  Bridge: null
  SandboxID: string
  Ports: { [key: string]: Port[] }
  SandboxKey: string
  Networks: Networks
}

export interface Networks {
  'adguard_adguard-net': AdguardAdguardNet
}

export interface AdguardAdguardNet {
  IPAMConfig: null
  Links: any[]
  MacAddress: string
  Aliases: string[]
  NetworkID: string
  EndpointID: string
  Gateway: string
  IPAddress: string
  IPPrefixLen: number
  IPv6Gateway: string
  GlobalIPv6Address: string
  GlobalIPv6PrefixLen: number
  DriverOpts: Volumes
  DNSNames: string[]
}

export interface State {
  Status: string
  Running: boolean
  Paused: boolean
  Restarting: boolean
  OOMKilled: boolean
  Dead: boolean
  Pid: number
  ExitCode: number
  Error: string
  StartedAt: Date
  FinishedAt: Date
  Health: null
}
