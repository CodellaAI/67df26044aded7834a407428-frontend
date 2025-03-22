
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from './AuthProvider'
import { Home, Compass, Users, BookMarked, Music, Hash } from 'lucide-react'

export default function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [expanded, setExpanded] = useState(true)
  
  // Only show on homepage
  if (pathname !== '/') {
    return null
  }
  
  // Hide on mobile
  const sidebarClasses = `hidden md:flex flex-col h-[calc(100vh-70px)] border-r border-gray-200 dark:border-gray-800 pt-4 ${
    expanded ? 'w-64' : 'w-20'
  } transition-all duration-300 sticky top-16`
  
  return (
    <aside className={sidebarClasses}>
      <div className="px-4 mb-6 flex justify-end">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          {expanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          )}
        </button>
      </div>
      
      <nav className="flex-1 px-2 space-y-1">
        <Link
          href="/"
          className={`flex items-center px-3 py-3 rounded-md ${
            pathname === '/' 
              ? 'bg-gray-100 dark:bg-gray-800 text-primary' 
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Home className="h-6 w-6" />
          {expanded && <span className="ml-3 font-medium">For You</span>}
        </Link>
        
        <Link
          href="/following"
          className="flex items-center px-3 py-3 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Users className="h-6 w-6" />
          {expanded && <span className="ml-3 font-medium">Following</span>}
        </Link>
        
        <Link
          href="/explore"
          className="flex items-center px-3 py-3 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Compass className="h-6 w-6" />
          {expanded && <span className="ml-3 font-medium">Explore</span>}
        </Link>
        
        {user && (
          <Link
            href="/bookmarks"
            className="flex items-center px-3 py-3 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <BookMarked className="h-6 w-6" />
            {expanded && <span className="ml-3 font-medium">Saved</span>}
          </Link>
        )}
      </nav>
      
      {expanded && (
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Popular Topics
          </h3>
          <div className="space-y-2">
            <Link href="/tag/comedy" className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary">
              <Hash className="h-4 w-4 mr-2" />
              Comedy
            </Link>
            <Link href="/tag/dance" className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary">
              <Hash className="h-4 w-4 mr-2" />
              Dance
            </Link>
            <Link href="/tag/pets" className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary">
              <Hash className="h-4 w-4 mr-2" />
              Pets
            </Link>
            <Link href="/tag/food" className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary">
              <Hash className="h-4 w-4 mr-2" />
              Food
            </Link>
          </div>
        </div>
      )}
      
      {expanded && (
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Popular Sounds
          </h3>
          <div className="space-y-2">
            <Link href="/sound/1" className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary">
              <Music className="h-4 w-4 mr-2" />
              Original Sound
            </Link>
            <Link href="/sound/2" className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary">
              <Music className="h-4 w-4 mr-2" />
              Trending Sound
            </Link>
          </div>
        </div>
      )}
      
      {expanded && !user && (
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Log in to follow creators, like videos, and view comments.
          </p>
          <Link
            href="/login"
            className="block w-full py-2 px-3 text-center rounded-md bg-primary text-white font-medium hover:bg-primary/90"
          >
            Log in
          </Link>
        </div>
      )}
      
      {expanded && (
        <div className="px-4 py-3 text-xs text-gray-500">
          <p>© 2023 TikTok Clone</p>
        </div>
      )}
    </aside>
  )
}
