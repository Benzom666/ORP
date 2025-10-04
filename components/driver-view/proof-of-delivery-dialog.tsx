"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Camera, Upload, CheckCircle2 } from "lucide-react"
import type { Order } from "@/lib/types"

interface ProofOfDeliveryDialogProps {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (orderId: string, proof: ProofOfDelivery) => void
}

export interface ProofOfDelivery {
  signature?: string
  photo?: string
  notes?: string
  timestamp: string
}

export function ProofOfDeliveryDialog({ order, open, onOpenChange, onSubmit }: ProofOfDeliveryDialogProps) {
  const [notes, setNotes] = useState("")
  const [photoUploaded, setPhotoUploaded] = useState(false)
  const [signatureCaptured, setSignatureCaptured] = useState(false)

  const handleSubmit = () => {
    if (!order) return

    const proof: ProofOfDelivery = {
      notes,
      timestamp: new Date().toISOString(),
      ...(photoUploaded && { photo: "photo-placeholder" }),
      ...(signatureCaptured && { signature: "signature-placeholder" }),
    }

    onSubmit(order.id, proof)
    onOpenChange(false)
    // Reset form
    setNotes("")
    setPhotoUploaded(false)
    setSignatureCaptured(false)
  }

  if (!order) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Proof of Delivery</DialogTitle>
          <DialogDescription>
            Complete delivery for {order.customer_name} - {order.id}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-lg border p-3">
            <p className="text-sm font-medium">{order.customer_name}</p>
            <p className="text-xs text-muted-foreground">{order.delivery_address}</p>
          </div>

          <div className="space-y-2">
            <Label>Capture Photo</Label>
            <div className="flex gap-2">
              <Button
                variant={photoUploaded ? "default" : "outline"}
                className="flex-1"
                onClick={() => setPhotoUploaded(true)}
              >
                <Camera className="mr-2 h-4 w-4" />
                {photoUploaded ? "Photo Captured" : "Take Photo"}
              </Button>
              <Button variant="outline" onClick={() => setPhotoUploaded(true)}>
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Customer Signature</Label>
            <div
              className={`flex h-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
                signatureCaptured ? "border-primary bg-primary/10" : "border-muted-foreground/25 hover:border-primary"
              }`}
              onClick={() => setSignatureCaptured(true)}
            >
              {signatureCaptured ? (
                <div className="text-center">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-primary" />
                  <p className="mt-2 text-sm font-medium">Signature Captured</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Tap to capture signature</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Delivery Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any delivery notes..."
              rows={3}
            />
          </div>

          <Button onClick={handleSubmit} className="w-full" disabled={!photoUploaded && !signatureCaptured}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Complete Delivery
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
