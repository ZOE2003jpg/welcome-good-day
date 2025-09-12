import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Search,
  Filter,
  BookOpen,
  Star,
  Eye,
  Clock,
  TrendingUp,
  X
} from "lucide-react"

interface SearchPageProps {
  onNavigate: (page: string, data?: any) => void
}

export function SearchPage({ onNavigate }: SearchPageProps) {
  const [query, setQuery] = useState("")
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("relevance")
  const [showFilters, setShowFilters] = useState(false)

  const genres = [
    "Sci-Fi", "Romance", "Fantasy", "Thriller", "Drama", "Mystery", 
    "Horror", "Comedy", "Historical", "Adventure", "Crime", "Psychological"
  ]

  const sortOptions = [
    { value: "relevance", label: "Relevance" },
    { value: "popular", label: "Most Popular" },
    { value: "recent", label: "Recently Updated" },
    { value: "rating", label: "Highest Rated" },
    { value: "length", label: "Story Length" }
  ]

  const searchResults = [
    {
      id: 1,
      title: "The Quantum Paradox",
      author: "Dr. Marcus Reid",
      description: "A mind-bending journey through parallel dimensions where reality bends to quantum mechanics.",
      genre: ["Sci-Fi", "Thriller"],
      reads: "12.5K",
      rating: 4.8,
      chapters: 24,
      lastUpdated: "2 days ago",
      status: "Ongoing"
    },
    {
      id: 2,
      title: "Digital Hearts",
      author: "Sarah Kim", 
      description: "In a world where love is programmed, two AIs discover what it means to truly feel.",
      genre: ["Romance", "Sci-Fi"],
      reads: "9.8K",
      rating: 4.7,
      chapters: 15,
      lastUpdated: "5 hours ago",
      status: "Complete"
    },
    {
      id: 3,
      title: "The Silent Code",
      author: "Alex Thompson",
      description: "A cyberpunk thriller about hackers uncovering a conspiracy that goes to the highest levels.",
      genre: ["Thriller", "Mystery"],
      reads: "15.2K",
      rating: 4.9,
      chapters: 32,
      lastUpdated: "1 week ago",
      status: "Complete"
    }
  ]

  const popularSearches = [
    "quantum", "romance", "AI", "thriller", "mystery", "space", "love", "adventure"
  ]

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    )
  }

  const clearFilters = () => {
    setSelectedGenres([])
    setSortBy("relevance")
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Search className="h-8 w-8 text-primary" />
            Search Stories
          </h1>
          <p className="text-muted-foreground mt-2">
            Find your next favorite read
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters {selectedGenres.length > 0 && `(${selectedGenres.length})`}
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for stories, authors, or keywords..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 h-12 text-lg"
        />
      </div>

      {/* Popular Searches */}
      {!query && (
        <Card className="vine-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Popular Searches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((search) => (
                <Button
                  key={search}
                  variant="outline"
                  size="sm"
                  onClick={() => setQuery(search)}
                  className="capitalize"
                >
                  {search}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <Card className="vine-card">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Filters</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Genres */}
            <div>
              <h3 className="font-semibold mb-3">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <Button
                    key={genre}
                    variant={selectedGenres.includes(genre) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleGenre(genre)}
                  >
                    {genre}
                  </Button>
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div>
              <h3 className="font-semibold mb-3">Sort By</h3>
              <div className="flex flex-wrap gap-2">
                {sortOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={sortBy === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSortBy(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {query && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {searchResults.length} results for "{query}"
            </h2>
            <div className="text-sm text-muted-foreground">
              Sorted by {sortOptions.find(opt => opt.value === sortBy)?.label}
            </div>
          </div>

          <div className="grid gap-6">
            {searchResults.map((story) => (
              <Card key={story.id} className="vine-card hover-scale cursor-pointer" onClick={() => onNavigate("details", story)}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="w-20 h-28 bg-muted/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{story.title}</h3>
                          <p className="text-muted-foreground">by {story.author}</p>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {story.description}
                          </p>
                        </div>
                        <Badge variant={story.status === "Complete" ? "secondary" : "outline"}>
                          {story.status}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {story.genre.map((g) => (
                          <Badge key={g} variant="outline" className="text-xs">
                            {g}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {story.reads}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-primary text-primary" />
                            {story.rating}
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {story.chapters} chapters
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Updated {story.lastUpdated}
                          </div>
                        </div>
                        <Button size="sm" className="vine-button-hero" onClick={(e) => {e.stopPropagation(); onNavigate("reader", story)}}>
                          Read Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}