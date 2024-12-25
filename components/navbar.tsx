import Link from "next/link"
import { Button } from "@/components/ui/button" 
import { ModeToggle } from "@/components/theme-selector"

export default function Navbar() {
    return (
        <header className="border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-yellow-500">🐝</span>
            <h1 className="text-xl font-bold">OfferBee</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/client">
              <Button variant="ghost">Client</Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
            <ModeToggle />
          </nav>
        </div>
      </header>
    )
}

