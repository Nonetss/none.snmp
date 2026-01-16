import type { ListStackDocker } from '@/features/docker/type/stacks/list'
import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const StackManager: React.FC = () => {
  const [stacks, setStacks] = useState<ListStackDocker['response']>([])
  const [metadata, setMetadata] = useState<ListStackDocker['metadata']>()

  const fetchData = useCallback(async () => {
    const [stacksRes] = await Promise.all([axios.get<ListStackDocker>('/api/v0/komodo/stacks')])
    setStacks(stacksRes.data.response)
    setMetadata(stacksRes.data.metadata)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div>
      <h1>Container Manager</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stacks.map((stack) => (
          <div key={stack.id}>
            <h2>{stack.name}</h2>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StackManager
