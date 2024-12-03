"use client"

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

export default function SignupError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white shadow-md rounded-lg p-8">
        <div className="text-center">
          <AlertTriangle 
            className="mx-auto h-16 w-16 text-red-500 mb-4" 
            strokeWidth={1.5} 
          />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Signup Failed
          </h2>
          <p className="text-gray-600 mb-6">
            {error.message || "An unexpected error occurred during signup"}
          </p>
          
          <div className="space-y-4">
            <button
              onClick={reset}
              className="w-full bg-indigo-600 text-white py-2 px-4 
              rounded-md hover:bg-indigo-700 focus:outline-none 
              focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Try Again
            </button>
            
            <a 
              href="/login" 
              className="w-full inline-block text-center bg-gray-100 
              text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200"
            >
              Go to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}