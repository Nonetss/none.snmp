import * as React from 'react'
import { authClient } from '@/lib/auth-client'
import { Mail, Lock, RefreshCcw, AlertCircle, ShieldAlert } from 'lucide-react'
import axios from 'axios'

const LoginForm: React.FC = () => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [isFirstRun, setIsFirstRun] = React.useState(false)

  React.useEffect(() => {
    const checkFirstRun = async () => {
      try {
        const res = await axios.get('/api/v0/auth/first-run')
        if (res.data.firstRun) {
          setIsFirstRun(true)
        }
      } catch (e) {
        // Ignore error
      }
    }
    checkFirstRun()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      })

      if (result.error) {
        setError(result.error.message || 'Error al iniciar sesión')
        return
      }

      // Redirigir al dashboard después del login exitoso
      window.location.href = '/'
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-4 bg-white" />
          <h1 className="text-2xl font-bold tracking-tighter uppercase font-mono text-white">
            Authentication.Required
          </h1>
        </div>
        <p className="text-[11px] text-neutral-400 uppercase tracking-[0.4em] font-mono">
          Provide credentials to access the system
        </p>
      </div>

      <div className="bg-neutral-900/40 border border-white/10 p-5 space-y-5 backdrop-blur-md">
        {isFirstRun && (
          <div className="p-4 border border-blue-500/30 bg-blue-500/5 flex flex-col gap-2 text-[10px] font-mono">
            <div className="flex items-center gap-2 text-blue-400 font-bold uppercase tracking-widest">
              <ShieldAlert className="w-4 h-4" />
              Initial_Setup_Detected
            </div>
            <p className="text-neutral-400 leading-relaxed uppercase">
              No users found. An admin account has been automatically created.
              Please check the <span className="text-white font-bold">backend console logs</span> for the generated password.
            </p>
            <div className="text-neutral-500 text-[9px] border-t border-white/5 pt-2">
              Default Email: admin@admin.com
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 font-mono">
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-[10px] text-neutral-500 uppercase font-bold tracking-tighter block"
            >
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-600 group-focus-within:text-white transition-colors" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                required
                disabled={isLoading}
                autoComplete="email"
                className="w-full bg-black border border-white/10 pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-white/40 font-mono text-white placeholder:text-neutral-800 disabled:opacity-50"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-[10px] text-neutral-500 uppercase font-bold tracking-tighter block"
            >
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-600 group-focus-within:text-white transition-colors" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
                autoComplete="current-password"
                className="w-full bg-black border border-white/10 pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-white/40 font-mono text-white placeholder:text-neutral-800 disabled:opacity-50"
              />
            </div>
          </div>

          {error && (
            <div className="p-4 border border-red-500/30 bg-red-500/5 flex items-center gap-3 text-red-500 text-[9px] font-black uppercase tracking-widest animate-in slide-in-from-top-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading && <RefreshCcw className="w-3 h-3 animate-spin" />}
              {isLoading ? 'Authenticating...' : 'Sign_In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginForm