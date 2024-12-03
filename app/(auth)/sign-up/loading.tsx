import { Loader2 } from "lucide-react"

export default function SignupLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 
          className="mx-auto h-12 w-12 animate-spin text-indigo-600" 
          strokeWidth={2} 
        />
        <p className="mt-4 text-xl text-gray-600">
          Preparing your account...
        </p>
      </div>
    </div>
  )
}