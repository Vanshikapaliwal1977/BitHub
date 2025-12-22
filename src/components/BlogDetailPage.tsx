import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useContent } from '../contexts/ContentContext'
import { useUser } from '../contexts/UserContext'

export default function BlogDetailPage() {
  const { blogId } = useParams<{ blogId: string }>()
  const { blogs, addComment } = useContent()
  const { currentUser } = useUser()
  const [commentContent, setCommentContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const blog = blogs.find(b => b.id === blogId)

  if (!blog) {
    return (
      <section className="py-24">
        <div className="container text-center">
          <h1 className="font-display text-4xl md:text-5xl mb-6">Blog Not Found</h1>
          <p className="text-zinc-400 mb-8">The blog you're looking for doesn't exist or has been removed.</p>
          <Link to="/blogs" className="px-6 py-3 rounded bg-accent.teal text-black font-semibold hover:opacity-90">
            Back to Blogs
          </Link>
        </div>
      </section>
    )
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser || !commentContent.trim()) return

    setIsSubmitting(true)

    try {
      addComment(blog.id, {
        content: commentContent.trim(),
        authorId: currentUser.id,
        authorName: currentUser.username
      })

      setCommentContent('')
    } catch (error) {
      console.error('Error adding comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-24">
      <div className="container max-w-4xl">
        <div className="mb-8">
          <Link to="/blogs" className="text-accent.teal hover:underline mb-4 inline-block">
            ← Back to Blogs
          </Link>
          <h1 className="font-display text-4xl md:text-5xl mb-4">{blog.title}</h1>
          <div className="flex items-center gap-3 mb-6">
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
          <div className="flex flex-wrap gap-2 mb-8">
            {blog.tags.map(tag => (
              <span key={tag} className="px-2 py-1 rounded-full text-xs bg-accent.teal/20 text-accent.teal border border-accent.teal/30">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-8">
          <div className="prose prose-invert max-w-none">
            <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{blog.content}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button className="text-zinc-400 hover:text-red-400 transition-colors">
              ❤️ {blog.likes}
            </button>
            <span className="text-zinc-400">{blog.comments.length} comment{blog.comments.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="font-display text-2xl text-white mb-6">Comments</h3>

          {currentUser ? (
            <form onSubmit={handleAddComment} className="mb-8">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Write a comment..."
                rows={4}
                className="w-full rounded border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-400 focus:border-accent.teal focus:outline-none resize-none"
                required
              />
              <div className="flex justify-end mt-3">
                <button
                  type="submit"
                  disabled={isSubmitting || !commentContent.trim()}
                  className="px-6 py-2 rounded bg-accent.teal text-black font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-6 mb-8">
              <p className="text-zinc-400 mb-4">Please login to comment.</p>
              <Link to="/login" className="px-6 py-3 rounded bg-accent.teal text-black font-semibold hover:opacity-90">
                Login
              </Link>
            </div>
          )}

          <div className="space-y-6">
            {blog.comments.map((comment) => (
              <div key={comment.id} className="border-b border-zinc-800 pb-6 last:border-b-0">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.authorName}`}
                    alt={comment.authorName}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-white text-sm">{comment.authorName}</div>
                    <div className="text-xs text-zinc-400">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <p className="text-zinc-300">{comment.content}</p>
              </div>
            ))}

            {blog.comments.length === 0 && (
              <p className="text-zinc-400 text-center py-8">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
