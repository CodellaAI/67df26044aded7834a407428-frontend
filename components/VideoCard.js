
'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from './AuthProvider'
import { Heart, MessageCircle, Share2, Music, Volume2, VolumeX } from 'lucide-react'

export default function VideoCard({ video, isActive, onClick }) {
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(video.likes || 0)
  const [muted, setMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef(null)
  const { user, token } = useAuth()
  
  useEffect(() => {
    // Check if user has liked this video
    const checkLikeStatus = async () => {
      if (user && token) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/videos/${video._id}/check-like`,
            { headers: { Authorization: `Bearer ${token}` } }
          )
          setLiked(response.data.liked)
        } catch (error) {
          console.error('Error checking like status:', error)
        }
      }
    }
    
    checkLikeStatus()
  }, [video._id, user, token])
  
  useEffect(() => {
    const videoElement = videoRef.current
    
    if (videoElement) {
      if (isActive) {
        videoElement.currentTime = 0
        const playPromise = videoElement.play()
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true)
            })
            .catch(error => {
              console.error('Play error:', error)
              setIsPlaying(false)
            })
        }
      } else {
        videoElement.pause()
        setIsPlaying(false)
      }
    }
    
    return () => {
      if (videoElement) {
        videoElement.pause()
      }
    }
  }, [isActive])
  
  const togglePlay = (e) => {
    e.stopPropagation()
    const videoElement = videoRef.current
    
    if (videoElement) {
      if (isPlaying) {
        videoElement.pause()
        setIsPlaying(false)
      } else {
        const playPromise = videoElement.play()
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true)
            })
            .catch(error => {
              console.error('Play error:', error)
            })
        }
      }
    }
  }
  
  const toggleMute = (e) => {
    e.stopPropagation()
    setMuted(!muted)
  }
  
  const handleLike = async (e) => {
    e.stopPropagation()
    
    if (!user || !token) {
      toast.error('You must be logged in to like videos')
      return
    }
    
    try {
      if (liked) {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/api/videos/${video._id}/unlike`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setLikesCount(prev => prev - 1)
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/videos/${video._id}/like`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setLikesCount(prev => prev + 1)
      }
      
      // Toggle like state
      setLiked(!liked)
    } catch (error) {
      console.error('Error liking/unliking video:', error)
      toast.error('Action failed. Please try again.')
    }
  }
  
  const handleShare = (e) => {
    e.stopPropagation()
    
    if (navigator.share) {
      navigator.share({
        title: video.caption,
        url: `${window.location.origin}/video/${video._id}`,
      })
        .then(() => console.log('Shared successfully'))
        .catch((error) => console.error('Error sharing:', error))
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(`${window.location.origin}/video/${video._id}`)
        .then(() => toast.success('Link copied to clipboard!'))
        .catch(() => toast.error('Failed to copy link'))
    }
  }
  
  return (
    <div 
      className="relative flex items-center justify-center h-full w-full cursor-pointer"
      onClick={onClick}
    >
      <div className="relative w-full max-w-[500px] h-full max-h-[90vh] overflow-hidden">
        <video
          ref={videoRef}
          src={`${process.env.NEXT_PUBLIC_API_URL}${video.videoUrl}`}
          className="w-full h-full object-contain bg-black"
          loop
          playsInline
          muted={muted}
          onClick={togglePlay}
        />
        
        {/* Video controls */}
        <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-black bg-opacity-50 rounded-full p-1">
          <button onClick={togglePlay} className="p-1 text-white">
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            )}
          </button>
          
          <button onClick={toggleMute} className="p-1 text-white">
            {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
        
        {/* User info */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between pointer-events-none">
          <div className="pointer-events-auto">
            <Link href={`/profile/${video.user.username}`} onClick={(e) => e.stopPropagation()} className="flex items-center">
              <div className="relative w-10 h-10 mr-3">
                <Image
                  src={video.user.avatar || 'https://placehold.co/400x400?text=User'}
                  alt={video.user.username}
                  fill
                  className="rounded-full object-cover border-2 border-white"
                />
              </div>
              <div>
                <h3 className="font-semibold text-white">@{video.user.username}</h3>
                <p className="text-sm text-white text-opacity-80">{video.caption}</p>
              </div>
            </Link>
            
            {video.sound && (
              <div className="flex items-center mt-2 ml-1">
                <Music size={14} className="text-white mr-1" />
                <p className="text-xs text-white">
                  {video.sound}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="absolute right-3 bottom-20 flex flex-col items-center space-y-4 pointer-events-none">
          <button 
            onClick={handleLike} 
            className={`flex flex-col items-center pointer-events-auto ${liked ? 'text-primary' : 'text-white'}`}
          >
            <div className={`bg-black bg-opacity-50 rounded-full p-2 ${liked ? 'heart-beat' : ''}`}>
              <Heart className={`w-6 h-6 ${liked ? 'fill-current' : ''}`} />
            </div>
            <span className="text-xs mt-1">{likesCount}</span>
          </button>
          
          <button 
            onClick={(e) => e.stopPropagation()} 
            className="flex flex-col items-center text-white pointer-events-auto"
          >
            <div className="bg-black bg-opacity-50 rounded-full p-2">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="text-xs mt-1">{video.comments || 0}</span>
          </button>
          
          <button 
            onClick={handleShare} 
            className="flex flex-col items-center text-white pointer-events-auto"
          >
            <div className="bg-black bg-opacity-50 rounded-full p-2">
              <Share2 className="w-6 h-6" />
            </div>
            <span className="text-xs mt-1">Share</span>
          </button>
        </div>
      </div>
    </div>
  )
}
