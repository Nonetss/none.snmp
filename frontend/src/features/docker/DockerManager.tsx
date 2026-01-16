import ServerManager from '@/features/docker/components/ServerManager'
import StackManager from '@/features/docker/components/StackManager'
import ContainerManager from '@/features/docker/components/ContainerManager'

const DockerManager: React.FC = () => {
  return (
    <div className="space-y-4">
      <ServerManager />
      <StackManager />
      <ContainerManager />
    </div>
  )
}

export default DockerManager
