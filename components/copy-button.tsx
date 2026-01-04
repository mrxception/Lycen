"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CopyButtonProps {
  value: string
  className?: string
}

export function CopyButton({ value, className }: CopyButtonProps) {
  const [hasCopied, setHasCopied] = useState(false)

  const onCopy = () => {
    navigator.clipboard.writeText(value)
    setHasCopied(true)
    setTimeout(() => setHasCopied(false), 2000)
  }

  return (
    <Button
      size="icon"
      variant="ghost"
      className={cn("h-6 w-6 text-muted-foreground hover:bg-background hover:text-foreground shrink-0", className)}
      onClick={onCopy}
    >
      {hasCopied ? (
        <Check className="h-3 w-3 text-emerald-500" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
      <span className="sr-only">Copy</span>
    </Button>
  )
}