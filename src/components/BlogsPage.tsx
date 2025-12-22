import React from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '../contexts/ContentContext'
import { useUser } from '../contexts/UserContext'

export default function BlogsPage() {
  const { blogs, likeBlog } = useContent()
  const { currentUser } = useUser()

  return (
    <section className="py-24">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-4xl md:text-5xl">Community Blogs</h1>
          {currentUser && (
            <Link
              to="/write-blog"
              className="px-4 py-2 rounded bg-accent.teal text-black font-semibold hover:opacity-90"
            >
              Write a Blog
            </Link>
          )}
        </div>

        <p className="text-zinc-300 mb-8 max-w-3xl">
          Read insightful articles and tutorials from our community. Share your knowledge and learn from others
          in our growing developer community.
        </p>

        <div className="space-y-8">
          {blogs.filter(blog => blog.isPublic).map((blog) => (
            <article key={blog.id} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${blog.authorName}`}
                    alt={blog.authorName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-white">{blog.authorName}</div>
                    <div className="text-sm text-zinc-400">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => likeBlog(blog.id)}
                      className="text-zinc-400 hover:text-red-400 transition-colors"
                    >
                      ❤️
                    </button>
                    <span className="text-sm text-zinc-400">{blog.likes}</span>
                  </div>
                </div>
              </div>

              <h2 className="font-display text-2xl text-white mb-3">{blog.title}</h2>

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
                  {blog.comments.length} comment{blog.comments.length !== 1 ? 's' : ''}
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

        {blogs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-zinc-400 mb-4">No blogs yet. Be the first to share your knowledge!</p>
            {currentUser ? (
              <Link
                to="/write-blog"
                className="px-6 py-3 rounded bg-accent.teal text-black font-semibold hover:opacity-90"
              >
                Write Your First Blog
              </Link>
            ) : (
              <Link
                to="/login"
                className="px-6 py-3 rounded bg-accent.teal text-black font-semibold hover:opacity-90"
              >
                Login to Write
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
