"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Lock, User, Mail, ShieldCheck, Loader2 } from "lucide-react"
import Link from "next/link"
import { register } from "@/app/actions/auth"
import { useToast } from "@/components/ui/use-toast"

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    
    
    
    const result = await register(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      
      toast({
        title: "Account Created Successfully!",
        description: "Redirecting you to login page...",
        className: "bg-emerald-500 text-white border-emerald-600",
      })

      
      setTimeout(() => {
        router.push("/login")
      }, 1500)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background p-4 font-sans">
      <Card className="w-full max-w-md border-border/60 shadow-xl backdrop-blur-[2px]">
        <CardHeader className="space-y-3 text-center pb-8">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-3 rounded-2xl">
              <ShieldCheck className="h-10 w-10 text-primary" />
            </div>
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">Create Account</CardTitle>
            <CardDescription className="text-balance">
              Join Lycen and start managing your software licenses today
            </CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium rounded-lg text-center animate-in fade-in zoom-in-95">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Full Name
              </Label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="John Doe" 
                  className="pl-10 h-11 transition-all focus:ring-offset-1" 
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email Address
              </Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  className="pl-10 h-11 transition-all focus:ring-offset-1" 
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Password
              </Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-10 h-11 transition-all focus:ring-offset-1" 
                  required 
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-6 pt-2 pb-8">
            <Button 
              className="w-full h-11 text-sm font-semibold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]" 
              type="submit" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>

            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground font-medium">
                  Already a member?
                </span>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              <Link 
                href="/login" 
                className="text-primary hover:text-primary/80 hover:underline underline-offset-4 font-semibold transition-colors"
              >
                Sign in to your account
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}