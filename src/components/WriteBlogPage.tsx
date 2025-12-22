import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContent } from '../contexts/ContentContext'
import { useUser } from '../contexts/UserContext'

export default function WriteBlogPage() {
  const { addBlog } = useContent()
  const { currentUser } = useUser()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isGuest = !currentUser

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    setIsSubmitting(true)

    try {
      const tagArray = tags.split(',').map(tag => tag.trim()).filter(Boolean)

      addBlog({
        title: title.trim(),
        content: content.trim(),
        authorId: currentUser.id,
        authorName: currentUser.username,
        tags: tagArray,
        isPublic
      })

      navigate('/blogs')
    } catch (error) {
      console.error('Error publishing blog:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-24">
      <div className="container max-w-5xl">
        <h1 className="font-display text-4xl md:text-5xl mb-6">Write a Blog</h1>

        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {isGuest && (
              <div className="text-sm text-zinc-600">You can preview the editor, but please login to publish your blog.</div>
            )}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-zinc-700 mb-1">Blog Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter Blog Title"
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 bg-white text-zinc-900 placeholder-zinc-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-700 mb-1">Blog Tag</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Enter Blog Tag"
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 bg-white text-zinc-900 placeholder-zinc-400"
                />
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm text-zinc-700">
                <input type="checkbox" checked={isPublic} onChange={e=>setIsPublic(e.target.checked)} /> Make Public
              </label>
            </div>

            {/* Faux editor: dark toolbar + dark editor area */}
            <div className="rounded-md overflow-hidden border border-zinc-300">
              <div className="bg-zinc-900 px-2 py-1 text-sm text-zinc-300 flex items-center gap-3">
                <span className="font-semibold">•</span>
                <span>B</span><span>I</span><span>U</span>
                <span className="ml-2">|</span>
                <span>List</span>
                <span>Link</span>
                <span>Code</span>
                <span className="ml-auto">⤢</span>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type your content here"
                rows={14}
                className="w-full bg-zinc-950 text-zinc-100 px-4 py-3 outline-none placeholder-zinc-600"
                required
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/blogs')}
                className="px-5 py-2 rounded-md border border-zinc-300 text-zinc-700 hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !title.trim() || !content.trim() || isGuest}
                className="px-5 py-2 rounded-md bg-[#7c3aed] text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGuest ? 'Login to Publish' : isSubmitting ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
