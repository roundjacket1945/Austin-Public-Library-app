import { NextResponse } from "next/server"
import { supabase } from "@/lib/database"

export async function GET() {
  try {
    const { data: branches, error } = await supabase
      .from("branches")
      .select(`
        id,
        name,
        code,
        address,
        city,
        state,
        zip_code,
        phone,
        email,
        latitude,
        longitude,
        hours_of_operation,
        services,
        amenities,
        manager_name,
        established_date
      `)
      .eq("is_active", true)
      .order("name")

    if (error) {
      console.error("Branches fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch branches" }, { status: 500 })
    }

    const transformedBranches =
      branches?.map((branch) => ({
        id: branch.code,
        name: branch.name,
        address: `${branch.address}, ${branch.city}, ${branch.state} ${branch.zip_code}`,
        phone: branch.phone || "Phone not available",
        hours: formatHours(branch.hours_of_operation),
        services: Array.isArray(branch.services) ? branch.services : [],
        distance: "0.5 miles", // This would need to be calculated based on user location
        isOpen: true, // This would need to be calculated based on current time and hours
        coordinates: {
          lat: branch.latitude ? Number.parseFloat(branch.latitude.toString()) : 0,
          lng: branch.longitude ? Number.parseFloat(branch.longitude.toString()) : 0,
        },
      })) || []

    return NextResponse.json({ branches: transformedBranches })
  } catch (error) {
    console.error("Branches API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function formatHours(hoursObj: any): string {
  if (!hoursObj || typeof hoursObj !== "object") return "Hours not available"

  try {
    // Convert hours object to readable format
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    const dayAbbr = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    let hoursStr = ""
    days.forEach((day, index) => {
      if (hoursObj[day]) {
        hoursStr += `${dayAbbr[index]}: ${hoursObj[day]}, `
      }
    })

    return hoursStr.slice(0, -2) || "Hours not available"
  } catch (error) {
    return "Hours not available"
  }
}
