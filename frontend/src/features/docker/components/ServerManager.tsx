import type { ListServerDocker } from '@/features/docker/type/server/list'
import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const ServerManager: React.FC = () => {
  const [servers, setServers] = useState<ListServerDocker['response']>([])
  const [metadata, setMetadata] = useState<ListServerDocker['metadata']>()

  const fetchData = useCallback(async () => {
    const [serversRes] = await Promise.all([axios.get<ListServerDocker>('/api/v0/komodo/server')])
    setServers(serversRes.data.response)
    setMetadata(serversRes.data.metadata)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div>
      <h1>Container Manager</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {servers.map((server) => (
          <div key={server.id}>
            <h2>{server.name}</h2>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ServerManager
