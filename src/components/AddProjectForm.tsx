import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContent } from '../contexts/ContentContext'
import { useUser } from '../contexts/UserContext'

export default function AddProjectForm() {
  const { addProject } = useContent()
  const { currentUser } = useUser()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [link, setLink] = useState('')
  const [category, setCategory] = useState('')
  const [featured, setFeatured] = useState(false)
  const [achievement, setAchievement] = useState(false)
  const [isPublic, setIsPublic] = useState(true)
  const [desc, setDesc] = useState('')
  const [image, setImage] = useState<string | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isGuest = !currentUser

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !desc.trim()) return
    if (isGuest) return

    setIsSubmitting(true)

    try {
      const tags = category
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)
      if (featured && !tags.includes('Featured')) tags.unshift('Featured')
      if (achievement && !tags.includes('Achievement')) tags.push('Achievement')

      addProject({
        title: title.trim(),
        blurb: desc.trim(),
        link: link.trim() || undefined,
        tags,
        image,
        authorId: currentUser.id,
        authorName: currentUser.username,
        isPublic
      })

      navigate('/projects')
    } catch (error) {
      console.error('Error adding project:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 bg-zinc-50 border border-zinc-200 p-6 rounded-xl">
      {isGuest && (
        <div className="text-sm text-zinc-600">You can preview the form, but please login to submit your project.</div>
      )}
      <h3 className="font-semibold text-zinc-900 text-lg">Add Your Project</h3>
      <div>
        <label className="block text-sm text-zinc-700 mb-1">Title</label>
        <input
          value={title}
          onChange={e=>setTitle(e.target.value)}
          placeholder="Project Title"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 bg-white"
          required
        />
      </div>
      <div>
        <label className="block text-sm text-zinc-700 mb-1">GitHub Link</label>
        <input
          value={link}
          onChange={e=>setLink(e.target.value)}
          placeholder="Enter the link to your GitHub repository"
          className="w-full rounded-md border border-zinc-300 px-3 py-2 bg-white"
        />
      </div>
      <div className="grid md:grid-cols-2 gap-4 items-end">
        <div>
          <label className="block text-sm text-zinc-700 mb-1">Category</label>
          <input
            value={category}
            onChange={e=>setCategory(e.target.value)}
            placeholder="e.g. Web Development, Android, etc."
            className="w-full rounded-md border border-zinc-300 px-3 py-2 bg-white"
          />
        </div>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input type="checkbox" checked={featured} onChange={e=>setFeatured(e.target.checked)} /> Featured
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input type="checkbox" checked={achievement} onChange={e=>setAchievement(e.target.checked)} /> Achievement
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input type="checkbox" checked={isPublic} onChange={e=>setIsPublic(e.target.checked)} /> Public
          </label>
        </div>
      </div>
      <div>
        <label className="block text-sm text-zinc-700 mb-1">Project Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e)=>{
            const f = e.target.files?.[0]; if (f) setImage(URL.createObjectURL(f))
          }}
        />
      </div>
      <div>
        <label className="block text-sm text-zinc-700 mb-1">Project Description</label>
        <textarea
          value={desc}
          onChange={e=>setDesc(e.target.value)}
          placeholder="Project Description"
          rows={5}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 bg-white"
          required
        />
      </div>
      <div className="text-right">
        <button
          type="submit"
          disabled={isSubmitting || !title.trim() || !desc.trim() || isGuest}
          className="px-4 py-2 rounded-md bg-zinc-900 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGuest ? 'Login to Submit' : isSubmitting ? 'Adding...' : 'Submit'}
        </button>
      </div>
    </form>
  )
}
