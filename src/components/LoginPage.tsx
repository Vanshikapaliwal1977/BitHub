import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'

export default function LoginPage() {
  const { login } = useUser()
  const navigate = useNavigate()
  const [identifier, setIdentifier] = useState('') // email or username
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [step, setStep] = useState<1 | 2>(1)

  const continueStep = (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier.trim()) return
    setError('')
    setStep(2)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await login(identifier.trim(), password)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  return (
    <section className="min-h-[80vh] bg-zinc-900 text-white relative overflow-hidden flex items-center py-24">
      {/* Background gradient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="container max-w-md mx-auto relative z-10">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl md:text-5xl mb-2 bg-gradient-to-r from-purple-400 to-teal-300 bg-clip-text text-transparent">Log in</h1>
          <p className="text-zinc-300">Welcome back to BitHub</p>
        </div>

        <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-8 shadow-2xl">
          {step === 1 && (
            <form onSubmit={continueStep} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Email address or username</label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e)=>setIdentifier(e.target.value)}
                  placeholder="you@example.com or yourname"
                  className="w-full rounded-lg border border-zinc-600 bg-zinc-800/50 px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
              {error && (
                <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">{error}</div>
              )}
              <button type="submit" className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-teal-500 hover:from-purple-600 hover:to-teal-600 text-white font-semibold transition-all hover:scale-105 hover:shadow-lg">Continue</button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="text-sm text-zinc-300 bg-zinc-800/50 rounded-lg p-3 border border-zinc-600">
                Logging in as <span className="font-medium text-white">{identifier}</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-zinc-600 bg-zinc-800/50 px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              {error && (
                <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">{error}</div>
              )}
              <button type="submit" className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-teal-500 hover:from-purple-600 hover:to-teal-600 text-white font-semibold transition-all hover:scale-105 hover:shadow-lg">Continue</button>
              <div className="text-sm text-center mt-4">
                <button type="button" onClick={()=>setStep(1)} className="text-zinc-300 hover:text-white transition-colors">Use a different email/username</button>
              </div>
              <div className="text-sm text-center mt-2">
                <a className="text-zinc-300 hover:text-white transition-colors" href="#">Lost your password?</a>
              </div>
            </form>
          )}
        </div>

        <div className="text-center mt-6">
          <span className="text-zinc-400 mr-2">Don't have an account?</span>
          <Link to="/register" className="text-zinc-300 hover:text-white transition-colors">Create one</Link>
        </div>

        <div className="text-center mt-4">
          <Link to="/" className="text-zinc-400 hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </section>
  )
}
