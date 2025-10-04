"use client"

import useSWR from "swr"
import { useEffect, useRef } from "react"

const fetcher = async (url: string) => {
  const res = await fetch(url)

  if (!res.ok) {
    const error: any = new Error("An error occurred while fetching the data.")
    error.status = res.status

    try {
      const data = await res.json()
      error.info = data
      error.message = data.message || error.message
    } catch (e) {
      // Response is not JSON
    }

    throw error
  }

  return res.json()
}

export function useRoutes() {
  const initializingRef = useRef(false)
  const { data, error, isLoading, mutate } = useSWR("/api/routes", fetcher, {
    refreshInterval: 5000,
    shouldRetryOnError: (error) => {
      return error?.status !== 404
    },
  })

  const isDatabaseNotSetup =
    error?.status === 404 && (error?.info?.code === "PGRST205" || error?.message?.includes("Could not find the table"))

  useEffect(() => {
    if (isDatabaseNotSetup && !initializingRef.current) {
      initializingRef.current = true
      console.log("[v0] Detected missing tables, initializing database...")

      fetch("/api/init-database", { method: "POST" })
        .then((res) => res.json())
        .then((result) => {
          if (result.success) {
            console.log("[v0] Database initialized successfully, refreshing data...")
            setTimeout(() => {
              mutate()
              initializingRef.current = false
            }, 2000)
          } else {
            console.error("[v0] Database initialization failed:", result.error)
            initializingRef.current = false
          }
        })
        .catch((err) => {
          console.error("[v0] Database initialization error:", err)
          initializingRef.current = false
        })
    }
  }, [isDatabaseNotSetup, mutate])

  return {
    routes: data || [],
    isLoading: isLoading || (isDatabaseNotSetup && initializingRef.current),
    isError: error && !isDatabaseNotSetup,
    isDatabaseNotSetup: isDatabaseNotSetup && !initializingRef.current,
    mutate,
  }
}
