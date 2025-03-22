
'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import moment from 'moment'
import toast from 'react-hot-toast'
import { useAuth } from './AuthProvider'
import { Heart, Send } from 'lucide-react'

export default function CommentSection({ videoId }) {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { user, token } = useAuth()
  
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/${videoId}/comments`)
        setComments(response.data)
      } catch (error) {
        console.error('Error fetching comments:', error)
        toast.error('Failed to load comments')
      } finally {
        setLoading(false)
      }
    }
    
    fetchComments()
  }, [videoId])
  
  const handleSubmitComment = async (e) => {
    e.preventDefault()
    
    if (!user || !token) {
      toast.error('You must be logged in to comment')
      return
    }
    
    if (!newComment.trim()) {
      toast.error('Comment cannot be empty')
      return
    }
    
    try {
      setSubmitting(true)
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/videos/${videoId}/comments`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      // Add the new comment to the list
      setComments([response.data, ...comments])
      
      // Clear the input
      setNewComment('')
      
      toast.success('Comment posted!')
    } catch (error) {
      console.error('Error posting comment:', error)
      toast.error('Failed to post comment')
    } finally {
      setSubmitting(false)
    }
  }
  
  const handleLikeComment = async (commentId, index) => {
    if (!user || !token) {
      toast.error('You must be logged in to like comments')
      return
    }
    
    try {
      const comment = comments[index]
      const isLiked = comment.isLiked
      
      // Optimistic update
      const updatedComments = [...comments]
      updatedComments[index] = {
        ...comment,
        isLiked: !isLiked,
        likes: isLiked ? comment.likes - 1 : comment.likes + 1
      }
      setComments(updatedComments)
      
      if (isLiked) {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${commentId}/unlike`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${commentId}/like`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )
      }
    } catch (error) {
      console.error('Error liking/unliking comment:', error)
      toast.error('Action failed. Please try again.')
      
      // Revert the optimistic update
      fetchComments()
    }
  }
  
  return (
    <div className="flex flex-col h-full">
      <h3 className="font-semibold mb-4">Comments</h3>
      
      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-4 flex">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-l-md 
              focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
            disabled={submitting}
          />
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className={`px-3 py-2 rounded-r-md flex items-center justify-center ${
              submitting || !newComment.trim()
                ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary/90'
            }`}
          >
            {submitting ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </form>
      ) : (
        <div className="mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-md text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <Link href="/login" className="text-primary font-medium hover:underline">
              Log in
            </Link> to comment
          </p>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-4">
            <svg className="animate-spin h-6 w-6 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment, index) => (
              <div key={comment._id} className="flex space-x-3">
                <Link href={`/profile/${comment.user.username}`}>
                  <div className="relative w-8 h-8 flex-shrink-0">
                    <Image
                      src={comment.user.avatar || 'https://placehold.co/400x400?text=User'}
                      alt={comment.user.username}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                </Link>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link href={`/profile/${comment.user.username}`} className="font-medium text-sm hover:underline">
                        @{comment.user.username}
                      </Link>
                      <p className="text-sm break-words">{comment.content}</p>
                    </div>
                    
                    <button
                      onClick={() => handleLikeComment(comment._id, index)}
                      className={`flex items-center text-xs ${comment.isLiked ? 'text-primary' : 'text-gray-500'}`}
                    >
                      <Heart className={`h-4 w-4 ${comment.isLiked ? 'fill-current' : ''}`} />
                      <span className="ml-1">{comment.likes}</span>
                    </button>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-1">
                    {moment(comment.createdAt).fromNow()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  )
}
