import React, { useState } from 'react'
import { Box, Layers, Server, LayoutDashboard, Settings2 } from 'lucide-react'
import ServerManager from '@/features/docker/components/ServerManager'
import StackManager from '@/features/docker/components/StackManager'
import ContainerManager from '@/features/docker/components/ContainerManager'

type TabId = 'servers' | 'stacks' | 'containers'

const DockerManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('servers')

  // Sync with URL hash for persistence
  React.useEffect(() => {
    const hash = window.location.hash.replace('#', '') as TabId
    if (hash === 'servers' || hash === 'stacks' || hash === 'containers') {
      setActiveTab(hash)
    }
  }, [])

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab)
    window.location.hash = tab
  }

  return (
    <div className="p-4 md:p-8 bg-black text-white font-mono min-h-screen space-y-8 w-full max-w-full 2xl:max-w-[2400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/10 pb-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Box className="w-5 h-5 text-white" />
            <h1 className="text-xl font-black tracking-[0.3em] uppercase">Docker.Orchestration</h1>
          </div>
          <p className="text-[10px] text-neutral-500 tracking-widest uppercase">
            Manage docker servers, stacks and containers across your infrastructure
          </p>
        </div>

        {/* Tabs Control */}
        <div className="flex items-center gap-4">
          <div className="flex p-1 bg-white/5 border border-white/5">
            <button
              onClick={() => handleTabChange('servers')}
              className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'servers'
                  ? 'bg-white text-black'
                  : 'text-neutral-500 hover:text-white'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              Servers
            </button>
            <button
              onClick={() => handleTabChange('stacks')}
              className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'stacks' ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Stacks
            </button>
            <button
              onClick={() => handleTabChange('containers')}
              className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'containers'
                  ? 'bg-white text-black'
                  : 'text-neutral-500 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              Containers
            </button>
          </div>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {activeTab === 'servers' && <ServerManager />}
        {activeTab === 'stacks' && <StackManager />}
        {activeTab === 'containers' && <ContainerManager />}
      </div>
    </div>
  )
}

export default DockerManager
