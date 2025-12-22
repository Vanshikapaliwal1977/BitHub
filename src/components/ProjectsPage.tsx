import React from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { useContent } from '../contexts/ContentContext'

export default function ProjectsPage() {
  const { currentUser } = useUser()
  const { projects } = useContent()

  return (
    <section className="py-24">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-4xl md:text-5xl">Community Projects</h1>
          {currentUser && (
            <Link
              to="/add-project"
              className="px-4 py-2 rounded bg-accent.teal text-black font-semibold hover:opacity-90"
            >
              Add Your Project
            </Link>
          )}
        </div>

        <p className="text-zinc-300 mb-8 max-w-3xl">
          Explore projects shared by our community members. From innovative web applications to creative solutions,
          discover what others are building and get inspired.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.filter(project => project.isPublic).map((project) => (
            <div key={project.id} className="bg-white/5 border border-white/10 rounded overflow-hidden hover:border-white/20 transition-colors">
              {project.image ? (
                <img src={project.image} alt={project.title} className="w-full aspect-video object-contain" />
              ) : (
                <div className="aspect-video bg-black/30" />
              )}
              <div className="p-4">
                <div className="font-semibold text-white mb-2">{project.title}</div>
                <div className="text-sm text-zinc-300 mb-3">{project.blurb}</div>
                {project.link && (
                  <a
                    className="inline-block text-accent.teal hover:underline mb-3 block"
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Project →
                  </a>
                )}
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 rounded-full text-xs bg-white/10 border border-white/15 text-zinc-200">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-zinc-400">
                  By {project.authorName} • {new Date(project.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-400 mb-4">No community projects yet. Be the first to share!</p>
            {currentUser ? (
              <Link
                to="/add-project"
                className="px-6 py-3 rounded bg-accent.teal text-black font-semibold hover:opacity-90"
              >
                Add Your Project
              </Link>
            ) : (
              <Link
                to="/login"
                className="px-6 py-3 rounded bg-accent.teal text-black font-semibold hover:opacity-90"
              >
                Login to Add Project
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
