"use client"

import Link from "next/link"
import { Button } from "./ui/button"
import { ModeToggle } from "./theme-selector"
import { useRouter } from "next/navigation"

export default function NavbarAuth() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
    // Force a page reload to update the navbar state
    window.location.reload()
  }

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-yellow-500">🐝</span>
          <h1 className="text-xl font-bold">OfferBee</h1>
        </Link>
        <nav className="flex items-center gap-4">
            <Link href="/client">
              <Button variant="outline">Client</Button>
            </Link>
          <ModeToggle />
          <Button variant="ghost" onClick={handleLogout}>
            Logout
          </Button>
        </nav>
      </div>
    </header>
  )
} 