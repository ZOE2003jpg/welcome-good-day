import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  BookOpen, 
  Star,
  Eye,
  Bookmark,
  TrendingUp,
  Heart,
  Clock,
  Filter
} from "lucide-react"

interface DiscoverPageProps {
  onNavigate: (page: string, data?: any) => void
}

export function DiscoverPage({ onNavigate }: DiscoverPageProps) {
  const [selectedGenre, setSelectedGenre] = useState("all")

  const featuredStories = [
    {
      id: 1,
      title: "The Quantum Paradox",
      author: "Dr. Marcus Reid",
      description: "A mind-bending journey through parallel dimensions where reality bends to quantum mechanics.",
      cover: "/api/placeholder/200/300",
      reads: "12.5K",
      rating: 4.8,
      genre: "Sci-Fi",
      chapters: 24,
      isNew: true
    },
    {
      id: 2,
      title: "Echoes of Tomorrow",
      author: "Luna Martinez",
      description: "In a world where memories can be traded, one woman fights to keep her past.",
      cover: "/api/placeholder/200/300",
      reads: "8.3K",
      rating: 4.6,
      genre: "Drama",
      chapters: 18,
      isNew: false
    },
    {
      id: 3,
      title: "The Silent Code",
      author: "Alex Thompson",
      description: "A cyberpunk thriller about hackers uncovering a conspiracy that goes to the highest levels.",
      cover: "/api/placeholder/200/300",
      reads: "15.2K",
      rating: 4.9,
      genre: "Thriller",
      chapters: 32,
      isNew: false
    }
  ]

  const trendingStories = [
    {
      id: 4,
      title: "Digital Hearts",
      author: "Sarah Kim",
      reads: "9.8K",
      rating: 4.7,
      genre: "Romance",
      chapters: 15
    },
    {
      id: 5,
      title: "The Last Sanctuary",
      author: "Michael Torres",
      reads: "11.2K",
      rating: 4.5,
      genre: "Fantasy",
      chapters: 28
    },
    {
      id: 6,
      title: "Neon Nights",
      author: "Zoe Chen",
      reads: "7.6K",
      rating: 4.8,
      genre: "Mystery",
      chapters: 20
    }
  ]

  const genres = ["all", "Sci-Fi", "Romance", "Fantasy", "Thriller", "Drama", "Mystery"]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-primary" />
            Discover Stories
          </h1>
          <p className="text-muted-foreground mt-2">
            Find your next favorite story
          </p>
        </div>
        <Button 
          variant="outline"
          onClick={() => onNavigate("search")}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Advanced Search
        </Button>
      </div>

      {/* Genre Filter */}
      <div className="flex flex-wrap gap-2">
        {genres.map((genre) => (
          <Button
            key={genre}
            variant={selectedGenre === genre ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedGenre(genre)}
            className="capitalize"
          >
            {genre}
          </Button>
        ))}
      </div>

      {/* Featured Stories Carousel */}
      <Card className="vine-card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Featured Stories
          </CardTitle>
          <CardDescription>
            Editor's picks and new releases
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredStories.map((story) => (
              <Card key={story.id} className="vine-card hover-scale cursor-pointer" onClick={() => onNavigate("details", story)}>
                <div className="aspect-[3/4] bg-muted/30 rounded-t-lg mb-4 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground" />
                </div>
                <CardContent className="pt-0">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={story.isNew ? "default" : "outline"} className="mb-2">
                      {story.isNew ? "New" : story.genre}
                    </Badge>
                    <Button size="sm" variant="ghost" onClick={(e) => {e.stopPropagation()}}>
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{story.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">by {story.author}</p>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{story.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {story.reads}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        {story.rating}
                      </div>
                    </div>
                    <span className="text-muted-foreground">{story.chapters} chapters</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trending This Week */}
      <Card className="vine-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Trending This Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {trendingStories.map((story, index) => (
              <Card key={story.id} className="vine-card hover-scale cursor-pointer" onClick={() => onNavigate("details", story)}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-primary/60 w-8">
                        #{index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{story.title}</h3>
                        <p className="text-muted-foreground">by {story.author}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant="outline">{story.genre}</Badge>
                          <div className="flex items-center gap-1 text-sm">
                            <Eye className="h-4 w-4" />
                            {story.reads}
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-4 w-4 fill-primary text-primary" />
                            {story.rating}
                          </div>
                          <span className="text-sm text-muted-foreground">{story.chapters} chapters</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={(e) => {e.stopPropagation()}}>
                        <Bookmark className="h-4 w-4" />
                      </Button>
                      <Button size="sm" className="vine-button-hero" onClick={(e) => {e.stopPropagation(); onNavigate("reader", story)}}>
                        Read Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Categories */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { name: "Most Liked", icon: Heart, count: "2.3K stories" },
          { name: "Recently Updated", icon: Clock, count: "156 new chapters" },
          { name: "Quick Reads", icon: BookOpen, count: "Under 10 slides" },
          { name: "Completed", icon: Star, count: "Finished stories" }
        ].map((category) => (
          <Card key={category.name} className="vine-card hover-scale cursor-pointer">
            <CardContent className="pt-6 text-center">
              <category.icon className="h-8 w-8 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-1">{category.name}</h3>
              <p className="text-sm text-muted-foreground">{category.count}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}