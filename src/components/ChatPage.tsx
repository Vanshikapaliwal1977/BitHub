import React, { useState, useEffect, useRef } from 'react'
import { useContent } from '../contexts/ContentContext'
import { useUser } from '../contexts/UserContext'

export default function ChatPage() {
  const { messages, topics, addMessage, createTopic } = useContent()
  const { currentUser } = useUser()
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [newTopicTitle, setNewTopicTitle] = useState('')
  const [newTopicDesc, setNewTopicDesc] = useState('')
  const [showCreateTopic, setShowCreateTopic] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, selectedTopic])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser || !newMessage.trim() || !selectedTopic) return

    addMessage({
      content: newMessage.trim(),
      authorId: currentUser.id,
      authorName: currentUser.username,
      topicId: selectedTopic
    })

    setNewMessage('')
  }

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser || !newTopicTitle.trim() || !newTopicDesc.trim()) return

    createTopic({
      title: newTopicTitle.trim(),
      description: newTopicDesc.trim(),
      authorId: currentUser.id,
      authorName: currentUser.username
    })

    setNewTopicTitle('')
    setNewTopicDesc('')
    setShowCreateTopic(false)
  }

  const topicMessages = selectedTopic ? messages.filter(m => m.topicId === selectedTopic) : []
  const currentTopic = topics.find(t => t.id === selectedTopic)

  return (
    <section className="py-24">
      <div className="container max-w-6xl">
        <div className="mb-8">
          <h1 className="font-display text-4xl md:text-5xl mb-4">Community Discussions</h1>
          <p className="text-zinc-300">
            Connect with fellow developers, share ideas, and discuss projects.
          </p>
        </div>

        {currentUser ? (
          <div className="grid lg:grid-cols-4 gap-6 h-[600px]">
            {/* Topics Sidebar */}
            <div className="lg:col-span-1 bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl text-white">Topics</h2>
                <button
                  onClick={() => setShowCreateTopic(true)}
                  className="text-accent.teal hover:underline text-sm"
                >
                  + New
                </button>
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {topics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedTopic === topic.id
                        ? 'bg-accent.teal/20 border border-accent.teal/30'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="font-semibold text-white text-sm">{topic.title}</div>
                    <div className="text-xs text-zinc-400 mt-1">{topic.messageCount} messages</div>
                  </button>
                ))}

                {topics.length === 0 && (
                  <p className="text-zinc-400 text-sm text-center py-8">No topics yet. Create the first one!</p>
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-3 bg-white/5 border border-white/10 rounded-xl flex flex-col">
              {selectedTopic ? (
                <>
                  {/* Topic Header */}
                  <div className="p-4 border-b border-zinc-800">
                    <h3 className="font-display text-xl text-white">{currentTopic?.title}</h3>
                    <p className="text-zinc-400 text-sm mt-1">{currentTopic?.description}</p>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {topicMessages.map((message) => (
                      <div key={message.id} className="flex gap-3">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${message.authorName}`}
                          alt={message.authorName}
                          className="w-8 h-8 rounded-full flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-white text-sm">{message.authorName}</span>
                            <span className="text-xs text-zinc-400">
                              {new Date(message.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-zinc-300 text-sm">{message.content}</p>
                        </div>
                      </div>
                    ))}

                    {topicMessages.length === 0 && (
                      <p className="text-zinc-400 text-center py-8">No messages yet. Start the conversation!</p>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-zinc-800">
                    <form onSubmit={handleSendMessage} className="flex gap-3">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-400 focus:border-accent.teal focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="px-4 py-2 rounded bg-accent.teal text-black font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Send
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-zinc-400 mb-4">Select a topic to start discussing</p>
                    <button
                      onClick={() => setShowCreateTopic(true)}
                      className="px-4 py-2 rounded bg-accent.teal text-black font-semibold hover:opacity-90"
                    >
                      Create New Topic
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-zinc-400 mb-4">Please login to join the discussion.</p>
            <a
              href="/login"
              className="px-6 py-3 rounded bg-accent.teal text-black font-semibold hover:opacity-90 inline-block"
            >
              Login to Continue
            </a>
          </div>
        )}

        {/* Create Topic Modal */}
        {showCreateTopic && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-full max-w-md">
              <h3 className="font-display text-xl text-white mb-4">Create New Topic</h3>

              <form onSubmit={handleCreateTopic} className="space-y-4">
                <div>
                  <label className="block text-sm text-zinc-300 mb-1">Topic Title</label>
                  <input
                    type="text"
                    value={newTopicTitle}
                    onChange={(e) => setNewTopicTitle(e.target.value)}
                    placeholder="What's the topic about?"
                    className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-400 focus:border-accent.teal focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-zinc-300 mb-1">Description</label>
                  <textarea
                    value={newTopicDesc}
                    onChange={(e) => setNewTopicDesc(e.target.value)}
                    placeholder="Brief description of the topic..."
                    rows={3}
                    className="w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-400 focus:border-accent.teal focus:outline-none resize-none"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateTopic(false)}
                    className="flex-1 px-4 py-2 rounded border border-zinc-700 text-zinc-300 hover:border-zinc-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 rounded bg-accent.teal text-black font-semibold hover:opacity-90"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
