"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription, CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import Navbar from "@/components/navbar";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      const data = await response.json()
      localStorage.setItem("token", data.access_token)
      router.push("/dashboard")
      toast.success("Logged in successfully")
    } catch (error) {
      toast.error("Invalid credentials")
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <>
        <div className="flex h-screen w-full items-center justify-center">
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      disabled={isLoading}
                  />
                </div>
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center items-center space-x-2">
              <h3 className="text-primary font-light text-sm">Don't have an account?</h3>
              <Link href="/signup" className="text-primary hover:underline font-medium text-sm">
                Sign up
              </Link>
            </CardFooter>
          </Card>
        </div>
      </>

  )
}