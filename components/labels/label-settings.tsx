"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface LabelSettingsProps {
  labelSize: "4x6" | "4x4" | "2x4"
  onLabelSizeChange: (size: "4x6" | "4x4" | "2x4") => void
  includeBarcode: boolean
  onIncludeBarcodeChange: (include: boolean) => void
  includePickup: boolean
  onIncludePickupChange: (include: boolean) => void
}

export function LabelSettings({
  labelSize,
  onLabelSizeChange,
  includeBarcode,
  onIncludeBarcodeChange,
  includePickup,
  onIncludePickupChange,
}: LabelSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Label Settings</CardTitle>
        <CardDescription>Customize your shipping labels</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="labelSize">Label Size</Label>
          <Select value={labelSize} onValueChange={(value: any) => onLabelSizeChange(value)}>
            <SelectTrigger id="labelSize">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4x6">4" × 6" (Standard)</SelectItem>
              <SelectItem value="4x4">4" × 4" (Square)</SelectItem>
              <SelectItem value="2x4">2" × 4" (Small)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="barcode">Include Barcode</Label>
            <p className="text-xs text-muted-foreground">Add scannable barcode to labels</p>
          </div>
          <Switch id="barcode" checked={includeBarcode} onCheckedChange={onIncludeBarcodeChange} />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="pickup">Include Pickup Address</Label>
            <p className="text-xs text-muted-foreground">Show pickup location on labels</p>
          </div>
          <Switch id="pickup" checked={includePickup} onCheckedChange={onIncludePickupChange} />
        </div>

        <div className="rounded-lg bg-muted p-3">
          <p className="text-sm font-medium">Printer Recommendations:</p>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            <li>• 4×6: Thermal label printers (Zebra, Rollo)</li>
            <li>• 4×4: Square label printers</li>
            <li>• 2×4: Standard office printers</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
