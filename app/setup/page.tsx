"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, FileCode, Play } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SetupPage() {
  const router = useRouter()

  const scripts = [
    {
      name: "001_create_tables.sql",
      description: "Creates all database tables (drivers, orders, routes, stops, proofs)",
    },
    {
      name: "002_enable_rls.sql",
      description: "Enables Row Level Security and policies",
    },
    {
      name: "003_seed_data.sql",
      description: "Inserts sample data for testing",
    },
  ]

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Database className="h-8 w-8 text-primary" />
            <div>
              <CardTitle>Database Setup Required</CardTitle>
              <CardDescription>Run the SQL scripts to initialize your Supabase database</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950">
            <p className="text-sm text-amber-900 dark:text-amber-100">
              Your database tables haven't been created yet. Follow the steps below to set up your database.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Setup Instructions:</h3>
            <ol className="space-y-4">
              {scripts.map((script, index) => (
                <li key={script.name} className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {index + 1}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <FileCode className="h-4 w-4 text-muted-foreground" />
                      <code className="text-sm font-mono">{script.name}</code>
                    </div>
                    <p className="text-sm text-muted-foreground">{script.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Play className="h-3 w-3" />
                      <span>Click "Run" button in the left sidebar next to this script</span>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-lg border p-4">
            <h4 className="mb-2 text-sm font-semibold">How to run the scripts:</h4>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li>1. Look at the left sidebar in the v0 interface</li>
              <li>2. Find the "scripts" folder</li>
              <li>3. Click the "Run" button next to each script file in order</li>
              <li>4. Wait for each script to complete before running the next one</li>
              <li>5. Once all scripts are complete, click the button below</li>
            </ol>
          </div>

          <Button onClick={() => router.push("/")} className="w-full" size="lg">
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
