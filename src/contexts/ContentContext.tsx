import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useUser } from './UserContext'

export interface Blog {
  id: string
  title: string
  content: string
  authorId: string
  authorName: string
  tags: string[]
  createdAt: string
  updatedAt: string
  likes: number
  comments: Comment[]
  isPublic: boolean
}

export interface Comment {
  id: string
  content: string
  authorId: string
  authorName: string
  createdAt: string
}

export interface Feedback {
  id: string
  type: 'project' | 'platform'
  targetId?: string // project id if type is project
  content: string
  authorId: string
  authorName: string
  rating?: number // 1-5 stars
  createdAt: string
}

export interface Message {
  id: string
  content: string
  authorId: string
  authorName: string
  topicId?: string
  createdAt: string
}

export interface DiscussionTopic {
  id: string
  title: string
  description: string
  authorId: string
  authorName: string
  createdAt: string
  messageCount: number
}

export interface Project {
  id: string
  title: string
  blurb: string
  link?: string
  tags: string[]
  image?: string
  authorId: string
  authorName: string
  createdAt: string
  isPublic: boolean
}

interface ContentContextType {
  blogs: Blog[]
  projects: Project[]
  feedbacks: Feedback[]
  messages: Message[]
  topics: DiscussionTopic[]
  addBlog: (blog: Omit<Blog, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'comments'> & { isPublic?: boolean }) => void
  addProject: (project: Omit<Project, 'id' | 'createdAt'> & { isPublic?: boolean }) => void
  updateBlog: (id: string, updates: Partial<Blog>) => void
  deleteBlog: (id: string) => void
  addComment: (blogId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void
  addFeedback: (feedback: Omit<Feedback, 'id' | 'createdAt'>) => void
  addMessage: (message: Omit<Message, 'id' | 'createdAt'>) => void
  createTopic: (topic: Omit<DiscussionTopic, 'id' | 'createdAt' | 'messageCount'>) => void
  likeBlog: (blogId: string) => void
}

const ContentContext = createContext<ContentContextType | null>(null)

export const useContent = () => {
  const context = useContext(ContentContext)
  if (!context) throw new Error('useContent must be used within ContentProvider')
  return context
}

interface ContentProviderProps {
  children: ReactNode
}

export const ContentProvider: React.FC<ContentProviderProps> = ({ children }) => {
  const { currentUser } = useUser()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [topics, setTopics] = useState<DiscussionTopic[]>([])

  // Load data from localStorage on mount
  useEffect(() => {
    const savedBlogs = localStorage.getItem('portfolio-blogs')
    const savedProjects = localStorage.getItem('portfolio-projects')
    const savedFeedbacks = localStorage.getItem('portfolio-feedbacks')
    const savedMessages = localStorage.getItem('portfolio-messages')
    const savedTopics = localStorage.getItem('portfolio-topics')

    if (savedBlogs) {
      setBlogs(JSON.parse(savedBlogs))
    } else {
      // Seed with demo blogs
      const demoBlogs: Blog[] = [
        {
          id: '1',
          title: 'Getting Started with React and TypeScript',
          content: 'React with TypeScript provides excellent developer experience...',
          authorId: '1',
          authorName: 'vanshika',
          tags: ['React', 'TypeScript', 'Frontend'],
          createdAt: '2024-12-01',
          updatedAt: '2024-12-01',
          likes: 5,
          comments: [
            {
              id: '1',
              content: 'Great article! Very helpful for beginners.',
              authorId: '2',
              authorName: 'demo-user',
              createdAt: '2024-12-02'
            }
          ],
          isPublic: true
        }
      ]
      setBlogs(demoBlogs)
      localStorage.setItem('portfolio-blogs', JSON.stringify(demoBlogs))
    }

    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    }

    if (savedFeedbacks) {
      setFeedbacks(JSON.parse(savedFeedbacks))
    }

    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    }

    if (savedTopics) {
      setTopics(JSON.parse(savedTopics))
    } else {
      // Seed with demo topics
      const demoTopics: DiscussionTopic[] = [
        {
          id: '1',
          title: 'Project Collaboration Ideas',
          description: 'Share your thoughts on how we can collaborate on projects',
          authorId: '1',
          authorName: 'vanshika',
          createdAt: '2024-12-01',
          messageCount: 3
        }
      ]
      setTopics(demoTopics)
      localStorage.setItem('portfolio-topics', JSON.stringify(demoTopics))
    }
  }, [])

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('portfolio-blogs', JSON.stringify(blogs))
  }, [blogs])

  useEffect(() => {
    localStorage.setItem('portfolio-projects', JSON.stringify(projects))
  }, [projects])

  useEffect(() => {
    localStorage.setItem('portfolio-feedbacks', JSON.stringify(feedbacks))
  }, [feedbacks])

  useEffect(() => {
    localStorage.setItem('portfolio-messages', JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    localStorage.setItem('portfolio-topics', JSON.stringify(topics))
  }, [topics])

  const addBlog = (blogData: Omit<Blog, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'comments'>) => {
    if (!currentUser) throw new Error('Must be logged in to add blog')

    const newBlog: Blog = {
      ...blogData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      comments: []
    }

    setBlogs(prev => [newBlog, ...prev])
  }

  const addProject = (projectData: Omit<Project, 'id' | 'createdAt'> & { isPublic?: boolean }) => {
    if (!currentUser) throw new Error('Must be logged in to add project')

    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isPublic: projectData.isPublic ?? true
    }

    setProjects(prev => [newProject, ...prev])
  }

  const updateBlog = (id: string, updates: Partial<Blog>) => {
    setBlogs(prev => prev.map(blog =>
      blog.id === id
        ? { ...blog, ...updates, updatedAt: new Date().toISOString() }
        : blog
    ))
  }

  const deleteBlog = (id: string) => {
    setBlogs(prev => prev.filter(blog => blog.id !== id))
  }

  const addComment = (blogId: string, commentData: Omit<Comment, 'id' | 'createdAt'>) => {
    if (!currentUser) throw new Error('Must be logged in to comment')

    const newComment: Comment = {
      ...commentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }

    setBlogs(prev => prev.map(blog =>
      blog.id === blogId
        ? { ...blog, comments: [...blog.comments, newComment] }
        : blog
    ))
  }

  const addFeedback = (feedbackData: Omit<Feedback, 'id' | 'createdAt'>) => {
    if (!currentUser) throw new Error('Must be logged in to add feedback')

    const newFeedback: Feedback = {
      ...feedbackData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }

    setFeedbacks(prev => [newFeedback, ...prev])
  }

  const addMessage = (messageData: Omit<Message, 'id' | 'createdAt'>) => {
    if (!currentUser) throw new Error('Must be logged in to send message')

    const newMessage: Message = {
      ...messageData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }

    setMessages(prev => [...prev, newMessage])

    // Update topic message count
    if (messageData.topicId) {
      setTopics(prev => prev.map(topic =>
        topic.id === messageData.topicId
          ? { ...topic, messageCount: topic.messageCount + 1 }
          : topic
      ))
    }
  }

  const createTopic = (topicData: Omit<DiscussionTopic, 'id' | 'createdAt' | 'messageCount'>) => {
    if (!currentUser) throw new Error('Must be logged in to create topic')

    const newTopic: DiscussionTopic = {
      ...topicData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      messageCount: 0
    }

    setTopics(prev => [newTopic, ...prev])
  }

  const likeBlog = (blogId: string) => {
    setBlogs(prev => prev.map(blog =>
      blog.id === blogId
        ? { ...blog, likes: blog.likes + 1 }
        : blog
    ))
  }

  const value: ContentContextType = {
    blogs,
    projects,
    feedbacks,
    messages,
    topics,
    addBlog,
    addProject,
    updateBlog,
    deleteBlog,
    addComment,
    addFeedback,
    addMessage,
    createTopic,
    likeBlog
  }

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  )
}
