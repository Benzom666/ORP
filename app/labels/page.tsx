"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { LabelPreview } from "@/components/labels/label-preview"
import { LabelSettings } from "@/components/labels/label-settings"
import { BulkLabelGenerator } from "@/components/labels/bulk-label-generator"
import { mockOrders } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

export default function LabelsPage() {
  const [labelSize, setLabelSize] = useState<"4x6" | "4x4" | "2x4">("4x6")
  const [includeBarcode, setIncludeBarcode] = useState(true)
  const [includePickup, setIncludePickup] = useState(false)
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const { toast } = useToast()

  // Filter orders that are ready for labels (Assigned or Pending)
  const eligibleOrders = mockOrders.filter((o) => o.status === "Assigned" || o.status === "Pending")

  const handleToggleOrder = (orderId: string) => {
    setSelectedOrders((prev) => (prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]))
  }

  const handleToggleAll = () => {
    if (selectedOrders.length === eligibleOrders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(eligibleOrders.map((o) => o.id))
    }
  }

  const handlePrint = () => {
    toast({
      title: "Printing labels",
      description: `Sending ${selectedOrders.length} labels to printer...`,
    })
    // In production, trigger print dialog or send to thermal printer
  }

  const handleDownload = () => {
    toast({
      title: "Downloading labels",
      description: `Generating PDF with ${selectedOrders.length} labels...`,
    })
    // In production, generate and download PDF
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Label Generator</h1>
              <p className="text-muted-foreground">Create and print shipping labels for your deliveries</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <BulkLabelGenerator
                  orders={eligibleOrders}
                  selectedOrders={selectedOrders}
                  onToggleOrder={handleToggleOrder}
                  onToggleAll={handleToggleAll}
                  onPrint={handlePrint}
                  onDownload={handleDownload}
                />

                {selectedOrders.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Label Preview</h2>
                    <div className="flex flex-wrap gap-4">
                      {eligibleOrders
                        .filter((o) => selectedOrders.includes(o.id))
                        .slice(0, 3)
                        .map((order) => (
                          <LabelPreview
                            key={order.id}
                            order={order}
                            labelSize={labelSize}
                            includeBarcode={includeBarcode}
                          />
                        ))}
                    </div>
                    {selectedOrders.length > 3 && (
                      <p className="text-sm text-muted-foreground">
                        + {selectedOrders.length - 3} more labels will be generated
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <LabelSettings
                  labelSize={labelSize}
                  onLabelSizeChange={setLabelSize}
                  includeBarcode={includeBarcode}
                  onIncludeBarcodeChange={setIncludeBarcode}
                  includePickup={includePickup}
                  onIncludePickupChange={setIncludePickup}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
