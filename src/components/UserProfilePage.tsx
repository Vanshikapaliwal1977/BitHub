import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { useContent } from '../contexts/ContentContext'

export default function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>()
  const { users } = useUser()
  const { blogs } = useContent()

  const user = users.find(u => u.id === userId)
  const userBlogs = blogs.filter(blog => blog.authorId === userId)
  const userProjects = [] // TODO: Implement user projects when projects context is added

  if (!user) {
    return (
      <section className="py-24">
        <div className="container text-center">
          <h1 className="font-display text-4xl mb-4">User Not Found</h1>
          <Link to="/" className="text-accent.teal hover:underline">← Back to Home</Link>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24">
      <div className="container max-w-4xl">
        {/* Profile Header */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-8">
          <div className="flex items-center gap-6 mb-6">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
              alt={user.username}
              className="w-20 h-20 rounded-full"
            />
            <div>
              <h1 className="font-display text-3xl text-white mb-2">{user.username}</h1>
              <p className="text-zinc-400">{user.email}</p>
              <div className="flex gap-4 mt-3">
                <div className="text-center">
                  <div className="font-semibold text-white">{userBlogs.length}</div>
                  <div className="text-sm text-zinc-400">Blogs</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-white">{userProjects.length}</div>
                  <div className="text-sm text-zinc-400">Projects</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-white">{user.badges.length}</div>
                  <div className="text-sm text-zinc-400">Badges</div>
                </div>
              </div>
            </div>
          </div>

          {/* Badges */}
          {user.badges.length > 0 && (
            <div>
              <h3 className="font-semibold text-white mb-3">Badges</h3>
              <div className="flex flex-wrap gap-2">
                {user.badges.map(badge => (
                  <span key={badge} className="px-3 py-1 rounded-full bg-accent.teal/20 text-accent.teal border border-accent.teal/30 text-sm">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User's Projects */}
        {userProjects.length > 0 && (
          <div className="mb-8">
            <h2 className="font-display text-2xl text-white mb-6">Projects</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userProjects.map((project) => (
                <div key={project.id} className="bg-white/5 border border-white/10 rounded overflow-hidden">
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
                        className="inline-block text-accent.teal hover:underline"
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View Project →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User's Blogs */}
        {userBlogs.length > 0 && (
          <div>
            <h2 className="font-display text-2xl text-white mb-6">Blogs</h2>
            <div className="space-y-6">
              {userBlogs.map((blog) => (
                <article key={blog.id} className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <h3 className="font-display text-xl text-white mb-3">{blog.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 rounded-full text-xs bg-accent.teal/20 text-accent.teal border border-accent.teal/30">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-zinc-300 mb-4 line-clamp-3">{blog.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-zinc-400">
                      {new Date(blog.createdAt).toLocaleDateString()} • {blog.likes} likes
                    </div>
                    <Link
                      to={`/blog/${blog.id}`}
                      className="text-accent.teal hover:underline"
                    >
                      Read More →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {userProjects.length === 0 && userBlogs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-400">This user hasn't shared any content yet.</p>
          </div>
        )}
      </div>
    </section>
  )
}
