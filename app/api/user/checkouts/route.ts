import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    // Get checkouts for the user
    const { data: checkouts, error: checkoutsError } = await supabase
      .from("checkouts")
      .select(`
        id,
        book_id,
        checkout_date,
        due_date,
        renewal_count,
        max_renewals,
        is_digital
      `)
      .eq("user_id", userId)
      .is("return_date", null)
      .order("checkout_date", { ascending: false })

    if (checkoutsError) {
      console.error("Checkouts fetch error:", checkoutsError)
      return NextResponse.json({ error: "Failed to fetch checkouts" }, { status: 500 })
    }

    if (!checkouts || checkouts.length === 0) {
      return NextResponse.json({ checkouts: [] })
    }

    // Get book details for these checkouts
    const bookIds = checkouts.map((checkout) => checkout.book_id)

    const { data: books } = await supabase
      .from("books")
      .select(`
        id,
        title,
        cover_image_url
      `)
      .in("id", bookIds)

    // Get authors for these books
    const { data: bookAuthors } = await supabase
      .from("book_authors")
      .select(`
        book_id,
        authors(first_name, last_name)
      `)
      .in("book_id", bookIds)

    const transformedCheckouts = checkouts.map((checkout) => {
      const book = books?.find((b) => b.id === checkout.book_id)
      const authorData = bookAuthors?.find((ba) => ba.book_id === checkout.book_id)
      const author = authorData?.authors
        ? `${authorData.authors.first_name} ${authorData.authors.last_name}`
        : "Unknown Author"

      return {
        id: checkout.id.toString(),
        bookId: checkout.book_id.toString(),
        title: book?.title || "Unknown Title",
        author,
        cover: book?.cover_image_url || "/placeholder.svg",
        checkoutDate: checkout.checkout_date,
        dueDate: checkout.due_date,
        renewalCount: checkout.renewal_count,
        maxRenewals: checkout.max_renewals,
        isDigital: checkout.is_digital,
      }
    })

    return NextResponse.json({ checkouts: transformedCheckouts })
  } catch (error) {
    console.error("Checkouts API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, bookId, branchId } = await request.json()

    if (!userId || !bookId) {
      return NextResponse.json({ error: "User ID and Book ID required" }, { status: 400 })
    }

    // Calculate due date (2 weeks from now)
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 14)

    const { data: checkout, error } = await supabase
      .from("checkouts")
      .insert({
        user_id: userId,
        book_id: bookId,
        branch_id: branchId || 1,
        due_date: dueDate.toISOString(),
        checkout_method: "mobile_app",
      })
      .select()
      .single()

    if (error) {
      console.error("Checkout error:", error)
      return NextResponse.json({ error: "Failed to checkout book" }, { status: 500 })
    }

    return NextResponse.json({
      checkout,
      message: "Book checked out successfully",
    })
  } catch (error) {
    console.error("Checkout API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
