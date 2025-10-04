import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Insert proof of delivery
    const { data: proof, error: proofError } = await supabase
      .from("proofs")
      .insert([
        {
          stop_id: body.stop_id,
          photo_url: body.photo_url,
          signature_url: body.signature_url,
          notes: body.notes,
        },
      ])
      .select()
      .single()

    if (proofError) throw proofError

    // Update order status to delivered
    if (body.order_id) {
      const { error: orderError } = await supabase
        .from("orders")
        .update({ status: "delivered" })
        .eq("id", body.order_id)

      if (orderError) throw orderError
    }

    return NextResponse.json(proof)
  } catch (error) {
    console.error("[v0] Error creating proof:", error)
    return NextResponse.json({ error: "Failed to create proof" }, { status: 500 })
  }
}
