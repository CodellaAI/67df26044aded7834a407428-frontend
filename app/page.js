
'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import VideoFeed from '@/components/VideoFeed'
import Sidebar from '@/components/Sidebar'
import { useAuth } from '@/components/AuthProvider'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function Home() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/videos`)
        setVideos(response.data)
      } catch (error) {
        console.error('Error fetching videos:', error)
        setError('Failed to load videos. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Oops!</h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <VideoFeed videos={videos} />
      </div>
    </div>
  )
}
