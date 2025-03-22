
'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'
import moment from 'moment'
import toast from 'react-hot-toast'
import { useAuth } from '@/components/AuthProvider'
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, ChevronLeft } from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'
import CommentSection from '@/components/CommentSection'

export default function VideoPage() {
  const { id } = useParams()
  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [showComments, setShowComments] = useState(true)
  const { user, token } = useAuth()
  const router = useRouter()
  const videoRef = useRef(null)
  
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/${id}`)
        setVideo(response.data)
        setLikesCount(response.data.likes)
        
        // Check if the current user has liked this video
        if (user && token) {
          try {
            const likeResponse = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/api/videos/${id}/check-like`,
              { headers: { Authorization: `Bearer ${token}` } }
            )
            setLiked(likeResponse.data.liked)
          } catch (error) {
            console.error('Error checking like status:', error)
          }
        }
      } catch (error) {
        console.error('Error fetching video:', error)
        toast.error('Failed to load video')
      } finally {
        setLoading(false)
      }
    }
    
    if (id) {
      fetchVideo()
    }
  }, [id, user, token])
  
  const handleLike = async () => {
    if (!user || !token) {
      toast.error('You must be logged in to like videos')
      return
    }
    
    try {
      if (liked) {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/api/videos/${id}/unlike`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setLikesCount(prev => prev - 1)
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/videos/${id}/like`,
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
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: video.caption,
        url: window.location.href,
      })
        .then(() => console.log('Shared successfully'))
        .catch((error) => console.error('Error sharing:', error))
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.success('Link copied to clipboard!'))
        .catch(() => toast.error('Failed to copy link'))
    }
  }
  
  if (loading) {
    return <LoadingSpinner />
  }
  
  if (!video) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Video not found</h2>
          <p className="text-gray-600 dark:text-gray-400">The video you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <button 
        onClick={() => router.back()} 
        className="mb-4 flex items-center text-sm font-medium hover:underline"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back
      </button>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3">
          <div className="relative bg-black rounded-lg overflow-hidden aspect-[9/16] max-h-[80vh] mx-auto">
            <video
              ref={videoRef}
              src={`${process.env.NEXT_PUBLIC_API_URL}${video.videoUrl}`}
              className="absolute inset-0 w-full h-full object-contain"
              controls
              autoPlay
              loop
              playsInline
            />
          </div>
        </div>
        
        <div className="lg:w-1/3 flex flex-col">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <Link href={`/profile/${video.user.username}`} className="flex items-center">
                <div className="relative w-10 h-10 mr-3">
                  <Image
                    src={video.user.avatar || 'https://placehold.co/400x400?text=User'}
                    alt={video.user.username}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">@{video.user.username}</h3>
                  <p className="text-xs text-gray-500">{moment(video.createdAt).fromNow()}</p>
                </div>
              </Link>
              
              <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            
            <p className="mb-2">{video.caption}</p>
            
            {video.tags && video.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {video.tags.map((tag, index) => (
                  <span key={index} className="text-primary text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            
            <div className="flex items-center justify-between py-3 border-y border-gray-200 dark:border-gray-800">
              <button 
                onClick={handleLike}
                className={`flex items-center ${liked ? 'text-primary' : 'text-gray-600 dark:text-gray-400'}`}
              >
                <Heart className={`w-6 h-6 mr-1 ${liked ? 'fill-current' : ''}`} />
                <span>{likesCount}</span>
              </button>
              
              <button 
                onClick={() => setShowComments(!showComments)}
                className="flex items-center text-gray-600 dark:text-gray-400"
              >
                <MessageCircle className="w-6 h-6 mr-1" />
                <span>{video.comments || 0}</span>
              </button>
              
              <button 
                onClick={handleShare}
                className="flex items-center text-gray-600 dark:text-gray-400"
              >
                <Share2 className="w-6 h-6 mr-1" />
              </button>
              
              <button className="flex items-center text-gray-600 dark:text-gray-400">
                <Bookmark className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          {showComments && (
            <CommentSection videoId={id} />
          )}
        </div>
      </div>
    </div>
  )
}
