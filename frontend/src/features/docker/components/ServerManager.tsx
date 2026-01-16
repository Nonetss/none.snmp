import type { ListServerDocker } from '@/features/docker/type/server/list'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import axios from 'axios'
import {
  Server,
  RefreshCcw,
  Search,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Activity,
  Globe,
} from 'lucide-react'

const ServerManager: React.FC = () => {
  const [servers, setServers] = useState<ListServerDocker['response']>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isCollapsed, setIsCollapsed] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const response = await axios.get<ListServerDocker>('/api/v0/komodo/server')
      setServers(response.data.response)
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch servers')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const filteredServers = useMemo(() => {
    if (!searchQuery) return servers
    const q = searchQuery.toLowerCase()
    return servers.filter(
      (s) => s.name.toLowerCase().includes(q) || s.config.address?.toLowerCase().includes(q)
    )
  }, [servers, searchQuery])

  if (loading && servers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-black text-white font-mono">
        <RefreshCcw className="w-8 h-8 animate-spin text-white mb-4" />
        <span className="text-[10px] tracking-[0.3em] uppercase opacity-50">Loading.Servers()</span>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-white/5 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-white" />
            ) : (
              <ChevronDown className="w-5 h-5 text-white" />
            )}
          </button>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-4 bg-white" />
              <h1 className="text-2xl font-bold tracking-tighter uppercase">DOCKER.SERVERS</h1>
            </div>
            {!isCollapsed && (
              <p className="text-[9px] text-neutral-500 uppercase tracking-[0.4em] animate-in fade-in duration-300">
                Connected Docker hosts and infrastructure nodes
              </p>
            )}
          </div>
        </div>

        {!isCollapsed && (
          <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right-2 duration-300">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
              <input
                type="text"
                placeholder="FILTER_SERVERS..."
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
        )}
      </div>

      {error && !isCollapsed && (
        <div className="p-4 border border-red-500/50 bg-red-500/10 flex items-center gap-3 text-red-500 text-xs uppercase animate-in fade-in">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {!isCollapsed && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in slide-in-from-top-2 duration-500">
          {filteredServers.map((server) => (
            <div
              key={server.id}
              className="group relative bg-neutral-900/40 border border-white/5 p-5 hover:border-white/20 transition-all duration-300 flex flex-col gap-4"
            >
              <div className="flex justify-between items-start">
                <div className="p-2 bg-white/5 border border-white/5 group-hover:border-white/20 transition-colors">
                  <Server className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[9px] text-neutral-500 uppercase tracking-widest">
                    Status
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase text-emerald-500">
                      CONNECTED
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <h3
                  className="text-sm font-black uppercase tracking-tight truncate"
                  title={server.name}
                >
                  {server.name}
                </h3>
                <div className="flex items-center gap-2 text-neutral-500">
                  <Globe className="w-3 h-3" />
                  <p className="text-[10px] truncate font-mono">
                    {server.config.address || 'Local socket'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div>
                  <p className="text-[8px] text-neutral-600 uppercase tracking-widest mb-1">
                    Region
                  </p>
                  <p className="text-[10px] font-bold text-neutral-400 truncate uppercase">
                    {server.config.region || 'Default'}
                  </p>
                </div>
                <div>
                  <p className="text-[8px] text-neutral-600 uppercase tracking-widest mb-1">
                    Telemetry
                  </p>
                  <p className="text-[10px] font-bold text-neutral-400 truncate uppercase">
                    {server.config.stats_monitoring ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>

              <button className="mt-2 w-full py-2 bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-center hover:bg-white hover:text-black transition-all cursor-not-allowed opacity-50">
                Host_Details
              </button>
            </div>
          ))}
        </div>
      )}

      {!isCollapsed && filteredServers.length === 0 && !loading && (
        <div className="p-12 text-center border border-white/10 bg-neutral-900/5 animate-in fade-in">
          <div className="flex flex-col items-center gap-3 opacity-30">
            <Server className="w-8 h-8" />
            <span className="text-[10px] uppercase tracking-[0.3em]">No_Servers_Found</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ServerManager
