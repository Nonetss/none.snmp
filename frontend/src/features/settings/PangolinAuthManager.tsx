import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Plus,
  Trash2,
  Edit2,
  RefreshCcw,
  AlertCircle,
  X,
  Link,
  ShieldCheck,
  Globe,
  Eye,
  EyeOff,
} from 'lucide-react'

interface PangolinAuthResponse {
  id: number
  url: string
  token: string
  pangolinOrg?: {
    id: number
    name: string
    slug: string
    authId: number
  }[]
}

interface PangolinOrgResponse {
  id: number
  name: string
  slug: string
  authId: number
}

interface PangolinAuthGetResponse {
  auth: PangolinAuthResponse[]
  metadata: {
    exists: boolean
    total_auth: number
    total_org: number
  }
}

interface PangolinAuthFormData {
  url: string
  token: string
}

interface PangolinOrgFormData {
  name: string
  slug: string
}

const PangolinAuthManager: React.FC = () => {
  const [auths, setAuths] = useState<PangolinAuthResponse[]>([])
  const [orgs, setOrgs] = useState<PangolinOrgResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Estados para formulario de Auth
  const [showAuthForm, setShowAuthForm] = useState(false)
  const [editingAuthId, setEditingAuthId] = useState<number | null>(null)
  const [submittingAuth, setSubmittingAuth] = useState(false)
  const [showToken, setShowToken] = useState(false)
  const [authFormData, setAuthFormData] = useState<PangolinAuthFormData>({
    url: '',
    token: '',
  })

  // Estados para formulario de Org
  const [showOrgForm, setShowOrgForm] = useState(false)
  const [editingOrgId, setEditingOrgId] = useState<number | null>(null)
  const [submittingOrg, setSubmittingOrg] = useState(false)
  const [orgFormData, setOrgFormData] = useState<PangolinOrgFormData>({
    name: '',
    slug: '',
  })

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await axios.get<PangolinAuthGetResponse>(`/api/v0/proxy/pangolin/auth`)
      const authData = response.data?.auth || []
      setAuths(authData)

      // Extraer todas las organizaciones de todas las auths
      const allOrgs: PangolinOrgResponse[] = []
      authData.forEach((auth) => {
        if (auth.pangolinOrg && auth.pangolinOrg.length > 0) {
          allOrgs.push(...auth.pangolinOrg)
        }
      })
      setOrgs(allOrgs)

      setError(null)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch Pangolin data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Handlers para Auth
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmittingAuth(true)
    try {
      const authData = { url: authFormData.url, token: authFormData.token }

      if (editingAuthId) {
        await axios.patch(`/api/v0/proxy/pangolin/auth`, authData)
      } else {
        await axios.post(`/api/v0/proxy/pangolin/auth`, authData)
      }

      setShowAuthForm(false)
      setEditingAuthId(null)
      setAuthFormData({ url: '', token: '' })
      await fetchData()
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Failed to save credentials')
    } finally {
      setSubmittingAuth(false)
    }
  }

  const handleAuthDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this credential?')) return
    try {
      await axios.delete(`/api/v0/proxy/pangolin/auth/${id}`)
      await fetchData()
    } catch (err: any) {
      alert(err.message || 'Failed to delete credential')
    }
  }

  const handleAuthEdit = (auth: PangolinAuthResponse) => {
    setAuthFormData({
      url: auth.url,
      token: auth.token,
    })
    setEditingAuthId(auth.id)
    setShowAuthForm(true)
  }

  // Handlers para Org
  const handleOrgSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmittingOrg(true)
    try {
      if (editingOrgId) {
        await axios.patch(`/api/v0/proxy/pangolin/org`, {
          name: orgFormData.name,
          slug: orgFormData.slug,
        })
      } else {
        await axios.post(`/api/v0/proxy/pangolin/org`, {
          name: orgFormData.name,
          slug: orgFormData.slug,
        })
      }

      setShowOrgForm(false)
      setEditingOrgId(null)
      setOrgFormData({ name: '', slug: '' })
      await fetchData()
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Failed to save organization')
    } finally {
      setSubmittingOrg(false)
    }
  }

  const handleOrgDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this organization?')) return
    try {
      await axios.delete(`/api/v0/proxy/pangolin/org/${id}`)
      await fetchData()
    } catch (err: any) {
      alert(err.message || 'Failed to delete organization')
    }
  }

  const handleOrgEdit = (org: PangolinOrgResponse) => {
    setOrgFormData({
      name: org.name,
      slug: org.slug,
    })
    setEditingOrgId(org.id)
    setShowOrgForm(true)
  }

  if (loading && auths.length === 0 && orgs.length === 0)
    return (
      <div className="flex items-center justify-center h-48 bg-black text-white font-mono">
        <RefreshCcw className="w-6 h-6 animate-spin text-white" />
      </div>
    )

  return (
    <div className="bg-black text-white font-mono space-y-12 w-full animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-white/10 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 bg-white" />
            <h2 className="text-lg font-bold tracking-tighter uppercase">Pangolin_Configuration</h2>
          </div>
          <p className="text-[9px] text-neutral-500 uppercase tracking-[0.4em]">
            Credentials and organizations management
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 border border-red-500/50 bg-red-500/10 flex items-center gap-3 text-red-500 text-xs uppercase">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {/* Sección de Credenciales */}
      <div className="space-y-6">
        <div className="flex justify-between items-end border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <h3 className="text-sm font-bold tracking-tighter uppercase">Credentials</h3>
            </div>
            <p className="text-[9px] text-neutral-500 uppercase tracking-[0.4em]">
              Pangolin authentication credentials
            </p>
          </div>
          <button
            onClick={() => {
              setEditingAuthId(null)
              setAuthFormData({ url: '', token: '' })
              setShowAuthForm(true)
            }}
            className="flex items-center gap-2 px-4 py-2 border border-white text-xs font-bold hover:bg-white hover:text-black transition-all uppercase"
          >
            <Plus className="w-4 h-4" /> Add_Credential
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auths.map((auth) => (
            <div
              key={auth.id}
              className="group relative border border-white/10 bg-neutral-900/20 p-6 space-y-4 hover:border-white/30 transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="px-2 py-1 bg-white/10 text-[10px] font-bold uppercase tracking-widest text-white">
                  ID: {auth.id}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAuthEdit(auth)}
                    className="p-1 text-neutral-500 hover:text-white transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleAuthDelete(auth.id)}
                    className="p-1 text-neutral-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-neutral-300">
                  <Link className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-tighter truncate block max-w-[200px]">
                    {auth.url}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-neutral-500">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[11px] truncate block max-w-[200px]">
                    Token: {auth.token.substring(0, 8)}...
                  </span>
                </div>
              </div>
            </div>
          ))}
          {auths.length === 0 && !loading && (
            <div className="col-span-full py-12 text-center border border-dashed border-white/10 text-neutral-600 uppercase text-[10px] tracking-widest">
              No_Credentials_Configured
            </div>
          )}
        </div>
      </div>

      {/* Sección de Organizaciones */}
      <div className="space-y-6">
        <div className="flex justify-between items-end border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <h3 className="text-sm font-bold tracking-tighter uppercase">Organizations</h3>
            </div>
            <p className="text-[9px] text-neutral-500 uppercase tracking-[0.4em]">
              Pangolin organizations
            </p>
          </div>
          <button
            onClick={() => {
              setEditingOrgId(null)
              setOrgFormData({ name: '', slug: '' })
              setShowOrgForm(true)
            }}
            className="flex items-center gap-2 px-4 py-2 border border-white text-xs font-bold hover:bg-white hover:text-black transition-all uppercase"
          >
            <Plus className="w-4 h-4" /> Add_Organization
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orgs.map((org) => (
            <div
              key={org.id}
              className="group relative border border-white/10 bg-neutral-900/20 p-6 space-y-4 hover:border-white/30 transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="px-2 py-1 bg-white/10 text-[10px] font-bold uppercase tracking-widest text-white">
                  ID: {org.id}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOrgEdit(org)}
                    className="p-1 text-neutral-500 hover:text-white transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOrgDelete(org.id)}
                    className="p-1 text-neutral-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-neutral-300">
                  <Globe className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-tighter truncate block max-w-[200px]">
                    {org.name}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-neutral-500">
                  <Link className="w-4 h-4" />
                  <span className="text-[11px] truncate block max-w-[200px]">Slug: {org.slug}</span>
                </div>
              </div>
            </div>
          ))}
          {orgs.length === 0 && !loading && (
            <div className="col-span-full py-12 text-center border border-dashed border-white/10 text-neutral-600 uppercase text-[10px] tracking-widest">
              No_Organizations_Configured
            </div>
          )}
        </div>
      </div>

      {/* Modal Form para Auth */}
      {showAuthForm && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/90 backdrop-blur-sm transition-opacity"
            onClick={() => setShowAuthForm(false)}
          />
          <div className="relative w-full max-w-md bg-neutral-950 border border-white/20 shadow-[0_0_50px_-12px_rgba(255,255,255,0.3)] animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-white" />
                <h2 className="text-sm font-bold uppercase tracking-widest">
                  {editingAuthId ? 'Edit_Credential' : 'New_Credential'}
                </h2>
              </div>
              <button
                onClick={() => setShowAuthForm(false)}
                className="p-1 hover:bg-white/10 text-neutral-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] text-neutral-500 uppercase font-bold tracking-tighter">
                  Pangolin URL
                </label>
                <div className="relative">
                  <Link className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-600" />
                  <input
                    type="url"
                    value={authFormData.url}
                    onChange={(e) => setAuthFormData({ ...authFormData, url: e.target.value })}
                    className="w-full bg-black border border-white/10 pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-white/40 font-mono"
                    placeholder="https://pangolin.example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-neutral-500 uppercase font-bold tracking-tighter">
                  Access Token
                </label>
                <div className="relative">
                  <ShieldCheck className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-600" />
                  <input
                    type={showToken ? 'text' : 'password'}
                    value={authFormData.token}
                    onChange={(e) => setAuthFormData({ ...authFormData, token: e.target.value })}
                    className="w-full bg-black border border-white/10 pl-9 pr-10 py-2 text-xs focus:outline-none focus:border-white/40 font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-white transition-colors"
                  >
                    {showToken ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submittingAuth}
                  className="w-full bg-white text-black py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submittingAuth && <RefreshCcw className="w-3 h-3 animate-spin" />}
                  {submittingAuth
                    ? 'Processing...'
                    : editingAuthId
                      ? 'Update_Credential'
                      : 'Save_Credential'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Form para Org */}
      {showOrgForm && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/90 backdrop-blur-sm transition-opacity"
            onClick={() => setShowOrgForm(false)}
          />
          <div className="relative w-full max-w-md bg-neutral-950 border border-white/20 shadow-[0_0_50px_-12px_rgba(255,255,255,0.3)] animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-white" />
                <h2 className="text-sm font-bold uppercase tracking-widest">
                  {editingOrgId ? 'Edit_Organization' : 'New_Organization'}
                </h2>
              </div>
              <button
                onClick={() => setShowOrgForm(false)}
                className="p-1 hover:bg-white/10 text-neutral-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleOrgSubmit} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] text-neutral-500 uppercase font-bold tracking-tighter">
                  Organization Name
                </label>
                <div className="relative">
                  <Globe className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-600" />
                  <input
                    type="text"
                    value={orgFormData.name}
                    onChange={(e) => setOrgFormData({ ...orgFormData, name: e.target.value })}
                    className="w-full bg-black border border-white/10 pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-white/40 font-mono"
                    placeholder="Default Org"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-neutral-500 uppercase font-bold tracking-tighter">
                  Organization Slug
                </label>
                <div className="relative">
                  <Link className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-600" />
                  <input
                    type="text"
                    value={orgFormData.slug}
                    onChange={(e) => setOrgFormData({ ...orgFormData, slug: e.target.value })}
                    className="w-full bg-black border border-white/10 pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-white/40 font-mono"
                    placeholder="default-org"
                    required
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submittingOrg}
                  className="w-full bg-white text-black py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submittingOrg && <RefreshCcw className="w-3 h-3 animate-spin" />}
                  {submittingOrg
                    ? 'Processing...'
                    : editingOrgId
                      ? 'Update_Organization'
                      : 'Save_Organization'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PangolinAuthManager
