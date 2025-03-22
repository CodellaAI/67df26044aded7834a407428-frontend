
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Play } from 'lucide-react'

export default function VideoGrid({ videos }) {
  const router = useRouter()
  
  if (!videos || videos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg font-medium mb-2">No videos found</p>
        <p className="text-gray-600 dark:text-gray-400">There are no videos to display.</p>
      </div>
    )
  }
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-4">
      {videos.map(video => (
        <VideoGridItem key={video._id} video={video} onClick={() => router.push(`/video/${video._id}`)} />
      ))}
    </div>
  )
}

function VideoGridItem({ video, onClick }) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <div 
      className="relative aspect-[9/16] rounded-md overflow-hidden cursor-pointer bg-black"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail or Preview */}
      <div className="absolute inset-0">
        {isHovered ? (
          <video 
            src={`${process.env.NEXT_PUBLIC_API_URL}${video.videoUrl}`} 
            className="w-full h-full object-cover"
            autoPlay 
            muted 
            loop 
          />
        ) : (
          <img 
            src={video.thumbnail || `${process.env.NEXT_PUBLIC_API_URL}${video.videoUrl}`} 
            alt={video.caption}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-20 transition-opacity duration-300 hover:bg-opacity-30">
        <div className="absolute bottom-2 left-2 right-2">
          <p className="text-white text-sm line-clamp-1">{video.caption}</p>
          
          <div className="flex items-center mt-1">
            <div className="flex items-center">
              <Play className="h-3 w-3 text-white mr-1" />
              <span className="text-white text-xs">{video.views || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
