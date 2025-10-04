import { neon } from "@neondatabase/serverless"

let initializationInProgress = false
let initializationPromise: Promise<{ success: boolean; error?: string }> | null = null

const files = [
  "/mnt/data/optimo-route-pro/scripts/001_create_tables.sql",
  "/mnt/data/optimo-route-pro/scripts/002_enable_rls.sql",
  "/mnt/data/optimo-route-pro/scripts/003_seed_data.sql",
]

export async function initializeDatabase(): Promise<{ success: boolean; error?: string }> {
  if (initializationInProgress && initializationPromise) return initializationPromise

  initializationInProgress = true
  initializationPromise = (async () => {
    try {
      const databaseUrl = process.env.DATABASE_URL
      if (!databaseUrl) throw new Error("DATABASE_URL env var not set")

      const sql = neon(databaseUrl)

      for (const path of files) {
        const fs = await import("node:fs/promises")
        const content = await fs.readFile(path, "utf8")
        // Split on semicolons that end statements
        const statements = content
          .split(/;\s*(?=\n|$)/)
          .map((s) => s.trim())
          .filter(Boolean)

        for (const stmt of statements) {
          await sql(stmt)
        }
      }

      return { success: true }
    } catch (err: any) {
      console.error("[init-db] error:", err)
      return { success: false, error: err?.message || "Unknown error" }
    } finally {
      initializationInProgress = false
      initializationPromise = null
    }
  })()

  return initializationPromise
}