import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'

interface Opportunity {
  id: number
  type: 'Jobs' | 'Freelance' | 'Collaborations'
  title: string
  company: string
  location: string
  salary: string
  description: string
  tags: string[]
  postedBy: string
  posted: string
}

function OpportunitiesPage() {
  const { currentUser } = useUser()
  const [filter, setFilter] = useState<'All' | 'Jobs' | 'Freelance' | 'Collaborations'>('All')
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    type: 'Jobs' as 'Jobs' | 'Freelance' | 'Collaborations',
    title: '',
    company: '',
    location: '',
    salary: '',
    description: '',
    tags: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Allow posting without login
    const newOpportunity: Opportunity = {
      id: Date.now(),
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()),
      postedBy: currentUser.username,
      posted: 'Just now'
    }
    setOpportunities(prev => [newOpportunity, ...prev])
    setFormData({
      type: 'Jobs',
      title: '',
      company: '',
      location: '',
      salary: '',
      description: '',
      tags: ''
    })
    setShowForm(false)
  }

  const filteredOpportunities = filter === 'All' ? opportunities : opportunities.filter(opp => opp.type === filter)

  return (
    <section className="py-24">
      <div className="container">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-display text-4xl md:text-5xl mb-6"
        >
          Explore Opportunities
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-zinc-300 max-w-3xl mb-10"
        >
          Discover job opportunities, freelance projects, and collaboration chances in the developer community.
        </motion.p>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {['All', 'Jobs', 'Collaborations'].map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category as any)}
              className={`px-4 py-2 rounded-full border transition ${
                filter === category
                  ? 'bg-accent.purple text-white border-transparent'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Opportunities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.map((opportunity, index) => (
            <motion.div
              key={opportunity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  opportunity.type === 'Jobs' ? 'bg-blue-500/20 text-blue-400' :
                  opportunity.type === 'Freelance' ? 'bg-green-500/20 text-green-400' :
                  'bg-purple-500/20 text-purple-400'
                }`}>
                  {opportunity.type}
                </span>
                <span className="text-zinc-400 text-sm">{opportunity.posted} by {opportunity.postedBy}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{opportunity.title}</h3>
              <p className="text-zinc-400 mb-2">{opportunity.company} • {opportunity.location}</p>
              <p className="text-accent.teal font-semibold mb-3">{opportunity.salary}</p>
              <p className="text-zinc-300 text-sm mb-4">{opportunity.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {opportunity.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs">
                    {tag}
                  </span>
                ))}
              </div>
              <button className="w-full px-4 py-2 bg-accent.teal hover:bg-accent.teal/80 text-black font-semibold rounded-lg transition-colors">
                Apply Now
              </button>
            </motion.div>
          ))}
        </div>

        {/* Post Opportunity Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-teal-500 hover:from-purple-600 hover:to-teal-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            {showForm ? 'Cancel' : 'Post an Opportunity'}
          </button>
        </motion.div>

        {/* Post Opportunity Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 bg-zinc-900 border border-zinc-800 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold mb-4">Post a New Opportunity</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-300 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-white"
                    required
                  >
                    <option value="Jobs">Jobs</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Collaborations">Collaborations</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-zinc-300 mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Senior React Developer"
                    className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-400"
                    required
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-300 mb-1">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="e.g. TechCorp Inc."
                    className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-zinc-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g. Remote"
                    className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-400"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-zinc-300 mb-1">Salary/Compensation</label>
                <input
                  type="text"
                  value={formData.salary}
                  onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
                  placeholder="e.g. $80k - $120k or Voluntary"
                  className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-300 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the opportunity..."
                  className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-400 h-24 resize-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-300 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="e.g. React, TypeScript, Remote"
                  className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-400"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-teal-500 hover:from-purple-600 hover:to-teal-600 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                Post Opportunity
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default OpportunitiesPage
