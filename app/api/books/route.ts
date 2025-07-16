import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const genre = searchParams.get("genre") || "all"
    const format = searchParams.get("format") || "all"
    const sortBy = searchParams.get("sortBy") || "title"
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    // First, get books with basic filters
    let booksQuery = supabase
      .from("books")
      .select(`
        id,
        title,
        subtitle,
        isbn_13,
        isbn_10,
        publication_year,
        publisher_id,
        language,
        pages,
        description,
        cover_image_url,
        average_rating,
        rating_count,
        format_type,
        is_active
      `)
      .eq("is_active", true)

    // Apply search filter on title
    if (search) {
      booksQuery = booksQuery.ilike("title", `%${search}%`)
    }

    // Apply format filter
    if (format !== "all") {
      booksQuery = booksQuery.eq("format_type", format.toLowerCase())
    }

    // Apply sorting
    switch (sortBy) {
      case "rating":
        booksQuery = booksQuery.order("average_rating", { ascending: false })
        break
      case "year":
        booksQuery = booksQuery.order("publication_year", { ascending: false })
        break
      default:
        booksQuery = booksQuery.order("title")
    }

    // Apply pagination
    booksQuery = booksQuery.range(offset, offset + limit - 1)

    const { data: books, error: booksError } = await booksQuery

    if (booksError) {
      console.error("Books fetch error:", booksError)
      return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 })
    }

    if (!books || books.length === 0) {
      return NextResponse.json({ books: [] })
    }

    // Get book IDs for fetching authors and genres
    const bookIds = books.map((book) => book.id)

    // Fetch authors for these books
    const { data: bookAuthors } = await supabase
      .from("book_authors")
      .select(`
        book_id,
        authors(first_name, last_name)
      `)
      .in("book_id", bookIds)

    // Fetch genres for these books
    const { data: bookGenres } = await supabase
      .from("book_genres")
      .select(`
        book_id,
        genres(name)
      `)
      .in("book_id", bookIds)

    // Apply genre filter if needed
    let filteredBooks = books
    if (genre !== "all") {
      const booksWithGenre = bookGenres?.filter((bg) => bg.genres?.name === genre).map((bg) => bg.book_id) || []

      filteredBooks = books.filter((book) => booksWithGenre.includes(book.id))
    }

    // Transform data to match frontend expectations
    const transformedBooks = filteredBooks.map((book) => {
      // Find author for this book
      const authorData = bookAuthors?.find((ba) => ba.book_id === book.id)
      const author = authorData?.authors
        ? `${authorData.authors.first_name} ${authorData.authors.last_name}`
        : "Unknown Author"

      // Find genre for this book
      const genreData = bookGenres?.find((bg) => bg.book_id === book.id)
      const genre = genreData?.genres?.name || "Unknown"

      return {
        id: book.id.toString(),
        title: book.title,
        author,
        cover:
          book.cover_image_url ||
          `/placeholder.svg?height=300&width=200&text=${encodeURIComponent(book.title)}&bg=blue&color=white`,
        rating: book.average_rating || 0,
        genre,
        description: book.description || "",
        available: true, // This would need to be calculated based on copies and checkouts
        isDigital: book.format_type === "ebook" || book.format_type === "audiobook",
        isbn: book.isbn_13 || book.isbn_10 || "",
        publishYear: book.publication_year || 0,
        pages: book.pages || 0,
        language: book.language || "English",
        format: book.format_type === "ebook" ? "eBook" : book.format_type === "audiobook" ? "Audiobook" : "Physical",
        holds: 0, // Would need to be calculated
        copies: 1, // Would need to be calculated
        availableCopies: 1, // Would need to be calculated
      }
    })

    return NextResponse.json({ books: transformedBooks })
  } catch (error) {
    console.error("Books API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
