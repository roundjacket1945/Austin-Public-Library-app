import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/database"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, phone, address, passcode } = await request.json()

    // Check if email already exists
    const { data: existingUser } = await supabase.from("users").select("id").eq("email", email).single()

    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    // Generate library card number
    const cardNumber =
      "APL" +
      Math.floor(Math.random() * 1000000000)
        .toString()
        .padStart(9, "0")

    // Hash passcode
    const hashedPasscode = await bcrypt.hash(passcode, 12)

    // Create user
    const { data: newUser, error } = await supabase
      .from("users")
      .insert({
        email,
        password_hash: hashedPasscode,
        library_card_number: cardNumber,
        first_name: firstName,
        last_name: lastName,
        phone,
        address,
        is_active: true,
        notification_preferences: {
          email: true,
          sms: false,
          push: true,
          due_date_reminders: true,
          hold_notifications: true,
        },
        reading_preferences: {
          genres: [],
          formats: ["physical", "ebook", "audiobook"],
          preferred_authors: [],
        },
      })
      .select()
      .single()

    if (error) {
      console.error("Signup error:", error)
      return NextResponse.json({ error: "Failed to create account" }, { status: 500 })
    }

    // Return user data (excluding password)
    const { password_hash, ...userWithoutPassword } = newUser

    return NextResponse.json({
      user: userWithoutPassword,
      message: "Account created successfully",
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
