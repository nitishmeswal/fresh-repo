import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

export default function SignupNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white shadow-md rounded-lg p-8 text-center">
        <AlertCircle 
          className="mx-auto h-16 w-16 text-yellow-500 mb-4" 
          strokeWidth={1.5} 
        />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          The signup page you are looking for does not exist.
        </p>
        
        <div className="space-y-4">
          <Link 
            href="/signup" 
            className="w-full inline-block bg-indigo-600 text-white py-2 px-4 
            rounded-md hover:bg-indigo-700 focus:outline-none 
            focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Go to Signup
          </Link>
          
          <Link 
            href="/login" 
            className="w-full inline-block bg-gray-100 text-gray-700 py-2 px-4
            rounded-md hover:bg-gray-200"
            >
            Go to Login
            </Link>
        </div>
        </div>
        </div>
        )
    }