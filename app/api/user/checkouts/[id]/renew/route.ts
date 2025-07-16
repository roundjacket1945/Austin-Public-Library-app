import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/database"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const checkoutId = params.id

    // Get current checkout
    const { data: checkout, error: fetchError } = await supabase
      .from("checkouts")
      .select("*")
      .eq("id", checkoutId)
      .single()

    if (fetchError || !checkout) {
      return NextResponse.json({ error: "Checkout not found" }, { status: 404 })
    }

    // Check if renewal is allowed
    if (checkout.renewal_count >= checkout.max_renewals) {
      return NextResponse.json({ error: "Maximum renewals reached" }, { status: 400 })
    }

    // Calculate new due date (2 weeks from current due date)
    const currentDueDate = new Date(checkout.due_date)
    const newDueDate = new Date(currentDueDate)
    newDueDate.setDate(newDueDate.getDate() + 14)

    // Update checkout
    const { data: updatedCheckout, error: updateError } = await supabase
      .from("checkouts")
      .update({
        due_date: newDueDate.toISOString(),
        renewal_count: checkout.renewal_count + 1,
      })
      .eq("id", checkoutId)
      .select()
      .single()

    if (updateError) {
      console.error("Renewal error:", updateError)
      return NextResponse.json({ error: "Failed to renew book" }, { status: 500 })
    }

    return NextResponse.json({
      checkout: updatedCheckout,
      message: "Book renewed successfully",
      newDueDate: newDueDate.toISOString(),
    })
  } catch (error) {
    console.error("Renewal API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
