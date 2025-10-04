"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Sparkles } from "lucide-react"
import type { Order, Driver } from "@/lib/types"

interface OptimizeRoutesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pendingOrders: Order[]
  availableDrivers: Driver[]
  onOptimize: (config: OptimizationConfig) => void
}

export interface OptimizationConfig {
  maxStopsPerRoute: number
  optimizationGoal: "distance" | "time" | "balanced"
  assignDrivers: boolean
}

export function OptimizeRoutesDialog({
  open,
  onOpenChange,
  pendingOrders,
  availableDrivers,
  onOptimize,
}: OptimizeRoutesDialogProps) {
  const [optimizing, setOptimizing] = useState(false)
  const [config, setConfig] = useState<OptimizationConfig>({
    maxStopsPerRoute: 10,
    optimizationGoal: "balanced",
    assignDrivers: true,
  })

  const handleOptimize = async () => {
    setOptimizing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    onOptimize(config)
    setOptimizing(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Optimize Routes</DialogTitle>
          <DialogDescription>
            Configure route optimization settings for {pendingOrders.length} pending orders
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="maxStops">Max Stops Per Route</Label>
            <Input
              id="maxStops"
              type="number"
              min={1}
              max={50}
              value={config.maxStopsPerRoute}
              onChange={(e) => setConfig({ ...config, maxStopsPerRoute: Number.parseInt(e.target.value) })}
            />
            <p className="text-xs text-muted-foreground">Maximum number of delivery stops per route</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal">Optimization Goal</Label>
            <Select
              value={config.optimizationGoal}
              onValueChange={(value: any) => setConfig({ ...config, optimizationGoal: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">Minimize Distance</SelectItem>
                <SelectItem value="time">Minimize Time</SelectItem>
                <SelectItem value="balanced">Balanced (Recommended)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Auto-assign Drivers</p>
                <p className="text-xs text-muted-foreground">{availableDrivers.length} drivers available</p>
              </div>
              <Button
                variant={config.assignDrivers ? "default" : "outline"}
                size="sm"
                onClick={() => setConfig({ ...config, assignDrivers: !config.assignDrivers })}
              >
                {config.assignDrivers ? "Enabled" : "Disabled"}
              </Button>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm font-medium">Optimization Preview:</p>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
              <li>• Estimated routes: {Math.ceil(pendingOrders.length / config.maxStopsPerRoute)}</li>
              <li>
                • Orders per route: ~
                {Math.floor(pendingOrders.length / Math.ceil(pendingOrders.length / config.maxStopsPerRoute))}
              </li>
              <li>
                • Algorithm: {config.optimizationGoal === "balanced" ? "Multi-objective" : config.optimizationGoal}
              </li>
            </ul>
          </div>

          <Button onClick={handleOptimize} disabled={optimizing || pendingOrders.length === 0} className="w-full">
            {optimizing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Optimizing Routes...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Optimized Routes
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
