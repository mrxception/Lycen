import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Key, Shield, Users, Code } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <Shield className="h-6 w-6 text-primary" />
          <span className="ml-2 text-xl font-bold">Lycen</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
            Login
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/register">
            Register
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Secure Your Software with Lycen
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
              The ultimate licensing solution for developers. Manage keys, team collaboration, and hardware binding in
              one place.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/register">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-xl shadow-sm">
                <Key className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold">Secure Keys</h3>
                <p className="text-muted-foreground mt-2">
                  Generate and manage unique secret keys for your applications.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-xl shadow-sm">
                <Users className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold">Team Access</h3>
                <p className="text-muted-foreground mt-2">Collaborate with up to 5 team members per application.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-xl shadow-sm">
                <Code className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold">Easy Integration</h3>
                <p className="text-muted-foreground mt-2">
                  Native support for Python, C#, and Node.js with clear guides.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
