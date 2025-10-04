"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Upload, FileSpreadsheet, CheckCircle2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface UploadDialogProps {
  onUpload: (file: File) => void
}

export function UploadDialog({ onUpload }: UploadDialogProps) {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
    onUpload(file)
    setUploading(false)
    setOpen(false)
    setFile(null)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload CSV/XLSX
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Delivery Orders</DialogTitle>
          <DialogDescription>
            Upload a CSV or XLSX file containing delivery orders. Required columns: customer_name, delivery_address
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">Select File</Label>
            <Input id="file" type="file" accept=".csv,.xlsx,.xls" onChange={handleFileChange} />
          </div>

          {file && (
            <div className="flex items-center gap-2 rounded-lg border p-3">
              <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
          )}

          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm font-medium">Required Columns:</p>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              <li>• customer_name</li>
              <li>• delivery_address</li>
            </ul>
            <p className="mt-2 text-sm font-medium">Optional Columns:</p>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              <li>• customer_phone</li>
              <li>• customer_email</li>
              <li>• pickup_address</li>
              <li>• notes</li>
              <li>• priority (Low, Medium, High)</li>
            </ul>
          </div>

          <Button onClick={handleUpload} disabled={!file || uploading} className="w-full">
            {uploading ? "Uploading..." : "Upload Orders"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
