
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../components/AuthProvider'
import { 
  User, 
  Lock, 
  Bell, 
  Shield, 
  Moon, 
  Globe, 
  HelpCircle,
  ChevronRight,
  LogOut
} from 'lucide-react'

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(false)
  
  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      router.push('/login')
    }
    
    // Check system preference for dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true)
    }
  }, [user, router])
  
  if (!user) {
    return null // Don't render anything while redirecting
  }
  
  const handleLogout = () => {
    logout()
    router.push('/')
  }
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    // Implementation for changing theme would go here
  }
  
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-medium">Account</h2>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          <button 
            onClick={() => router.push(`/profile/${user.username}`)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-500 mr-3" />
              <span>Profile</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>
          
          <button 
            onClick={() => router.push('/settings/password')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <div className="flex items-center">
              <Lock className="h-5 w-5 text-gray-500 mr-3" />
              <span>Password</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-medium">Preferences</h2>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <Bell className="h-5 w-5 text-gray-500 mr-3" />
              <span>Notifications</span>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input 
                type="checkbox" 
                name="notifications" 
                id="notifications" 
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label 
                htmlFor="notifications" 
                className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
              ></label>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <Moon className="h-5 w-5 text-gray-500 mr-3" />
              <span>Dark Mode</span>
            </div>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input 
                type="checkbox" 
                name="darkMode" 
                id="darkMode" 
                checked={darkMode}
                onChange={toggleDarkMode}
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label 
                htmlFor="darkMode" 
                className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
              ></label>
            </div>
          </div>
          
          <button 
            onClick={() => router.push('/settings/language')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <div className="flex items-center">
              <Globe className="h-5 w-5 text-gray-500 mr-3" />
              <span>Language</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">English</span>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-medium">Privacy & Safety</h2>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          <button 
            onClick={() => router.push('/settings/privacy')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-gray-500 mr-3" />
              <span>Privacy</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-medium">Support</h2>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          <button 
            onClick={() => router.push('/help')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <div className="flex items-center">
              <HelpCircle className="h-5 w-5 text-gray-500 mr-3" />
              <span>Help Center</span>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>
      
      <button 
        onClick={handleLogout}
        className="w-full flex items-center justify-center p-4 mt-6 bg-red-500 hover:bg-red-600 text-white rounded-lg"
      >
        <LogOut className="h-5 w-5 mr-2" />
        <span>Log Out</span>
      </button>
      
      <style jsx>{`
        .toggle-checkbox:checked {
          right: 0;
          border-color: #68D391;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #68D391;
        }
        .toggle-checkbox {
          right: 0;
          z-index: 1;
          border-color: #D1D5DB;
          transition: all 0.3s;
        }
        .toggle-label {
          transition: all 0.3s;
        }
      `}</style>
    </div>
  )
}
