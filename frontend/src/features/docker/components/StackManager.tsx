import type { ListStackDocker } from '@/features/docker/type/stacks/list'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import axios from 'axios'
import {
  Layers,
  RefreshCcw,
  Search,
  AlertCircle,
  HardDrive,
  Tag as TagIcon,
  Server,
  X,
} from 'lucide-react'

const StackManager: React.FC = () => {
  const [stacks, setStacks] = useState<ListStackDocker['response']>([])
  const [metadata, setMetadata] = useState<ListStackDocker['metadata'] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedServer, setSelectedServer] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const response = await axios.get<ListStackDocker>('/api/v0/komodo/stacks')
      setStacks(response.data.response)
      setMetadata(response.data.metadata)
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch stacks')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const filteredStacks = useMemo(() => {
    return stacks.filter((s) => {
      const matchesSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesTags =
        selectedTags.length === 0 || selectedTags.every((tag) => s.tags.includes(tag))

      const matchesServer = !selectedServer || s.server_name === selectedServer

      return matchesSearch && matchesTags && matchesServer
    })
  }, [stacks, searchQuery, selectedTags, selectedServer])

  if (loading && stacks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-black text-white font-mono">
        <RefreshCcw className="w-8 h-8 animate-spin text-white mb-4" />
        <span className="text-[10px] tracking-[0.3em] uppercase opacity-50">Loading.Stacks()</span>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-6 border-b border-white/10 pb-6">
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 bg-white" />
                <h1 className="text-2xl font-bold tracking-tighter uppercase">DOCKER.STACKS</h1>
              </div>
              <p className="text-[9px] text-neutral-500 uppercase tracking-[0.4em] animate-in fade-in duration-300">
                Managed deployments and multi-container services
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right-2 duration-300">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
              <input
                type="text"
                placeholder="FILTER_STACKS..."
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

        {/* Advanced Filters */}
        <div className="flex flex-col gap-4">
          {/* Server Filter */}
          {metadata && metadata.total_servers > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <div className="flex items-center gap-2 mr-2">
                <Server className="w-3 h-3 text-neutral-500" />
                <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">
                  Filter_By_Server:
                </span>
              </div>
              {metadata.servers.map((serverName) => (
                <button
                  key={serverName}
                  onClick={() =>
                    setSelectedServer(selectedServer === serverName ? null : serverName)
                  }
                  className={`px-3 py-1 text-[9px] font-black uppercase tracking-tighter border transition-all ${
                    selectedServer === serverName
                      ? 'bg-white text-black border-white'
                      : 'bg-white/5 text-neutral-500 border-white/5 hover:border-white/20'
                  }`}
                >
                  {serverName}
                </button>
              ))}
            </div>
          )}

          {/* Tag Filters */}
          {metadata && metadata.tags && metadata.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <div className="flex items-center gap-2 mr-2">
                <TagIcon className="w-3 h-3 text-neutral-500" />
                <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">
                  Filter_By_Tag:
                </span>
              </div>
              {metadata.tags.map((tag) => {
                const isActive = selectedTags.includes(tag)
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 text-[9px] font-black uppercase tracking-tighter border transition-all ${
                      isActive
                        ? 'bg-white text-black border-white'
                        : 'bg-white/5 text-neutral-500 border-white/5 hover:border-white/20'
                    }`}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>
          )}

          {(selectedTags.length > 0 || selectedServer) && (
            <button
              onClick={() => {
                setSelectedTags([])
                setSelectedServer(null)
              }}
              className="flex items-center gap-1 w-fit px-2 py-1 text-[9px] font-black text-red-500 uppercase hover:text-red-400 transition-colors border border-red-500/10 hover:border-red-500/30"
            >
              <X className="w-3 h-3" /> Reset_All_Filters
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 border border-red-500/50 bg-red-500/10 flex items-center gap-3 text-red-500 text-xs uppercase animate-in fade-in">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in slide-in-from-top-2 duration-500">
        {filteredStacks.map((stack) => (
          <div
            key={stack.id}
            className="group relative bg-neutral-900/40 border border-white/5 p-5 hover:border-white/20 transition-all duration-300 flex flex-col gap-4"
          >
            <div className="flex justify-between items-start">
              <div className="p-2 bg-white/5 border border-white/5 group-hover:border-white/20 transition-colors">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] text-neutral-500 uppercase tracking-widest">Type</span>
                <span className="text-[10px] font-black uppercase text-white">
                  {stack.type || 'COMPOSE'}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <h3
                className="text-sm font-black uppercase tracking-tight truncate"
                title={stack.name}
              >
                {stack.name}
              </h3>
              <div className="flex items-center gap-2 text-neutral-500">
                <HardDrive className="w-3 h-3" />
                <p className="text-[10px] truncate uppercase font-bold tracking-tighter">
                  {stack.server_name}
                </p>
              </div>
            </div>

            {/* Stack Tags */}
            {stack.tags && stack.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-6">
                {stack.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 border border-white/5 bg-white/5 text-[8px] font-black text-neutral-500 uppercase tracking-tighter"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <button className="w-full py-2 bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-center hover:bg-white hover:text-black transition-all cursor-not-allowed opacity-50 absolute left-0 bottom-0">
              Manage_Stack
            </button>
          </div>
        ))}
      </div>

      {filteredStacks.length === 0 && !loading && (
        <div className="p-12 text-center border border-white/10 bg-neutral-900/5 animate-in fade-in">
          <div className="flex flex-col items-center gap-3 opacity-30">
            <Layers className="w-8 h-8" />
            <span className="text-[10px] uppercase tracking-[0.3em]">No_Stacks_Found</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default StackManager
