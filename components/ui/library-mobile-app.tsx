"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import {
  Search,
  Filter,
  Grid,
  List,
  Heart,
  Download,
  User,
  Home,
  BookOpen,
  Clock,
  Star,
  RefreshCw,
  WifiOff,
  MapPin,
  RotateCcw,
  Phone,
  Navigation,
  Building,
  LogIn,
  LogOut,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge as UIBadge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface Book {
  id: string
  title: string
  author: string
  cover: string
  rating: number
  genre: string
  description: string
  available: boolean
  progress?: number
  dueDate?: string
  isDigital: boolean
  isbn: string
  publishYear: number
  pages: number
  language: string
  format: "Physical" | "eBook" | "Audiobook"
  holds?: number
  copies?: number
  availableCopies?: number
}

interface LibraryUser {
  id: string
  name: string
  email: string
  avatar: string
  cardNumber: string
  booksCheckedOut: number
  holds: number
  fines: number
  isAuthenticated: boolean
}

interface Fine {
  id: string
  bookTitle: string
  amount: number
  dueDate: string
  type: "overdue" | "damage" | "lost"
  status: "pending" | "paid"
}

interface Branch {
  id: string
  name: string
  address: string
  phone: string
  hours: string
  services: string[]
  distance: string
  isOpen: boolean
  coordinates: { lat: number; lng: number }
}

interface ReadingGoal {
  id: string
  title: string
  target: number
  progress: number
  unit: "books" | "pages" | "minutes"
  deadline: string
  isCompleted: boolean
  createdDate: string
}

interface BadgeType {
  id: string
  name: string
  description: string
  icon: string
  earnedDate?: string
  isEarned: boolean
}

const LibraryMobileApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState("home")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isOffline, setIsOffline] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedGenre, setSelectedGenre] = useState("all")
  const [selectedFormat, setSelectedFormat] = useState("all")
  const [sortBy, setSortBy] = useState("title")
  const [refreshing, setRefreshing] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [bookSection, setBookSection] = useState<"all" | "physical" | "digital">("all")
  const [personalGoals, setPersonalGoals] = useState<ReadingGoal[]>([
    {
      id: "goal-1",
      title: "Monthly Reading Goal",
      target: 4,
      progress: 3,
      unit: "books",
      deadline: "2024-03-31",
      isCompleted: false,
      createdDate: "2024-03-01",
    },
    {
      id: "goal-2",
      title: "Daily Reading Time",
      target: 30,
      progress: 25,
      unit: "minutes",
      deadline: "2024-03-15",
      isCompleted: false,
      createdDate: "2024-03-01",
    },
  ])

  const [badges, setBadges] = useState<BadgeType[]>([
    {
      id: "first-book",
      name: "First Steps",
      description: "Checked out your first book",
      icon: "🎯",
      earnedDate: "2024-01-15",
      isEarned: true,
    },
    {
      id: "week-streak",
      name: "Week Warrior",
      description: "Read for 7 consecutive days",
      icon: "🔥",
      earnedDate: "2024-02-01",
      isEarned: true,
    },
    {
      id: "genre-explorer",
      name: "Genre Explorer",
      description: "Read books from 5 different genres",
      icon: "🗺️",
      isEarned: false,
    },
    {
      id: "speed-reader",
      name: "Speed Reader",
      description: "Read 1000 pages in a week",
      icon: "⚡",
      isEarned: false,
    },
  ])

  const [showNewGoal, setShowNewGoal] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: "",
    target: "",
    unit: "books" as "books" | "pages" | "minutes",
    deadline: "",
  })

  const [user, setUser] = useState<LibraryUser>({
    id: "1",
    name: "Your Name",
    email: "your.email@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    cardNumber: "1234567890",
    booksCheckedOut: 5,
    holds: 3,
    fines: 2.5,
    isAuthenticated: false,
  })

  // Add these state variables after the existing useState declarations
  const [apiBooks, setApiBooks] = useState<Book[]>([])
  const [apiUser, setApiUser] = useState<LibraryUser | null>(null)
  const [apiBranches, setApiBranches] = useState<Branch[]>([])
  const [apiCheckouts, setApiCheckouts] = useState<any[]>([])
  const [useApi, setUseApi] = useState(true) // Toggle between API and mock data

  // API Functions
  const fetchBooks = useCallback(
    async (searchParams: any = {}) => {
      if (!useApi) return

      setIsLoading(true)
      try {
        const params = new URLSearchParams({
          search: searchParams.search || searchQuery,
          genre: searchParams.genre || selectedGenre,
          format: searchParams.format || selectedFormat,
          sortBy: searchParams.sortBy || sortBy,
          limit: "50",
          offset: "0",
        })

        const response = await fetch(`/api/books?${params}`)
        const data = await response.json()

        if (response.ok) {
          setApiBooks(data.books)
        } else {
          console.error("Failed to fetch books:", data.error)
          // Fall back to mock data
          setUseApi(false)
        }
      } catch (error) {
        console.error("API error:", error)
        setUseApi(false)
      } finally {
        setIsLoading(false)
      }
    },
    [searchQuery, selectedGenre, selectedFormat, sortBy, useApi],
  )

  const fetchBranches = useCallback(async () => {
    if (!useApi) return

    try {
      const response = await fetch("/api/branches")
      const data = await response.json()

      if (response.ok) {
        setApiBranches(data.branches)
      }
    } catch (error) {
      console.error("Branches API error:", error)
    }
  }, [useApi])

  const fetchUserCheckouts = useCallback(
    async (userId: string) => {
      if (!useApi || !userId) return

      try {
        const response = await fetch(`/api/user/checkouts?userId=${userId}`)
        const data = await response.json()

        if (response.ok) {
          setApiCheckouts(data.checkouts)
        }
      } catch (error) {
        console.error("Checkouts API error:", error)
      }
    },
    [useApi],
  )

  const apiLogin = async (loginData: any) => {
    if (!useApi) return false

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      })

      const data = await response.json()

      if (response.ok) {
        setApiUser({
          id: data.user.id.toString(),
          name: `${data.user.first_name} ${data.user.last_name}`,
          email: data.user.email,
          avatar: data.user.profile_image_url || "/placeholder.svg?height=40&width=40",
          cardNumber: data.user.library_card_number,
          booksCheckedOut: 0, // Will be updated by fetchUserCheckouts
          holds: 0,
          fines: 0,
          isAuthenticated: true,
        })

        // Fetch user's checkouts
        fetchUserCheckouts(data.user.id.toString())

        return true
      } else {
        alert(data.error || "Login failed")
        return false
      }
    } catch (error) {
      console.error("Login API error:", error)
      return false
    }
  }

  const apiSignup = async (signupData: any) => {
    if (!useApi) return false

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      })

      const data = await response.json()

      if (response.ok) {
        setApiUser({
          id: data.user.id.toString(),
          name: `${data.user.first_name} ${data.user.last_name}`,
          email: data.user.email,
          avatar: data.user.profile_image_url || "/placeholder.svg?height=40&width=40",
          cardNumber: data.user.library_card_number,
          booksCheckedOut: 0,
          holds: 0,
          fines: 0,
          isAuthenticated: true,
        })

        return true
      } else {
        alert(data.error || "Signup failed")
        return false
      }
    } catch (error) {
      console.error("Signup API error:", error)
      return false
    }
  }

  const apiRenewBook = async (checkoutId: string) => {
    if (!useApi) return false

    try {
      const response = await fetch(`/api/user/checkouts/${checkoutId}/renew`, {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        // Refresh checkouts
        if (apiUser) {
          fetchUserCheckouts(apiUser.id)
        }
        alert(`Book renewed successfully. New due date: ${new Date(data.newDueDate).toLocaleDateString()}`)
        return true
      } else {
        alert(data.error || "Renewal failed")
        return false
      }
    } catch (error) {
      console.error("Renewal API error:", error)
      return false
    }
  }

  // Add these useEffect hooks after the API functions
  useEffect(() => {
    if (useApi) {
      fetchBooks()
      fetchBranches()
    }
  }, [fetchBooks, fetchBranches])

  useEffect(() => {
    if (useApi) {
      fetchBooks()
    }
  }, [searchQuery, selectedGenre, selectedFormat, sortBy, fetchBooks])

  const fines: Fine[] = [
    {
      id: "1",
      bookTitle: "The Midnight Library",
      amount: 1.5,
      dueDate: "2024-01-15",
      type: "overdue",
      status: "pending",
    },
    {
      id: "2",
      bookTitle: "Atomic Habits",
      amount: 1.0,
      dueDate: "2024-01-20",
      type: "overdue",
      status: "pending",
    },
  ]

  const branches: Branch[] = [
    {
      id: "central",
      name: "Central Library",
      address: "710 W César Chávez St, Austin, TX 78701",
      phone: "512-974-7400",
      hours: "Mon-Thu: 10 AM - 9 PM, Fri-Sat: 10 AM - 6 PM, Sun: 12 PM - 6 PM",
      services: [
        "Books",
        "Computers",
        "Free WiFi",
        "Printing",
        "Study Rooms",
        "Events",
        "Teen Area",
        "Children's Area",
      ],
      distance: "0.5 miles",
      isOpen: true,
      coordinates: { lat: 30.2672, lng: -97.7431 },
    },
    {
      id: "faulk",
      name: "Faulk Central Library",
      address: "800 Guadalupe St, Austin, TX 78701",
      phone: "512-974-7400",
      hours: "Mon-Thu: 10 AM - 9 PM, Fri-Sat: 10 AM - 6 PM, Sun: 12 PM - 6 PM",
      services: [
        "Books",
        "Computers",
        "Free WiFi",
        "Printing",
        "Study Rooms",
        "Events",
        "Teen Area",
        "Children's Area",
      ],
      distance: "0.7 miles",
      isOpen: true,
      coordinates: { lat: 30.2682, lng: -97.7451 },
    },
    {
      id: "twinOaks",
      name: "Twin Oaks Branch",
      address: "1800 S Fifth St, Austin, TX 78704",
      phone: "512-974-7000",
      hours: "Mon-Thu: 10 AM - 9 PM, Fri-Sat: 10 AM - 6 PM, Sun: Closed",
      services: ["Books", "Computers", "Free WiFi", "Printing", "Children's Area"],
      distance: "1.2 miles",
      isOpen: true,
      coordinates: { lat: 30.2522, lng: -97.7541 },
    },
    {
      id: "yakov",
      name: "Yakov Branch",
      address: "7901 Greenslope Dr, Austin, TX 78759",
      phone: "512-974-7580",
      hours: "Mon-Thu: 10 AM - 9 PM, Fri-Sat: 10 AM - 6 PM, Sun: Closed",
      services: ["Books", "Computers", "Free WiFi", "Printing", "Study Rooms", "Children's Area"],
      distance: "14.3 miles",
      isOpen: true,
      coordinates: { lat: 30.4012, lng: -97.7541 },
    },
    {
      id: "hampton",
      name: "Hampton Branch at Oak Hill",
      address: "515 N Hampton Rd, Austin, TX 78735",
      phone: "512-974-9900",
      hours: "Mon-Thu: 10 AM - 9 PM, Fri-Sat: 10 AM - 6 PM, Sun: Closed",
      services: ["Books", "Computers", "Free WiFi", "Printing", "Study Rooms", "Children's Area"],
      distance: "12.3 miles",
      isOpen: true,
      coordinates: { lat: 30.2312, lng: -97.8941 },
    },
    {
      id: "williamsonCreek",
      name: "Williamson Creek Branch",
      address: "1314 W William Cannon Dr, Austin, TX 78745",
      phone: "512-974-1700",
      hours: "Mon-Thu: 10 AM - 9 PM, Fri-Sat: 10 AM - 6 PM, Sun: Closed",
      services: ["Books", "Computers", "Free WiFi", "Printing", "Study Rooms", "Children's Area"],
      distance: "8.3 miles",
      isOpen: true,
      coordinates: { lat: 30.2012, lng: -97.7541 },
    },
    {
      id: "manchaca",
      name: "Manchaca Road Branch",
      address: "5500 Manchaca Rd, Austin, TX 78745",
      phone: "512-974-8700",
      hours: "Mon-Thu: 10 AM - 9 PM, Fri-Sat: 10 AM - 6 PM, Sun: Closed",
      services: ["Books", "Computers", "Free WiFi", "Printing", "Study Rooms", "Children's Area"],
      distance: "6.3 miles",
      isOpen: true,
      coordinates: { lat: 30.2112, lng: -97.7741 },
    },
    {
      id: "pleasantHill",
      name: "Pleasant Hill Branch",
      address: "211 E William Cannon Dr, Austin, TX 78745",
      phone: "512-974-7800",
      hours: "Mon-Thu: 10 AM - 9 PM, Fri-Sat: 10 AM - 6 PM, Sun: Closed",
      services: ["Books", "Computers", "Free WiFi", "Printing", "Study Rooms", "Children's Area"],
      distance: "7.3 miles",
      isOpen: true,
      coordinates: { lat: 30.2212, lng: -97.7941 },
    },
    {
      id: "southAustin",
      name: "South Austin Popular Library",
      address: "2030 Oltorf St, Austin, TX 78704",
      phone: "512-974-0000",
      hours: "Mon-Thu: 10 AM - 9 PM, Fri-Sat: 10 AM - 6 PM, Sun: Closed",
      services: ["Books", "Computers", "Free WiFi", "Printing", "Study Rooms", "Children's Area"],
      distance: "3.3 miles",
      isOpen: true,
      coordinates: { lat: 30.2312, lng: -97.8141 },
    },
    {
      id: "terrazas",
      name: "Terrazas Branch",
      address: "1105 E 1st St, Austin, TX 78702",
      phone: "512-974-3625",
      hours: "Mon-Thu: 10 AM - 9 PM, Fri-Sat: 10 AM - 6 PM, Sun: Closed",
      services: ["Books", "Computers", "Free WiFi", "Printing", "Study Rooms", "Children's Area"],
      distance: "2.3 miles",
      isOpen: true,
      coordinates: { lat: 30.2412, lng: -97.8341 },
    },
    {
      id: "universityHills",
      name: "University Hills Branch",
      address: "4425 E. Lamar Blvd, Austin, TX 78722",
      phone: "512-974-9940",
      hours: "Mon-Thu: 10 AM - 9 PM, Fri-Sat: 10 AM - 6 PM, Sun: Closed",
      services: ["Books", "Computers", "Free WiFi", "Printing", "Study Rooms", "Children's Area"],
      distance: "9.3 miles",
      isOpen: true,
      coordinates: { lat: 30.2512, lng: -97.8541 },
    },
    {
      id: "littleWalnutCreek",
      name: "Little Walnut Creek Branch",
      address: "835 W Rundberg Ln, Austin, TX 78758",
      phone: "512-974-7500",
      hours: "Mon-Thu: 10 AM - 9 PM, Fri-Sat: 10 AM - 6 PM, Sun: Closed",
      services: ["Books", "Computers", "Free WiFi", "Printing", "Study Rooms", "Children's Area"],
      distance: "11.3 miles",
      isOpen: true,
      coordinates: { lat: 30.2612, lng: -97.8741 },
    },
    {
      id: "northAustin",
      name: "North Austin Branch",
      address: "12319 N Lamar Blvd, Austin, TX 78753",
      phone: "512-974-7600",
      hours: "Mon-Thu: 10 AM - 9 PM, Fri-Sat: 10 AM - 6 PM, Sun: Closed",
      services: ["Books", "Computers", "Free WiFi", "Printing", "Study Rooms", "Children's Area"],
      distance: "13.3 miles",
      isOpen: true,
      coordinates: { lat: 30.2712, lng: -97.8941 },
    },
    {
      id: "spicewoodSprings",
      name: "Spicewood Springs Branch",
      address: "8637 Spicewood Springs Rd, Austin, TX 78759",
      phone: "512-974-7100",
      hours: "Mon-Thu: 10 AM - 9 PM, Fri-Sat: 10 AM - 6 PM, Sun: Closed",
      services: ["Books", "Computers", "Free WiFi", "Printing", "Study Rooms", "Children's Area"],
      distance: "15.3 miles",
      isOpen: true,
      coordinates: { lat: 30.2812, lng: -97.9141 },
    },
    {
      id: "parmerLane",
      name: "Parmer Lane Branch",
      address: "1121 Parmer Ln, Austin, TX 78753",
      phone: "512-974-7480",
      hours: "Mon-Thu: 10 AM - 9 PM, Fri-Sat: 10 AM - 6 PM, Sun: Closed",
      services: ["Books", "Computers", "Free WiFi", "Printing", "Study Rooms", "Children's Area"],
      distance: "17.3 miles",
      isOpen: true,
      coordinates: { lat: 30.2912, lng: -97.9341 },
    },
    {
      id: "milwood",
      name: "Milwood Branch",
      address: "12500 Amherst Dr, Austin, TX 78727",
      phone: "512-974-7200",
      hours: "Mon-Thu: 10 AM - 9 PM, Fri-Sat: 10 AM - 6 PM, Sun: Closed",
      services: ["Books", "Computers", "Free WiFi", "Printing", "Study Rooms", "Children's Area"],
      distance: "19.3 miles",
      isOpen: true,
      coordinates: { lat: 30.3012, lng: -97.9541 },
    },
    {
      id: "toolan",
      name: "Toolan Park Branch",
      address: "5001 Toolan Circle, Austin, TX 78723",
      phone: "512-974-7544",
      hours: "Mon-Thu: 10 AM - 9 PM, Fri-Sat: 10 AM - 6 PM, Sun: Closed",
      services: ["Books", "Computers", "Free WiFi", "Printing", "Study Rooms", "Children's Area"],
      distance: "21.3 miles",
      isOpen: true,
      coordinates: { lat: 30.3112, lng: -97.9741 },
    },
    {
      id: "willieMaeKirk",
      name: "Willie Mae Kirk Branch",
      address: "3101 Oak Springs Dr, Austin, TX 78702",
      phone: "512-974-9966",
      hours: "Mon-Thu: 10 AM - 9 PM, Fri-Sat: 10 AM - 6 PM, Sun: Closed",
      services: ["Books", "Computers", "Free WiFi", "Printing", "Study Rooms", "Children's Area"],
      distance: "23.3 miles",
      isOpen: true,
      coordinates: { lat: 30.3212, lng: -97.9941 },
    },
    {
      id: "carver",
      name: "Carver Branch",
      address: "1161 Angelina St, Austin, TX 78702",
      phone: "512-974-1010",
      hours: "Mon-Thu: 10 AM - 9 PM, Fri-Sat: 10 AM - 6 PM, Sun: Closed",
      services: ["Books", "Computers", "Free WiFi", "Printing", "Study Rooms", "Children's Area"],
      distance: "25.3 miles",
      isOpen: true,
      coordinates: { lat: 30.3312, lng: -97.9141 },
    },
    {
      id: "montopolis",
      name: "Montopolis Branch",
      address: "1200 Montopolis Dr, Austin, TX 78741",
      phone: "512-974-7565",
      hours: "Mon-Thu: 10 AM - 9 PM, Fri-Sat: 10 AM - 6 PM, Sun: Closed",
      services: ["Books", "Computers", "Free WiFi", "Printing", "Study Rooms", "Children's Area"],
      distance: "27.3 miles",
      isOpen: true,
      coordinates: { lat: 30.3412, lng: -97.9341 },
    },
  ]

  const getRandomColor = () => {
    const colors = [
      "blue",
      "red",
      "green",
      "purple",
      "orange",
      "teal",
      "pink",
      "indigo",
      "cyan",
      "emerald",
      "rose",
      "amber",
      "lime",
      "violet",
      "sky",
      "slate",
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const getGenreColor = (genre: string) => {
    const genreColors: { [key: string]: string } = {
      Fiction: "blue",
      "Non-Fiction": "green",
      Mystery: "purple",
      Romance: "pink",
      "Science Fiction": "cyan",
      Fantasy: "violet",
      Biography: "orange",
      History: "amber",
      "Self-Help": "emerald",
      "Children's": "yellow",
      "Young Adult": "rose",
      Horror: "red",
      Thriller: "slate",
      Comedy: "lime",
      Drama: "indigo",
      Poetry: "teal",
      Art: "pink",
      Science: "sky",
      Technology: "slate",
      Business: "emerald",
      Health: "green",
      Travel: "blue",
      Cooking: "orange",
      Sports: "red",
      Music: "purple",
    }
    return genreColors[genre] || "gray"
  }

  // Generate comprehensive book collection including Wimpy Kid series
  const generateBooks = (): Book[] => {
    const wimpyKidBooks = [
      "Diary of a Wimpy Kid",
      "Diary of a Wimpy Kid: Rodrick Rules",
      "Diary of a Wimpy Kid: The Last Straw",
      "Diary of a Wimpy Kid: Dog Days",
      "Diary of a Wimpy Kid: The Ugly Truth",
      "Diary of a Wimpy Kid: Cabin Fever",
      "Diary of a Wimpy Kid: The Third Wheel",
      "Diary of a Wimpy Kid: Hard Luck",
      "Diary of a Wimpy Kid: The Long Haul",
      "Diary of a Wimpy Kid: Old School",
      "Diary of a Wimpy Kid: Double Down",
      "Diary of a Wimpy Kid: The Getaway",
      "Diary of a Wimpy Kid: The Meltdown",
      "Diary of a Wimpy Kid: Wrecking Ball",
      "Diary of a Wimpy Kid: The Deep End",
      "Diary of a Wimpy Kid: Big Shot",
      "Diary of a Wimpy Kid: Diper Överlöde",
      "Diary of a Wimpy Kid: No Brainer",
    ]

    const genres = [
      "Fiction",
      "Non-Fiction",
      "Mystery",
      "Romance",
      "Science Fiction",
      "Fantasy",
      "Biography",
      "History",
      "Self-Help",
      "Children's",
      "Young Adult",
      "Horror",
      "Thriller",
      "Comedy",
      "Drama",
      "Poetry",
      "Art",
      "Science",
      "Technology",
      "Business",
      "Health",
      "Travel",
      "Cooking",
      "Sports",
      "Music",
    ]

    const authors = [
      "Stephen King",
      "J.K. Rowling",
      "Agatha Christie",
      "George Orwell",
      "Jane Austen",
      "Mark Twain",
      "Ernest Hemingway",
      "Maya Angelou",
      "Toni Morrison",
      "Harper Lee",
      "F. Scott Fitzgerald",
      "John Steinbeck",
      "William Shakespeare",
      "Charles Dickens",
      "Virginia Woolf",
      "James Joyce",
      "Gabriel García Márquez",
      "Chinua Achebe",
      "Margaret Atwood",
      "Salman Rushdie",
      "Haruki Murakami",
      "Isabel Allende",
      "Octavia Butler",
      "Ray Bradbury",
      "Isaac Asimov",
      "Ursula K. Le Guin",
    ]

    const bookTitles = [
      "The Great Gatsby",
      "To Kill a Mockingbird",
      "1984",
      "Pride and Prejudice",
      "The Catcher in the Rye",
      "Lord of the Flies",
      "The Hobbit",
      "Fahrenheit 451",
      "Jane Eyre",
      "Wuthering Heights",
      "The Picture of Dorian Gray",
      "Dracula",
      "Frankenstein",
      "The Adventures of Huckleberry Finn",
      "The Odyssey",
      "The Iliad",
      "Don Quixote",
      "War and Peace",
      "Crime and Punishment",
      "The Brothers Karamazov",
      "Anna Karenina",
      "Madame Bovary",
      "Les Misérables",
      "The Count of Monte Cristo",
      "Moby Dick",
      "The Scarlet Letter",
      "Uncle Tom's Cabin",
      "Gone with the Wind",
      "The Grapes of Wrath",
      "Of Mice and Men",
      "East of Eden",
    ]

    const books: Book[] = []

    // Add Wimpy Kid series
    wimpyKidBooks.forEach((title, index) => {
      books.push({
        id: `wimpy-${index + 1}`,
        title,
        author: "Jeff Kinney",
        cover: `/placeholder.svg?height=300&width=200&text=${encodeURIComponent(title.replace("Diary of a Wimpy Kid", "Wimpy Kid"))}&bg=yellow&color=black`,
        rating: 4.2 + Math.random() * 0.6,
        genre: "Children's",
        description: `Join Greg Heffley in his hilarious adventures in this beloved series that has captured the hearts of millions of young readers worldwide.`,
        available: Math.random() > 0.3,
        isDigital: Math.random() > 0.5,
        isbn: `978-0-${Math.floor(Math.random() * 900000) + 100000}-${Math.floor(Math.random() * 90) + 10}-${Math.floor(Math.random() * 9) + 1}`,
        publishYear: 2007 + index,
        pages: 217 + Math.floor(Math.random() * 50),
        language: "English",
        format: Math.random() > 0.7 ? "Audiobook" : Math.random() > 0.5 ? "eBook" : "Physical",
        holds: Math.floor(Math.random() * 10),
        copies: Math.floor(Math.random() * 5) + 1,
        availableCopies: Math.floor(Math.random() * 3),
        progress: Math.random() > 0.7 ? Math.floor(Math.random() * 100) : undefined,
        dueDate: Math.random() > 0.8 ? "2024-03-15" : undefined,
      })
    })

    // Generate additional books
    for (let i = 0; i < 982; i++) {
      const title = bookTitles[Math.floor(Math.random() * bookTitles.length)]
      const author = authors[Math.floor(Math.random() * authors.length)]
      const genre = genres[Math.floor(Math.random() * genres.length)]

      books.push({
        id: `book-${i + 1}`,
        title: `${title} ${i > 30 ? `(${Math.floor(Math.random() * 5) + 1})` : ""}`,
        author,
        cover: `/placeholder.svg?height=300&width=200&text=${encodeURIComponent(title)}&bg=${getRandomColor()}&color=white`,
        rating: 3.0 + Math.random() * 2,
        genre,
        description: `A captivating ${genre.toLowerCase()} that explores themes of human nature, society, and the complexities of life through masterful storytelling.`,
        available: Math.random() > 0.2,
        isDigital: Math.random() > 0.4,
        isbn: `978-${Math.floor(Math.random() * 9) + 1}-${Math.floor(Math.random() * 900000) + 100000}-${Math.floor(Math.random() * 90) + 10}-${Math.floor(Math.random() * 9) + 1}`,
        publishYear: 1950 + Math.floor(Math.random() * 74),
        pages: 150 + Math.floor(Math.random() * 500),
        language: "English",
        format: Math.random() > 0.6 ? "Audiobook" : Math.random() > 0.4 ? "eBook" : "Physical",
        holds: Math.floor(Math.random() * 15),
        copies: Math.floor(Math.random() * 8) + 1,
        availableCopies: Math.floor(Math.random() * 5),
        progress: Math.random() > 0.8 ? Math.floor(Math.random() * 100) : undefined,
        dueDate: Math.random() > 0.9 ? "2024-03-15" : undefined,
      })
    }

    return books
  }

  const [books, setBooks] = useState<Book[]>(generateBooks())

  // Update the data source logic
  const currentBooks = useApi && apiBooks.length > 0 ? apiBooks : books
  const currentBranches = useApi && apiBranches.length > 0 ? apiBranches : branches
  const currentUser = useApi && apiUser ? apiUser : user

  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])

  useEffect(() => {
    const filtered = currentBooks.filter((book) => {
      const searchTerm = searchQuery.toLowerCase()
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm) || book.author.toLowerCase().includes(searchTerm)

      let matchesSection = true
      if (bookSection === "physical") {
        matchesSection = !book.isDigital
      } else if (bookSection === "digital") {
        matchesSection = book.isDigital
      }

      const matchesGenre = selectedGenre === "all" || book.genre === selectedGenre
      const matchesFormat = selectedFormat === "all" || book.format === selectedFormat

      return matchesSearch && matchesSection && matchesGenre && matchesFormat
    })

    // Sorting logic
    if (sortBy === "title") {
      filtered.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortBy === "author") {
      filtered.sort((a, b) => a.author.localeCompare(b.author))
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => b.rating - a.rating)
    } else if (sortBy === "year") {
      filtered.sort((a, b) => b.publishYear - a.publishYear)
    }

    setFilteredBooks(filtered)
  }, [currentBooks, searchQuery, bookSection, selectedGenre, selectedFormat, sortBy])

  const getSeasonalColor = (season?: string) => {
    switch (season) {
      case "spring":
        return "text-green-600 bg-green-50 border-green-200"
      case "summer":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "fall":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "winter":
        return "text-blue-600 bg-blue-50 border-blue-200"
      default:
        return "text-purple-600 bg-purple-50 border-purple-200"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600 bg-green-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "hard":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const calculateProgress = (progress: number, target: number) => {
    return Math.min((progress / target) * 100, 100)
  }

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
  }

  const createNewGoal = () => {
    if (newGoal.title && newGoal.target && newGoal.deadline) {
      const goal: ReadingGoal = {
        id: `goal-${Date.now()}`,
        title: newGoal.title,
        target: Number.parseInt(newGoal.target),
        progress: 0,
        unit: newGoal.unit,
        deadline: newGoal.deadline,
        isCompleted: false,
        createdDate: new Date().toISOString().split("T")[0],
      }
      setPersonalGoals((prev) => [...prev, goal])
      setNewGoal({ title: "", target: "", unit: "books", deadline: "" })
      setShowNewGoal(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }

  const handleLogout = () => {
    setUser((prev) => ({ ...prev, isAuthenticated: false }))
  }

  const handleReturn = (book: Book) => {
    alert(`Returned ${book.title}`)
  }

  const payFine = (fineId: string) => {
    alert(`Paid fine ${fineId}`)
  }

  const getDaysUntilDue = (dueDate: string | undefined): number | null => {
    if (!dueDate) return null

    const now = new Date()
    const due = new Date(dueDate)
    const diff = due.getTime() - now.getTime()
    return Math.ceil(diff / (1000 * 3600 * 24))
  }

  const BookCard: React.FC<{ book: Book; mode: "grid" | "list" }> = ({ book, mode }) => {
    return (
      <Card className="cursor-pointer" onClick={() => setSelectedBook(book)}>
        <CardContent className="p-3">
          {mode === "grid" ? (
            <div className="space-y-2">
              <div className="relative aspect-[3/4] overflow-hidden rounded-md">
                <img src={book.cover || "/placeholder.svg"} alt={book.title} className="object-cover w-full h-full" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-sm truncate">{book.title}</h3>
                <p className="text-xs text-muted-foreground truncate">{book.author}</p>
                <div className="flex items-center gap-1 text-xs">
                  <Star className="w-3 h-3 text-yellow-500" />
                  <span>{book.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <div className="relative w-20 aspect-[3/4] overflow-hidden rounded-md">
                <img src={book.cover || "/placeholder.svg"} alt={book.title} className="object-cover w-full h-full" />
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="font-semibold text-sm">{book.title}</h3>
                <p className="text-xs text-muted-foreground">{book.author}</p>
                <div className="flex items-center gap-1 text-xs">
                  <Star className="w-3 h-3 text-yellow-500" />
                  <span>{book.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  {book.available ? (
                    <UIBadge variant="secondary">Available</UIBadge>
                  ) : (
                    <UIBadge variant="destructive">Unavailable</UIBadge>
                  )}
                  {book.isDigital && <UIBadge variant="outline">eBook</UIBadge>}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const BookDetail: React.FC<{ book: Book }> = ({ book }) => {
    return (
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>{book.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative aspect-[3/4] overflow-hidden rounded-md">
            <img src={book.cover || "/placeholder.svg"} alt={book.title} className="object-cover w-full h-full" />
          </div>
          <div className="space-y-2">
            <p className="text-muted-foreground">{book.description}</p>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Author:</span>
              <span>{book.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Genre:</span>
              <span>{book.genre}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Pages:</span>
              <span>{book.pages}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Published:</span>
              <span>{book.publishYear}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">ISBN:</span>
              <span>{book.isbn}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Language:</span>
              <span>{book.language}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Format:</span>
              <span>{book.format}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Rating:</span>
              <div className="flex items-center gap-1 text-xs">
                <Star className="w-3 h-3 text-yellow-500" />
                <span>{book.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button className="w-full">
              <Heart className="w-4 h-4 mr-2" />
              Add to Wishlist
            </Button>
            <Button variant="secondary" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    )
  }

  const LoginDialog = () => {
    const [loginMethod, setLoginMethod] = useState<"card" | "email">("card")
    const [cardNumber, setCardNumber] = useState("")
    const [email, setEmail] = useState("")
    const [passcode, setPasscode] = useState("")
    const [showSignup, setShowSignup] = useState(false)
    const [signupData, setSignupData] = useState({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      passcode: "",
      confirmPasscode: "",
    })

    // In the LoginDialog component, update the handleLogin function:
    const handleLogin = async () => {
      if (useApi) {
        const loginData =
          loginMethod === "card"
            ? { loginMethod: "card", cardNumber, passcode }
            : { loginMethod: "email", email, passcode }

        const success = await apiLogin(loginData)
        if (success) {
          setShowLogin(false)
          setCardNumber("")
          setEmail("")
          setPasscode("")
        }
      } else {
        // Original mock login logic
        const isValidCard = cardNumber === "1234567890" && passcode === "1234567890"
        const isValidEmail = email === "your.email@example.com" && passcode === "1234567890"

        if (isValidCard || isValidEmail) {
          setUser((prev) => ({ ...prev, isAuthenticated: true }))
          setShowLogin(false)
          setCardNumber("")
          setEmail("")
          setPasscode("")
        } else {
          alert("Invalid credentials. Try card: 1234567890, passcode: 1234567890")
        }
      }
    }

    // In the LoginDialog component, update the handleSignup function:
    const handleSignup = async () => {
      if (signupData.passcode !== signupData.confirmPasscode) {
        alert("Passcodes don't match")
        return
      }

      if (!signupData.firstName || !signupData.lastName || !signupData.email || !signupData.passcode) {
        alert("Please fill in all required fields")
        return
      }

      if (useApi) {
        const success = await apiSignup(signupData)
        if (success) {
          setShowLogin(false)
          setShowSignup(false)
          alert(`Welcome! Your account has been created successfully.`)
        }
      } else {
        // Original mock signup logic
        const newCardNumber = Math.floor(Math.random() * 9000000000) + 1000000000

        setUser({
          id: "new-user",
          name: `${signupData.firstName} ${signupData.lastName}`,
          email: signupData.email,
          avatar: "/placeholder.svg?height=40&width=40",
          cardNumber: newCardNumber.toString(),
          booksCheckedOut: 0,
          holds: 0,
          fines: 0,
          isAuthenticated: true,
        })

        setShowLogin(false)
        setShowSignup(false)
        alert(`Welcome! Your new library card number is: ${newCardNumber}`)
      }
    }

    return (
      <Dialog open={showLogin} onOpenChange={setShowLogin}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle>{showSignup ? "Sign Up" : "Sign In"}</DialogTitle>
          </DialogHeader>

          {!showSignup ? (
            <div className="space-y-4">
              <Tabs value={loginMethod} onValueChange={(value: "card" | "email") => setLoginMethod(value)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="card">Library Card</TabsTrigger>
                  <TabsTrigger value="email">Email</TabsTrigger>
                </TabsList>

                <TabsContent value="card" className="space-y-4">
                  <div>
                    <Label htmlFor="card-number">Library Card Number</Label>
                    <Input
                      id="card-number"
                      placeholder="1234567890"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="passcode-card">Passcode</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        id="passcode-card"
                        placeholder="1234567890"
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="email" className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="email"
                      id="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="passcode-email">Passcode</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        id="passcode-email"
                        placeholder="1234567890"
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <Button className="w-full" onClick={handleLogin}>
                Sign In
              </Button>

              <div className="text-center">
                <Button variant="link" onClick={() => setShowSignup(true)}>
                  Don't have an account? Sign up
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={signupData.firstName}
                    onChange={(e) => setSignupData((prev) => ({ ...prev, firstName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={signupData.lastName}
                    onChange={(e) => setSignupData((prev) => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="signup-email">Email *</Label>
                <Input
                  type="email"
                  id="signup-email"
                  value={signupData.email}
                  onChange={(e) => setSignupData((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={signupData.phone}
                  onChange={(e) => setSignupData((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={signupData.address}
                  onChange={(e) => setSignupData((prev) => ({ ...prev, address: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="signup-passcode">Create Passcode *</Label>
                <Input
                  type="password"
                  id="signup-passcode"
                  value={signupData.passcode}
                  onChange={(e) => setSignupData((prev) => ({ ...prev, passcode: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="confirm-passcode">Confirm Passcode *</Label>
                <Input
                  type="password"
                  id="confirm-passcode"
                  value={signupData.confirmPasscode}
                  onChange={(e) => setSignupData((prev) => ({ ...prev, confirmPasscode: e.target.value }))}
                />
              </div>

              <Button className="w-full" onClick={handleSignup}>
                Create Account
              </Button>

              <div className="text-center">
                <Button variant="link" onClick={() => setShowSignup(false)}>
                  Already have an account? Sign in
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    )
  }

  const DigitalBarcode = ({ cardNumber }: { cardNumber: string }) => (
    <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <CardContent className="p-4">
        <div className="text-center space-y-3">
          <h3 className="font-semibold">Austin Public Library</h3>
          <div className="bg-white p-2 rounded">
            <div className="flex justify-center space-x-1">
              {Array.from({ length: 50 }, (_, i) => (
                <div
                  key={i}
                  className="bg-black"
                  style={{
                    width: "2px",
                    height: Math.random() > 0.5 ? "30px" : "20px",
                  }}
                />
              ))}
            </div>
            <p className="text-black text-sm font-mono mt-1">{cardNumber}</p>
          </div>
          <p className="text-sm opacity-90">Digital Library Card</p>
        </div>
      </CardContent>
    </Card>
  )

  const HomeTab = () => (
    <div className="space-y-6">
      {isOffline && (
        <Alert>
          <WifiOff className="w-4 h-4" />
          <AlertDescription>{"You're offline. Some features may be limited."}</AlertDescription>
        </Alert>
      )}

      {!currentUser.isAuthenticated ? (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <BookOpen className="w-12 h-12 mx-auto text-primary mb-3" />
            <h3 className="font-semibold text-lg mb-2">Welcome to Austin Public Library</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Sign in to access your account, manage holds, and track your reading
            </p>
            <Button onClick={() => setShowLogin(true)} className="w-full">
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Welcome back, {currentUser.name.split(" ")[0]}!</h2>
            <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <BookOpen className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{currentUser.booksCheckedOut}</div>
                <div className="text-sm text-muted-foreground">Checked Out</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{currentUser.holds}</div>
                <div className="text-sm text-muted-foreground">On Hold</div>
              </CardContent>
            </Card>
          </div>

          {currentUser.fines > 0 && (
            <Alert>
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                You have ${currentUser.fines.toFixed(2)} in outstanding fines.{" "}
                <Button variant="link" className="p-0 h-auto" onClick={() => setActiveTab("account")}>
                  Pay now
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div>
            <h3 className="font-semibold mb-3">Continue Reading</h3>
            <div className="space-y-3">
              {currentBooks
                .filter((book) => book.progress)
                .slice(0, 3)
                .map((book) => (
                  <BookCard key={book.id} book={book} mode="list" />
                ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Recommended for You</h3>
            <div className="grid grid-cols-2 gap-3">
              {currentBooks
                .filter((book) => book.available)
                .slice(0, 4)
                .map((book) => (
                  <BookCard key={book.id} book={book} mode="grid" />
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  )

  const SearchTab = () => (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
            <Search className="w-4 h-4 text-muted-foreground transition-colors duration-200" />
          </div>
          <Input
            placeholder="Search books, authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 h-11 border-2 transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:shadow-sm hover:border-primary/50 bg-background"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            role="searchbox"
            aria-label="Search books and authors"
            aria-describedby="search-help"
          />
          <div id="search-help" className="sr-only">
            Type to search through books and authors in the library catalog
          </div>
        </div>
        <Sheet open={showFilters} onOpenChange={setShowFilters}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              type="button"
              className="h-11 w-11 border-2 hover:bg-accent hover:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              aria-label="Open search filters"
            >
              <Filter className="w-4 h-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[500px]">
            <SheetHeader>
              <SheetTitle>Filters & Sort</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium">Collection</label>
                <Select
                  value={bookSection}
                  onValueChange={(value: "all" | "physical" | "digital") => setBookSection(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Items</SelectItem>
                    <SelectItem value="physical">Physical Books</SelectItem>
                    <SelectItem value="digital">Digital Collection</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Genre</label>
                <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genres</SelectItem>
                    <SelectItem value="Fiction">Fiction</SelectItem>
                    <SelectItem value="Children's">Children's</SelectItem>
                    <SelectItem value="Young Adult">Young Adult</SelectItem>
                    <SelectItem value="Science Fiction">Science Fiction</SelectItem>
                    <SelectItem value="Romance">Romance</SelectItem>
                    <SelectItem value="Mystery">Mystery</SelectItem>
                    <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
                    <SelectItem value="Biography">Biography</SelectItem>
                    <SelectItem value="History">History</SelectItem>
                    <SelectItem value="Self-Help">Self-Help</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Format</label>
                <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Formats</SelectItem>
                    <SelectItem value="Physical">Physical Book</SelectItem>
                    <SelectItem value="eBook">eBook</SelectItem>
                    <SelectItem value="Audiobook">Audiobook</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title">Title A-Z</SelectItem>
                    <SelectItem value="author">Author A-Z</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="year">Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          type="button"
          className="h-11 w-11 border-2 hover:bg-accent hover:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
          aria-label={`Switch to ${viewMode === "grid" ? "list" : "grid"} view`}
        >
          {viewMode === "grid" ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
        </Button>
      </div>

      <Tabs
        value={bookSection}
        onValueChange={(value: string) => setBookSection(value as "all" | "physical" | "digital")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All ({currentBooks.length})</TabsTrigger>
          <TabsTrigger value="physical">Physical ({currentBooks.filter((b) => !b.isDigital).length})</TabsTrigger>
          <TabsTrigger value="digital">Digital ({currentBooks.filter((b) => b.isDigital).length})</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="w-16 h-20" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="text-center py-8">
          <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">No books found</h3>
          <p className="text-muted-foreground text-sm">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-2 gap-3" : "space-y-3"}>
          {filteredBooks.slice(0, 50).map((book) => (
            <BookCard key={book.id} book={book} mode={viewMode} />
          ))}
          {filteredBooks.length > 50 && (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">Showing first 50 of {filteredBooks.length} results</p>
            </div>
          )}
        </div>
      )}
    </div>
  )

  const BranchesTab = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Library Locations</h2>
        <p className="text-muted-foreground">Find your nearest Austin Public Library branch</p>
      </div>

      <div className="space-y-4">
        {currentBranches.map((branch) => (
          <Card key={branch.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{branch.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {branch.address}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <UIBadge variant={branch.isOpen ? "default" : "secondary"}>
                    {branch.isOpen ? "Open" : "Closed"}
                  </UIBadge>
                  <span className="text-sm text-muted-foreground">{branch.distance}</span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">{branch.hours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">{branch.phone}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mt-3">
                {branch.services.map((service, index) => (
                  <UIBadge key={index} variant="outline" className="text-xs">
                    {service}
                  </UIBadge>
                ))}
              </div>

              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" className="flex-1" asChild>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(branch.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full"
                  >
                    <Navigation className="h-3 w-3 mr-1" />
                    Directions
                  </a>
                </Button>
                <Button size="sm" variant="outline" className="flex-1" asChild>
                  <a href={`tel:${branch.phone}`} className="flex items-center justify-center w-full">
                    <Phone className="h-3 w-3 mr-1" />
                    Call
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const AccountTab = () => (
    <div className="space-y-6">
      {!currentUser.isAuthenticated ? (
        <Card className="text-center p-6">
          <User className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg mb-2">Sign In Required</h3>
          <p className="text-muted-foreground text-sm mb-4">Please sign in to access your account information</p>
          <Button onClick={() => setShowLogin(true)}>
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Button>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
                <AvatarFallback>{currentUser.name.split(" ").map((n) => n[0])}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">{currentUser.name}</h2>
                <p className="text-muted-foreground text-sm">{currentUser.email}</p>
                <p className="text-muted-foreground text-xs">Card: {currentUser.cardNumber}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="fines">Fines</TabsTrigger>
              <TabsTrigger value="renewals">Renewals</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <BookOpen className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">{currentUser.booksCheckedOut}</div>
                    <div className="text-sm text-muted-foreground">Checked Out</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">{currentUser.holds}</div>
                    <div className="text-sm text-muted-foreground">On Hold</div>
                  </CardContent>
                </Card>
              </div>

              <DigitalBarcode cardNumber={currentUser.cardNumber} />

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Reading History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentBooks
                      .filter((book) => book.progress)
                      .slice(0, 5)
                      .map((book) => (
                        <div key={book.id} className="flex items-center gap-3">
                          <img
                            src={book.cover || "/placeholder.svg"}
                            alt={book.title}
                            className="w-10 h-12 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{book.title}</p>
                            <p className="text-xs text-muted-foreground">{book.progress}% complete</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="renewals" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RotateCcw className="h-5 w-5" />
                    Items Available for Renewal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentBooks
                      .filter((book) => book.dueDate && !book.isDigital)
                      .slice(0, 5)
                      .map((book) => (
                        <div key={book.id} className="border rounded-lg p-4">
                          <div className="flex gap-3">
                            <img
                              src={book.cover || "/placeholder.svg"}
                              alt={book.title}
                              className="w-12 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium">{book.title}</h4>
                              <p className="text-sm text-muted-foreground">{book.author}</p>
                              <p className="text-sm text-muted-foreground">
                                Due: {book.dueDate ? new Date(book.dueDate).toLocaleDateString() : "N/A"} (
                                {book.dueDate ? getDaysUntilDue(book.dueDate) : "N/A"} days)
                              </p>
                              <div className="flex gap-2 mt-2">
                                <Button size="sm" onClick={() => handleRenew(book)}>
                                  <RotateCcw className="h-3 w-3 mr-1" />
                                  Renew
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleReturn(book)}>
                                  Return
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email Notifications</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">SMS Reminders</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto-renewal</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Offline mode</span>
                    <Switch checked={isOffline} onCheckedChange={setIsOffline} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Privacy Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Reading History</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Personalized Recommendations</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Share Reading Activity</span>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )

  // Update the handleRenew function
  const handleRenew = async (book: Book) => {
    if (useApi) {
      // Find the checkout ID for this book
      const checkout = apiCheckouts.find((c) => c.bookId === book.id)
      if (checkout) {
        await apiRenewBook(checkout.id)
      } else {
        alert("Unable to find checkout record for renewal")
      }
    } else {
      // Original mock renewal logic
      if (book.dueDate) {
        const currentDate = new Date(book.dueDate)
        const newDueDate = new Date(currentDate.setDate(currentDate.getDate() + 14))
        const newDueDateString = newDueDate.toISOString().split("T")[0]

        setBooks((prevBooks) => prevBooks.map((b) => (b.id === book.id ? { ...b, dueDate: newDueDateString } : b)))
        alert(`Renewed ${book.title}. New due date: ${newDueDateString}`)
      } else {
        alert("This book cannot be renewed.")
      }
    }
  }

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen flex flex-col">
      <div className="flex-1 p-4 pb-20 overflow-y-auto">
        {activeTab === "home" && <HomeTab />}
        {activeTab === "search" && <SearchTab />}
        {activeTab === "branches" && <BranchesTab />}
        {activeTab === "account" && <AccountTab />}
      </div>

      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-background border-t border-border">
        <div className="flex items-center justify-around py-2">
          <Button
            variant={activeTab === "home" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("home")}
            className="flex-col h-auto py-2"
          >
            <Home className="w-4 h-4 mb-1" />
            <span className="text-xs">Home</span>
          </Button>
          <Button
            variant={activeTab === "search" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("search")}
            className="flex-col h-auto py-2"
          >
            <Search className="w-4 h-4 mb-1" />
            <span className="text-xs">Catalog</span>
          </Button>
          <Button
            variant={activeTab === "branches" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("branches")}
            className="flex-col h-auto py-2"
          >
            <Building className="w-4 h-4 mb-1" />
            <span className="text-xs">Locations</span>
          </Button>
          <Button
            variant={activeTab === "account" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("account")}
            className="flex-col h-auto py-2"
          >
            <User className="w-4 h-4 mb-1" />
            <span className="text-xs">Account</span>
          </Button>
        </div>
      </div>

      <Dialog open={!!selectedBook} onOpenChange={() => setSelectedBook(null)}>
        {selectedBook && <BookDetail book={selectedBook} />}
      </Dialog>

      <LoginDialog />
    </div>
  )
}

export default LibraryMobileApp
