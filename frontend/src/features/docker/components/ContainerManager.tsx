import type { ListContainerDocker } from '@/features/docker/type/container/list'
import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const ContainerManager: React.FC = () => {
  const [containers, setContainers] = useState<ListContainerDocker['response']>([])
  const [metadata, setMetadata] = useState<ListContainerDocker['metadata']>()

  const fetchData = useCallback(async () => {
    const [containersRes] = await Promise.all([
      axios.get<ListContainerDocker>('/api/v0/komodo/container'),
    ])
    setContainers(containersRes.data.response)
    setMetadata(containersRes.data.metadata)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div>
      <h1>Container Manager</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {containers.map((container) => (
          <div key={container.id}>
            <h2>{container.name}</h2>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ContainerManager
