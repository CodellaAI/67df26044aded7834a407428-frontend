
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from './AuthProvider'
import { Home, Search, Plus, User, LogOut, Settings } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [showMobileNav, setShowMobileNav] = useState(false)
  
  // Hide mobile nav when path changes
  useEffect(() => {
    setShowMobileNav(false)
  }, [pathname])
  
  // Only show on non-auth pages
  if (pathname === '/login' || pathname === '/register') {
    return null
  }
  
  return (
    <>
      {/* Desktop Navbar */}
      <header className="fixed top-0 left-0 right-0 bg-white dark:bg-dark border-b border-gray-200 dark:border-gray-800 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  TikTok Clone
                </h1>
              </Link>
            </div>
            
            <div className="hidden md:block">
              <div className="relative rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-2 flex items-center max-w-xs">
                <Search className="h-5 w-5 text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-transparent border-none focus:outline-none text-sm w-full"
                />
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/"
                className={`p-2 rounded-full ${
                  pathname === '/' 
                    ? 'text-primary' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Home className="h-6 w-6" />
              </Link>
              
              <Link
                href="/upload"
                className={`p-2 rounded-full ${
                  pathname === '/upload' 
                    ? 'text-primary' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Plus className="h-6 w-6" />
              </Link>
              
              {user ? (
                <>
                  <Link
                    href={`/profile/${user.username}`}
                    className={`p-2 rounded-full ${
                      pathname.startsWith('/profile') && pathname.includes(user.username)
                        ? 'text-primary' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <User className="h-6 w-6" />
                  </Link>
                  
                  <Link
                    href="/settings"
                    className={`p-2 rounded-full ${
                      pathname === '/settings' 
                        ? 'text-primary' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Settings className="h-6 w-6" />
                  </Link>
                  
                  <button
                    onClick={logout}
                    className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <LogOut className="h-6 w-6" />
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="bg-primary text-white px-4 py-2 rounded-full font-medium hover:bg-primary/90 transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
            
            <div className="md:hidden">
              <button
                onClick={() => setShowMobileNav(!showMobileNav)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Navbar Dropdown */}
      {showMobileNav && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20" onClick={() => setShowMobileNav(false)}>
          <div className="absolute top-16 right-0 w-64 bg-white dark:bg-gray-900 shadow-lg p-4" onClick={e => e.stopPropagation()}>
            <div className="mb-4">
              <div className="relative rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-2 flex items-center">
                <Search className="h-5 w-5 text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Search"
                  className="bg-transparent border-none focus:outline-none text-sm w-full"
                />
              </div>
            </div>
            
            <nav className="space-y-2">
              <Link
                href="/"
                className={`flex items-center px-3 py-2 rounded-md ${
                  pathname === '/' 
                    ? 'bg-gray-100 dark:bg-gray-800 text-primary' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Home className="h-5 w-5 mr-3" />
                Home
              </Link>
              
              <Link
                href="/upload"
                className={`flex items-center px-3 py-2 rounded-md ${
                  pathname === '/upload' 
                    ? 'bg-gray-100 dark:bg-gray-800 text-primary' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Plus className="h-5 w-5 mr-3" />
                Upload
              </Link>
              
              {user ? (
                <>
                  <Link
                    href={`/profile/${user.username}`}
                    className={`flex items-center px-3 py-2 rounded-md ${
                      pathname.startsWith('/profile') && pathname.includes(user.username)
                        ? 'bg-gray-100 dark:bg-gray-800 text-primary' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <User className="h-5 w-5 mr-3" />
                    Profile
                  </Link>
                  
                  <Link
                    href="/settings"
                    className={`flex items-center px-3 py-2 rounded-md ${
                      pathname === '/settings' 
                        ? 'bg-gray-100 dark:bg-gray-800 text-primary' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Settings className="h-5 w-5 mr-3" />
                    Settings
                  </Link>
                  
                  <button
                    onClick={logout}
                    className="flex items-center px-3 py-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center px-3 py-2 rounded-md bg-primary text-white hover:bg-primary/90"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Login
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
      
      {/* Bottom Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-dark border-t border-gray-200 dark:border-gray-800 md:hidden z-10">
        <div className="flex justify-around items-center h-14">
          <Link
            href="/"
            className={`flex flex-col items-center justify-center ${
              pathname === '/' ? 'text-primary' : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          
          <Link
            href="/search"
            className={`flex flex-col items-center justify-center ${
              pathname === '/search' ? 'text-primary' : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <Search className="h-6 w-6" />
            <span className="text-xs mt-1">Discover</span>
          </Link>
          
          <Link
            href="/upload"
            className="flex flex-col items-center justify-center"
          >
            <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-md p-1">
              <Plus className="h-6 w-6" />
            </div>
          </Link>
          
          {user ? (
            <>
              <Link
                href={`/profile/${user.username}`}
                className={`flex flex-col items-center justify-center ${
                  pathname.startsWith('/profile') && pathname.includes(user.username)
                    ? 'text-primary' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <User className="h-6 w-6" />
                <span className="text-xs mt-1">Profile</span>
              </Link>
              
              <Link
                href="/settings"
                className={`flex flex-col items-center justify-center ${
                  pathname === '/settings' ? 'text-primary' : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <Settings className="h-6 w-6" />
                <span className="text-xs mt-1">Settings</span>
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="flex flex-col items-center justify-center text-gray-600 dark:text-gray-400"
            >
              <User className="h-6 w-6" />
              <span className="text-xs mt-1">Login</span>
            </Link>
          )}
        </div>
      </div>
      
      {/* Space for fixed elements */}
      <div className="h-16"></div> {/* For top navbar */}
      <div className="h-14 md:h-0"></div> {/* For bottom navbar on mobile */}
    </>
  )
}
