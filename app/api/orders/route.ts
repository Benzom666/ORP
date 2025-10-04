import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/init-database"

const initializationInProgress = false

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false })

    if (error) {
      if (error.message?.includes("Could not find the table") || error.code === "PGRST205") {
        console.log("[v0] Orders table not found, triggering automatic initialization...")

        const result = await initializeDatabase()

        if (result.success) {
          console.log("[v0] Database initialized successfully, retrying query...")

          const { data: retryData, error: retryError } = await supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false })

          if (retryError) throw retryError

          return NextResponse.json(retryData)
        } else {
          console.error("[v0] Database initialization failed:", result.error)
          return NextResponse.json({ error: "Database initialization failed" }, { status: 500 })
        }
      }

      throw error
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[v0] Error fetching orders:", error.message || error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { data, error } = await supabase.from("orders").insert([body]).select().single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
