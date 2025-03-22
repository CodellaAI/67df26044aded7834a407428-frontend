
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { useAuth } from '@/components/AuthProvider'
import { Grid, Bookmark, UserCheck, UserPlus } from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'
import VideoGrid from '@/components/VideoGrid'

export default function ProfilePage() {
  const { username } = useParams()
  const [profile, setProfile] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('videos')
  const { user, token } = useAuth()
  const [isFollowing, setIsFollowing] = useState(false)
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const profileResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${username}`)
        setProfile(profileResponse.data)
        
        // Check if the current user is following this profile
        if (user && token) {
          try {
            const followResponse = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}/api/users/check-follow/${profileResponse.data._id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            )
            setIsFollowing(followResponse.data.isFollowing)
          } catch (error) {
            console.error('Error checking follow status:', error)
          }
        }
        
        // Fetch user's videos
        const videosResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/user/${profileResponse.data._id}`)
        setVideos(videosResponse.data)
      } catch (error) {
        console.error('Error fetching profile:', error)
        toast.error('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    
    if (username) {
      fetchProfile()
    }
  }, [username, user, token])
  
  const handleFollow = async () => {
    if (!user || !token) {
      toast.error('You must be logged in to follow users')
      return
    }
    
    try {
      if (isFollowing) {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/unfollow/${profile._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        toast.success(`Unfollowed @${profile.username}`)
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/follow/${profile._id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )
        toast.success(`Following @${profile.username}`)
      }
      
      // Toggle following state
      setIsFollowing(!isFollowing)
      
      // Update follower count
      setProfile(prev => ({
        ...prev,
        followers: isFollowing ? prev.followers - 1 : prev.followers + 1
      }))
    } catch (error) {
      console.error('Error following/unfollowing:', error)
      toast.error('Action failed. Please try again.')
    }
  }
  
  if (loading) {
    return <LoadingSpinner />
  }
  
  if (!profile) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">User not found</h2>
          <p className="text-gray-600 dark:text-gray-400">The user you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
        <div className="relative w-24 h-24 md:w-32 md:h-32">
          <Image
            src={profile.avatar || 'https://placehold.co/400x400?text=User'}
            alt={profile.username}
            fill
            className="rounded-full object-cover border-2 border-gray-200 dark:border-gray-800"
          />
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold mb-1">@{profile.username}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{profile.bio || 'No bio yet'}</p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-4">
            <div className="text-center">
              <p className="font-semibold">{videos.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Videos</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">{profile.followers}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Followers</p>
            </div>
            <div className="text-center">
              <p className="font-semibold">{profile.following}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Following</p>
            </div>
          </div>
          
          {user && user._id !== profile._id && (
            <button
              onClick={handleFollow}
              className={`px-6 py-2 rounded-full font-medium flex items-center justify-center transition-colors ${
                isFollowing 
                  ? 'bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700' 
                  : 'bg-primary text-white hover:bg-primary/90'
              }`}
            >
              {isFollowing ? (
                <>
                  <UserCheck className="w-4 h-4 mr-2" />
                  Following
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Follow
                </>
              )}
            </button>
          )}
        </div>
      </div>
      
      <div className="border-b border-gray-200 dark:border-gray-800 mb-6">
        <div className="flex">
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex items-center py-3 px-4 font-medium transition-colors ${
              activeTab === 'videos' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Grid className="w-5 h-5 mr-2" />
            Videos
          </button>
          <button
            onClick={() => setActiveTab('liked')}
            className={`flex items-center py-3 px-4 font-medium transition-colors ${
              activeTab === 'liked' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Bookmark className="w-5 h-5 mr-2" />
            Liked
          </button>
        </div>
      </div>
      
      {activeTab === 'videos' && (
        <div>
          {videos.length > 0 ? (
            <VideoGrid videos={videos} />
          ) : (
            <div className="text-center py-12">
              <p className="text-lg font-medium mb-2">No videos yet</p>
              <p className="text-gray-600 dark:text-gray-400">This user hasn't posted any videos.</p>
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'liked' && (
        <div className="text-center py-12">
          <p className="text-lg font-medium mb-2">Liked videos</p>
          <p className="text-gray-600 dark:text-gray-400">This feature is coming soon.</p>
        </div>
      )}
    </div>
  )
}
