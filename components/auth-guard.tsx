"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

const protectedRoutes = new Set([
  "/home",
  "/send",
  "/bills",
  "/airtime",
  "/save",
  "/chat",
  "/education",
  "/agriculture",
  "/government",
])

export default function AuthGuard() {
  const pathname = usePathname() || "/"
  const router = useRouter()

  useEffect(() => {
    // Only run on client
    const isAuthed = typeof window !== "undefined" && localStorage.getItem("iyabola-authenticated") === "true"

    // If on a protected route and not authed, go to login
    if (!isAuthed && protectedRoutes.has(pathname)) {
      router.replace("/login")
      return
    }

    // If authed and on public entry pages, go to home
    if (isAuthed && (pathname === "/" || pathname === "/login")) {
      router.replace("/home")
    }
  }, [pathname, router])

  return null
}
