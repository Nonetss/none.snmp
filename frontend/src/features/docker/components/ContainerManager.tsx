import type { ListContainerDocker } from '@/features/docker/type/container/list'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import axios from 'axios'
import { Box, RefreshCcw, Search, AlertCircle } from 'lucide-react'

const ContainerManager: React.FC = () => {
  const [containers, setContainers] = useState<ListContainerDocker['response']>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const response = await axios.get<ListContainerDocker>('/api/v0/komodo/container')
      setContainers(response.data.response)
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch containers')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const filteredContainers = useMemo(() => {
    if (!searchQuery) return containers
    const q = searchQuery.toLowerCase()
    return containers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.image.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q)
    )
  }, [containers, searchQuery])

  if (loading && containers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-black text-white font-mono">
        <RefreshCcw className="w-8 h-8 animate-spin text-white mb-4" />
        <span className="text-[10px] tracking-[0.3em] uppercase opacity-50">
          Loading.Containers()
        </span>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-4 bg-white" />
              <h1 className="text-2xl font-bold tracking-tighter uppercase">DOCKER.CONTAINERS</h1>
            </div>
            <p className="text-[9px] text-neutral-500 uppercase tracking-[0.4em] animate-in fade-in duration-300">
              Active containers and status across all servers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right-2 duration-300">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
            <input
              type="text"
              placeholder="FILTER_CONTAINERS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-neutral-900/50 border border-white/10 px-10 py-2 text-xs focus:outline-none focus:border-white/30 w-64 uppercase placeholder:text-neutral-500 font-mono"
            />
          </div>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 border border-white text-xs font-bold hover:bg-white hover:text-black transition-all uppercase"
          >
            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Sync_Data
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 border border-red-500/50 bg-red-500/10 flex items-center gap-3 text-red-500 text-xs uppercase animate-in fade-in">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in slide-in-from-top-2 duration-500">
        {filteredContainers.map((container) => (
          <div
            key={container.id}
            className="group relative bg-neutral-900/40 border border-white/5 p-5 hover:border-white/20 transition-all duration-300 flex flex-col gap-4"
          >
            <div className="flex justify-between items-start">
              <div className="p-2 bg-white/5 border border-white/5 group-hover:border-white/20 transition-colors">
                <Box className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] text-neutral-500 uppercase tracking-widest">
                  Status
                </span>
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${container.state === 'running' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}
                  />
                  <span
                    className={`text-[10px] font-black uppercase ${container.state === 'running' ? 'text-emerald-500' : 'text-red-500'}`}
                  >
                    {container.state}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <h3
                className="text-sm font-black uppercase tracking-tight truncate"
                title={container.name}
              >
                {container.name}
              </h3>
              <p
                className="text-[10px] text-neutral-500 truncate font-mono"
                title={container.image}
              >
                {container.image}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div>
                <p className="text-[8px] text-neutral-600 uppercase tracking-widest mb-1">
                  Server ID
                </p>
                <p className="text-[10px] font-bold text-neutral-400 truncate uppercase">
                  {container.server_id.slice(0, 8)}
                </p>
              </div>
              <div>
                <p className="text-[8px] text-neutral-600 uppercase tracking-widest mb-1">
                  Network
                </p>
                <p className="text-[10px] font-bold text-neutral-400 truncate uppercase">
                  {container.network_mode || 'Default'}
                </p>
              </div>
            </div>

            <a
              href={`/container/${container.id}`}
              className="mt-2 w-full py-2 bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-center hover:bg-white hover:text-black transition-all"
            >
              Inspect_Container
            </a>
          </div>
        ))}
      </div>

      {filteredContainers.length === 0 && !loading && (
        <div className="p-12 text-center border border-white/10 bg-neutral-900/5 animate-in fade-in">
          <div className="flex flex-col items-center gap-3 opacity-30">
            <Box className="w-8 h-8" />
            <span className="text-[10px] uppercase tracking-[0.3em]">No_Containers_Found</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContainerManager
