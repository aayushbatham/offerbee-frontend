"use client"

import { useEffect, useState } from "react"
import Navbar from "./navbar"
import NavbarAuth from "./navbar-auth"

export default function NavHeader() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem("token")
    setIsAuthenticated(!!token)
  }, [])

  return isAuthenticated ? <NavbarAuth /> : <Navbar />
} 