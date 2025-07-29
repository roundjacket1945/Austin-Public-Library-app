import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/database"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })

    const { loginMethod, cardNumber, email, passcode } = await request.json()

    let user = null

    if (loginMethod === "card") {
      // Login with library card
      const { data, error } = await supabase.from("users").select("*").eq("library_card_number", cardNumber).single()

      if (error || !data) {
        return NextResponse.json({ error: "Invalid library card number" }, { status: 401 })
      }

      user = data
    } else {
      // Login with email
      const { data, error } = await supabase.from("users").select("*").eq("email", email).single()

      if (error || !data) {
        return NextResponse.json({ error: "Invalid email address" }, { status: 401 })
      }

      user = data
    }

    // Verify passcode
    const isValidPasscode = await bcrypt.compare(passcode, user.password_hash)
    if (!isValidPasscode) {
      return NextResponse.json({ error: "Invalid passcode" }, { status: 401 })
    }

    // Update last login
    await supabase.from("users").update({ last_login: new Date().toISOString() }).eq("id", user.id)

    // Return user data (excluding password)
    const { password_hash, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
      message: "Login successful",
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}