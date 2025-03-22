
'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { useAuth } from '@/components/AuthProvider'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Upload, X, Video } from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function UploadPage() {
  const [videoFile, setVideoFile] = useState(null)
  const [caption, setCaption] = useState('')
  const [tags, setTags] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const router = useRouter()
  const { user, token } = useAuth()

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0]
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    } else {
      toast.error('Please upload a valid video file')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': []
    },
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024, // 100MB max
  })

  const handleUpload = async (e) => {
    e.preventDefault()
    
    if (!videoFile) {
      toast.error('Please select a video to upload')
      return
    }

    if (!caption.trim()) {
      toast.error('Please add a caption')
      return
    }

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('video', videoFile)
      formData.append('caption', caption)
      formData.append('tags', tags)

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/videos`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      )

      toast.success('Video uploaded successfully!')
      router.push('/')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error.response?.data?.message || 'Error uploading video')
    } finally {
      setUploading(false)
    }
  }

  const clearVideo = () => {
    setVideoFile(null)
    setPreviewUrl('')
  }

  if (!user) {
    return <LoadingSpinner />
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Upload Video</h1>
      
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6">
        <form onSubmit={handleUpload}>
          {!videoFile ? (
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed ${isDragActive ? 'border-primary' : 'border-gray-300'} 
                rounded-lg p-12 text-center cursor-pointer transition-all hover:border-primary`}
            >
              <input {...getInputProps()} />
              <Video className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <p className="text-lg mb-2">Drag and drop a video file here, or click to select</p>
              <p className="text-sm text-gray-500">MP4 or WebM format (Max 100MB)</p>
            </div>
          ) : (
            <div className="mb-6">
              <div className="relative">
                <video 
                  src={previewUrl} 
                  className="w-full h-[500px] object-contain bg-black rounded-lg" 
                  controls
                />
                <button 
                  type="button"
                  onClick={clearVideo}
                  className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 p-1 rounded-full text-white"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500">{videoFile.name}</p>
            </div>
          )}
          
          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="caption" className="block text-sm font-medium mb-1">
                Caption
              </label>
              <input
                type="text"
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                maxLength={150}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md 
                  focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
                placeholder="Add a caption..."
              />
              <p className="text-xs text-right mt-1 text-gray-500">{caption.length}/150</p>
            </div>
            
            <div>
              <label htmlFor="tags" className="block text-sm font-medium mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md 
                  focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
                placeholder="funny, dance, challenge"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              disabled={uploading || !videoFile}
              className={`w-full flex items-center justify-center py-3 px-4 rounded-md 
                text-white font-medium transition-colors ${uploading || !videoFile 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-primary hover:bg-primary/90'}`}
            >
              {uploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Video
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
