
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import AuthProvider from '@/components/AuthProvider'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TikTok Clone',
  description: 'A clone of the popular TikTok app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen bg-light dark:bg-dark text-dark dark:text-light">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Toaster position="bottom-center" />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
