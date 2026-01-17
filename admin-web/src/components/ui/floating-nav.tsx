import React, { useEffect, useState } from "react"
import { Home, Sparkles, Download, Sun, Moon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"

type NavKey = "home" | "waitlist" | "download"

type NavItem = {
  key: NavKey
  label: string
  icon: React.ReactNode
  href?: string
}

const items: NavItem[] = [
  { key: "home", label: "Home", icon: <Home className="h-4 w-4" />, href: "/" },
  {
    key: "waitlist",
    label: "Waitlist",
    icon: <Sparkles className="h-4 w-4" />,
    href: "#waitlist",
  },
  {
    key: "download",
    label: "Download",
    icon: <Download className="h-4 w-4" />,
  },
]

export function FloatingNav() {
  const [active, setActive] = useState<NavKey>("home")
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const [now, setNow] = useState<Date>(() => new Date())
  const navigate = useNavigate()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("theme")
      if (stored === "light" || stored === "dark") {
        setTheme(stored)
      }
      // if nothing stored, keep default "dark"
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return

    const root = document.documentElement

    root.setAttribute("data-theme", theme)
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }

    window.localStorage.setItem("theme", theme)
  }, [theme])

  useEffect(() => {
    if (typeof window === "undefined") return
    const id = window.setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => window.clearInterval(id)
  }, [])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }

  const handleClick = (item: NavItem) => {
    setActive(item.key)

    if (item.key === "download") {
      const link = document.createElement("a")
      link.href = "/app.apk"
      link.download = "BillBo-App.apk"
      document.body.appendChild(link)
      link.click()
      link.remove()
      return
    }

    if (item.href?.startsWith("#")) {
      if (typeof window !== "undefined") {
        const id = item.href.slice(1)
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }
      return
    }

    if (item.href) {
      navigate(item.href)
    }
  }

  return (
    <nav
      aria-label="Primary navigation"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 md:top-6 md:bottom-auto"
    >
      <div
        className={cn(
          "pointer-events-auto flex max-w-4xl flex-1 items-center justify-between gap-4 rounded-2xl px-3 py-2 shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl md:px-5 border",
          theme === "dark"
            ? "border-white/10 bg-neutral-900/70 text-neutral-100"
            : "border-black/5 bg-white/80 text-neutral-800",
        )}
        role="menubar"
      >
        <div className="relative flex flex-1 items-center justify-start gap-1 md:gap-2">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.button
                key={item.key}
                type="button"
                onClick={() => handleClick(item)}
                role="menuitem"
                aria-label={item.label}
                aria-pressed={active === item.key}
                className={cn(
                  "relative flex flex-1 items-center justify-center gap-1 rounded-xl px-3 py-2 text-xs font-medium outline-none transition-all duration-200 md:text-sm",
                  theme === "dark" ? "text-neutral-300" : "text-neutral-700",
                  active === item.key &&
                    (theme === "dark" ? "text-white" : "text-neutral-900"),
                )}
                whileTap={{ scale: 0.94 }}
                whileHover={{ scale: 1.04 }}
              >
                {active === item.key && (
                  <motion.span
                    layoutId="nav-active-bg"
                    className={cn(
                      "absolute inset-0 -z-10 rounded-xl shadow-[0_0_30px_rgba(15,23,42,0.25)]",
                      theme === "dark" ? "bg-white/10" : "bg-neutral-900/5",
                    )}
                    transition={{ type: "spring", stiffness: 260, damping: 24 }}
                  />
                )}
                {item.icon}
                <span className="hidden sm:inline">{item.label}</span>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
        <div className={cn("flex items-center gap-3 text-xs md:text-sm", theme === "dark" ? "text-neutral-200" : "text-neutral-600")}>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-200",
              theme === "dark"
                ? "text-white hover:bg-white/10"
                : "text-neutral-900 hover:bg-neutral-900/5",
            )}
          >
            {theme === "light" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
          <div
            aria-label="Current date and time"
            className="hidden sm:flex flex-col items-end leading-tight"
          >
            <span>
              {now.toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span className={cn("text-[0.65rem] md:text-xs", theme === "dark" ? "text-neutral-300/80" : "text-neutral-500")}>
              {now.toLocaleDateString(undefined, {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
    </nav>
  )
}
