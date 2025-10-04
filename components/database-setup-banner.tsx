"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Database, ExternalLink } from "lucide-react"
import Link from "next/link"

export function DatabaseSetupBanner() {
  return (
    <Alert className="border-amber-500 bg-amber-50 dark:bg-amber-950/20">
      <Database className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-900 dark:text-amber-100">Database Not Initialized</AlertTitle>
      <AlertDescription className="mt-2 space-y-3">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          Your Supabase database needs to be set up before you can use the app. Please run the SQL scripts to create the
          necessary tables.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant="default">
            <Link href="/setup">
              View Setup Instructions
              <ExternalLink className="ml-2 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
