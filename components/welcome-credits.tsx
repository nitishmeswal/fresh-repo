import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { useUser } from "@/lib/hooks/use-user"
import { Button } from "./ui/button"

export function WelcomeCreditsDialog() {
  const [open, setOpen] = useState(false)
  const { credits } = useUser()
  
  useEffect(() => {
    // Show dialog only for users with exactly 300 credits (new users)
    if (credits === 300) {
      setOpen(true)
    }
  }, [credits])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center text-center space-y-4 py-4">
          <div className="flex items-center space-x-2">
            <span role="img" aria-label="rocket" className="text-4xl">🚀</span>
            <h2 className="text-2xl font-bold">Welcome to Compute!</h2>
          </div>
          
          <div className="flex items-center">
            <span role="img" aria-label="gift" className="text-4xl">🎁</span>
            <h3 className="text-xl font-semibold text-blue-600 ml-2">
              FREE 300 BETA user credits
            </h3>
          </div>

          <p className="text-gray-600">
            Welcome to the BETA version of Neurolov Compute
            We are thrilled to have you onboard!! 
          </p>

          <Button 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
            onClick={() => setOpen(false)}
          >
            Start Using My Credits
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
