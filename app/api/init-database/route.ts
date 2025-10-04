import { NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/init-database"

export async function POST() {
  const result = await initializeDatabase()

  if (result.success) {
    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
    })
  } else {
    return NextResponse.json(
      {
        success: false,
        error: result.error,
      },
      { status: 500 },
    )
  }
}
