import React from 'react'

const Divider = () => {
  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
    <div className="h-px flex-1 bg-border" />
    or
    <div className="h-px flex-1 bg-border" />
  </div>
  )
}

export default Divider

