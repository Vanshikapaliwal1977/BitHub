import React, { useState } from 'react'
import { useContent } from '../contexts/ContentContext'
import { useUser } from '../contexts/UserContext'

export default function FeedbackPage() {
  const { feedbacks, addFeedback } = useContent()
  const { currentUser } = useUser()
  const [type, setType] = useState<'project' | 'platform'>('platform')
  const [content, setContent] = useState('')
  const [rating, setRating] = useState<number | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser || !content.trim()) return

    setIsSubmitting(true)

    try {
      addFeedback({
        type,
        content: content.trim(),
        authorId: currentUser.id,
        authorName: currentUser.username,
        rating: type === 'project' ? rating : undefined
      })

      setContent('')
      setRating(undefined)
    } catch (error) {
      console.error('Error submitting feedback:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-24">
      <div className="container max-w-4xl">
        <div className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl mb-4">Feedback & Suggestions</h1>
          <p className="text-zinc-300">
            Help us improve by sharing your feedback about projects or the platform.
          </p>
        </div>

        {currentUser ? (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Feedback Form */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="font-display text-2xl text-white mb-6">Share Your Feedback</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-zinc-300 mb-2">Feedback Type</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="platform"
                        checked={type === 'platform'}
                        onChange={(e) => setType(e.target.value as 'platform')}
                        className="text-accent.teal"
                      />
                      <span className="text-zinc-300">Platform</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="project"
                        checked={type === 'project'}
                        onChange={(e) => setType(e.target.value as 'project')}
                        className="text-accent.teal"
                      />
                      <span className="text-zinc-300">Project</span>
                    </label>
                  </div>
                </div>

                {type === 'project' && (
                  <div>
                    <label className="block text-sm text-zinc-300 mb-2">Rating (1-5 stars)</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`text-2xl ${rating && star <= rating ? 'text-yellow-400' : 'text-zinc-600'} hover:text-yellow-400`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm text-zinc-300 mb-2">Your Feedback</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share your thoughts, suggestions, or report issues..."
                    rows={6}
                    className="w-full rounded border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-400 focus:border-accent.teal focus:outline-none resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !content.trim()}
                  className="w-full px-4 py-3 rounded bg-accent.teal text-black font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </form>
            </div>

            {/* Recent Feedback */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="font-display text-2xl text-white mb-6">Recent Feedback</h2>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {feedbacks.slice(0, 10).map((feedback) => (
                  <div key={feedback.id} className="border-b border-zinc-800 pb-4 last:border-b-0">
                    <div className="flex items-center gap-3 mb-2">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${feedback.authorName}`}
                        alt={feedback.authorName}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <div className="font-semibold text-white text-sm">{feedback.authorName}</div>
                        <div className="text-xs text-zinc-400">
                          {new Date(feedback.createdAt).toLocaleDateString()} • {feedback.type}
                        </div>
                      </div>
                      {feedback.rating && (
                        <div className="ml-auto flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className={`text-sm ${star <= feedback.rating! ? 'text-yellow-400' : 'text-zinc-600'}`}>
                              ★
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-zinc-300 text-sm">{feedback.content}</p>
                  </div>
                ))}

                {feedbacks.length === 0 && (
                  <p className="text-zinc-400 text-center py-8">No feedback yet. Be the first to share!</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-zinc-400 mb-4">Please login to share your feedback.</p>
            <a
              href="/login"
              className="px-6 py-3 rounded bg-accent.teal text-black font-semibold hover:opacity-90 inline-block"
            >
              Login to Continue
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
