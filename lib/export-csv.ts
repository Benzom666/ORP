import type { Route } from "./types"

/**
 * Converts route data to CSV format
 */
export function exportRouteToCSV(route: Route): void {
  // Prepare CSV headers
  const headers = [
    "Stop Number",
    "Customer Name",
    "Delivery Address",
    "Phone",
    "Email",
    "Priority",
    "Status",
    "Latitude",
    "Longitude",
    "Notes",
  ]

  // Prepare CSV rows
  const rows = route.orders.map((order, index) => [
    (index + 1).toString(),
    order.customer_name,
    order.delivery_address,
    order.customer_phone || "",
    order.customer_email || "",
    order.priority,
    order.status,
    order.coordinates?.lat?.toString() || "",
    order.coordinates?.lng?.toString() || "",
    order.notes || "",
  ])

  // Add route summary at the top
  const summaryRows = [
    ["Route Summary"],
    ["Route Name", route.name],
    ["Total Stops", route.orders.length.toString()],
    ["Total Distance", route.total_distance ? `${route.total_distance} mi` : "N/A"],
    ["Estimated Duration", route.estimated_duration ? `${route.estimated_duration} min` : "N/A"],
    ["Status", route.status],
    ["Created At", new Date(route.created_at).toLocaleString()],
    [], // Empty row separator
    headers,
  ]

  // Combine all rows
  const allRows = [...summaryRows, ...rows]

  // Convert to CSV string
  const csvContent = allRows
    .map((row) =>
      row
        .map((cell) => {
          // Escape quotes and wrap in quotes if contains comma, quote, or newline
          const cellStr = String(cell)
          if (cellStr.includes(",") || cellStr.includes('"') || cellStr.includes("\n")) {
            return `"${cellStr.replace(/"/g, '""')}"`
          }
          return cellStr
        })
        .join(","),
    )
    .join("\n")

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", `${route.name.replace(/\s+/g, "_")}_${Date.now()}.csv`)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

/**
 * Exports multiple routes to a single CSV file
 */
export function exportMultipleRoutesToCSV(routes: Route[]): void {
  if (routes.length === 0) return

  const headers = [
    "Route Name",
    "Stop Number",
    "Customer Name",
    "Delivery Address",
    "Phone",
    "Email",
    "Priority",
    "Status",
    "Latitude",
    "Longitude",
    "Notes",
  ]

  const rows: string[][] = []

  routes.forEach((route) => {
    route.orders.forEach((order, index) => {
      rows.push([
        route.name,
        (index + 1).toString(),
        order.customer_name,
        order.delivery_address,
        order.customer_phone || "",
        order.customer_email || "",
        order.priority,
        order.status,
        order.coordinates?.lat?.toString() || "",
        order.coordinates?.lng?.toString() || "",
        order.notes || "",
      ])
    })
  })

  const allRows = [headers, ...rows]

  const csvContent = allRows
    .map((row) =>
      row
        .map((cell) => {
          const cellStr = String(cell)
          if (cellStr.includes(",") || cellStr.includes('"') || cellStr.includes("\n")) {
            return `"${cellStr.replace(/"/g, '""')}"`
          }
          return cellStr
        })
        .join(","),
    )
    .join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", `all_routes_${Date.now()}.csv`)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}
