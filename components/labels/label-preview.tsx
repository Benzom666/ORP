"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { Order } from "@/lib/types"

interface LabelPreviewProps {
  order: Order
  labelSize: "4x6" | "4x4" | "2x4"
  includeBarcode: boolean
}

export function LabelPreview({ order, labelSize, includeBarcode }: LabelPreviewProps) {
  const sizeClasses = {
    "4x6": "aspect-[4/6] w-64",
    "4x4": "aspect-square w-64",
    "2x4": "aspect-[2/4] w-32",
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className={`${sizeClasses[labelSize]} border-2 border-dashed bg-white p-4 text-black`}>
          {/* Label Header */}
          <div className="border-b-2 border-black pb-2">
            <h3 className="text-lg font-bold">DELIVERY LABEL</h3>
            <p className="text-xs">{order.id}</p>
          </div>

          {/* Delivery Information */}
          <div className="mt-3 space-y-2">
            <div>
              <p className="text-xs font-semibold uppercase text-gray-600">Deliver To:</p>
              <p className="text-sm font-bold">{order.customer_name}</p>
              <p className="text-xs leading-tight">{order.delivery_address}</p>
            </div>

            {order.customer_phone && (
              <div>
                <p className="text-xs font-semibold uppercase text-gray-600">Phone:</p>
                <p className="text-xs">{order.customer_phone}</p>
              </div>
            )}

            {order.pickup_address && (
              <div>
                <p className="text-xs font-semibold uppercase text-gray-600">Pickup From:</p>
                <p className="text-xs leading-tight">{order.pickup_address}</p>
              </div>
            )}
          </div>

          {/* Priority Badge */}
          {order.priority && (
            <div className="mt-3">
              <div
                className={`inline-block rounded px-2 py-1 text-xs font-bold ${
                  order.priority === "High"
                    ? "bg-red-500 text-white"
                    : order.priority === "Medium"
                      ? "bg-yellow-500 text-black"
                      : "bg-gray-300 text-black"
                }`}
              >
                {order.priority} PRIORITY
              </div>
            </div>
          )}

          {/* Barcode */}
          {includeBarcode && (
            <div className="mt-3 border-t-2 border-black pt-2">
              <div className="flex h-12 items-center justify-center bg-white">
                <svg viewBox="0 0 200 50" className="h-full w-full">
                  {/* Simple barcode representation */}
                  {[...Array(20)].map((_, i) => (
                    <rect key={i} x={i * 10} y="0" width={Math.random() > 0.5 ? "4" : "2"} height="40" fill="black" />
                  ))}
                </svg>
              </div>
              <p className="mt-1 text-center text-xs font-mono">{order.id}</p>
            </div>
          )}

          {/* Notes */}
          {order.notes && labelSize !== "2x4" && (
            <div className="mt-2 border-t border-gray-300 pt-2">
              <p className="text-xs font-semibold uppercase text-gray-600">Notes:</p>
              <p className="text-xs leading-tight">{order.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
