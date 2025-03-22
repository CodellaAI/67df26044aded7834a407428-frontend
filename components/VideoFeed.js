
'use client'

import { useState, useRef, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { useRouter } from 'next/navigation'
import VideoCard from './VideoCard'

export default function VideoFeed({ videos }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef(null)
  const router = useRouter()
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1)
      } else if (e.key === 'ArrowDown' && currentIndex < videos.length - 1) {
        setCurrentIndex(prev => prev + 1)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, videos.length])
  
  // Scroll to current video when index changes
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current
      const videoElement = container.children[currentIndex]
      if (videoElement) {
        videoElement.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [currentIndex])
  
  if (!videos || videos.length === 0) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No videos found</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Be the first to upload a video!
          </p>
        </div>
      </div>
    )
  }
  
  const handleVideoClick = (videoId) => {
    router.push(`/video/${videoId}`)
  }
  
  return (
    <div 
      ref={containerRef}
      className="snap-container"
    >
      {videos.map((video, index) => (
        <VideoInView 
          key={video._id} 
          video={video} 
          isActive={index === currentIndex}
          onActive={() => setCurrentIndex(index)}
          onClick={() => handleVideoClick(video._id)}
        />
      ))}
    </div>
  )
}

function VideoInView({ video, isActive, onActive, onClick }) {
  const { ref, inView } = useInView({
    threshold: 0.7,
  })
  
  useEffect(() => {
    if (inView) {
      onActive()
    }
  }, [inView, onActive])
  
  return (
    <div ref={ref} className="snap-item">
      <VideoCard 
        video={video} 
        isActive={isActive} 
        onClick={onClick}
      />
    </div>
  )
}
