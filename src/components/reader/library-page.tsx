import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BookOpen, 
  Library,
  Clock,
  CheckCircle,
  Heart,
  Trash2,
  MoreHorizontal,
  Filter,
  SortDesc
} from "lucide-react"

interface LibraryPageProps {
  onNavigate: (page: string, data?: any) => void
}

export function LibraryPage({ onNavigate }: LibraryPageProps) {
  const [sortBy, setSortBy] = useState("recent")

  const currentlyReading = [
    {
      id: 1,
      title: "The Digital Awakening",
      author: "Sarah Chen",
      progress: 35,
      currentSlide: 8,
      totalSlides: 24,
      lastRead: "2 hours ago",
      cover: "/api/placeholder/120/180",
      genre: "Sci-Fi"
    },
    {
      id: 2,
      title: "Echoes of Tomorrow",
      author: "Luna Martinez",
      progress: 67,
      currentSlide: 12,
      totalSlides: 18,
      lastRead: "1 day ago",
      cover: "/api/placeholder/120/180",
      genre: "Drama"
    },
    {
      id: 3,
      title: "The Silent Code",
      author: "Alex Thompson",
      progress: 12,
      currentSlide: 4,
      totalSlides: 32,
      lastRead: "3 days ago",
      cover: "/api/placeholder/120/180",
      genre: "Thriller"
    }
  ]

  const completed = [
    {
      id: 4,
      title: "Memories in the Rain",
      author: "John Doe",
      completedDate: "2 weeks ago",
      rating: 5,
      totalSlides: 22,
      cover: "/api/placeholder/120/180",
      genre: "Romance"
    },
    {
      id: 5,
      title: "Quantum Hearts",
      author: "Dr. Lisa Park",
      completedDate: "1 month ago", 
      rating: 4,
      totalSlides: 28,
      cover: "/api/placeholder/120/180",
      genre: "Sci-Fi"
    }
  ]

  const wishlist = [
    {
      id: 6,
      title: "The Last Algorithm",
      author: "Alice Wang",
      addedDate: "3 days ago",
      reads: "15.2K",
      rating: 4.9,
      totalSlides: 20,
      cover: "/api/placeholder/120/180",
      genre: "Mystery"
    },
    {
      id: 7,
      title: "Digital Dreams",
      author: "Marcus Reid",
      addedDate: "1 week ago",
      reads: "8.7K", 
      rating: 4.6,
      totalSlides: 16,
      cover: "/api/placeholder/120/180",
      genre: "Fantasy"
    }
  ]

  const getReadingStats = () => {
    const totalCompleted = completed.length
    const totalReading = currentlyReading.length
    const totalWishlist = wishlist.length
    const totalSlides = currentlyReading.reduce((sum, story) => sum + story.currentSlide, 0) + 
                       completed.reduce((sum, story) => sum + story.totalSlides, 0)

    return { totalCompleted, totalReading, totalWishlist, totalSlides }
  }

  const stats = getReadingStats()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Library className="h-8 w-8 text-primary" />
            My Library
          </h1>
          <p className="text-muted-foreground mt-2">
            Your reading collection and progress
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <SortDesc className="h-4 w-4 mr-2" />
            Sort by {sortBy}
          </Button>
        </div>
      </div>

      {/* Reading Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="vine-card">
          <CardContent className="pt-6 text-center">
            <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{stats.totalReading}</div>
            <div className="text-sm text-muted-foreground">Currently Reading</div>
          </CardContent>
        </Card>
        <Card className="vine-card">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{stats.totalCompleted}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </CardContent>
        </Card>
        <Card className="vine-card">
          <CardContent className="pt-6 text-center">
            <Heart className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{stats.totalWishlist}</div>
            <div className="text-sm text-muted-foreground">Wishlist</div>
          </CardContent>
        </Card>
        <Card className="vine-card">
          <CardContent className="pt-6 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{stats.totalSlides}</div>
            <div className="text-sm text-muted-foreground">Slides Read</div>
          </CardContent>
        </Card>
      </div>

      {/* Library Tabs */}
      <Tabs defaultValue="reading" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reading" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Currently Reading ({stats.totalReading})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Completed ({stats.totalCompleted})
          </TabsTrigger>
          <TabsTrigger value="wishlist" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Wishlist ({stats.totalWishlist})
          </TabsTrigger>
        </TabsList>

        {/* Currently Reading */}
        <TabsContent value="reading" className="space-y-6">
          <div className="grid gap-6">
            {currentlyReading.map((story) => (
              <Card key={story.id} className="vine-card hover-scale cursor-pointer" onClick={() => onNavigate("reader", story)}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="w-24 h-36 bg-muted/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{story.title}</h3>
                          <p className="text-muted-foreground">by {story.author}</p>
                          <Badge variant="outline" className="mt-1">{story.genre}</Badge>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress: Slide {story.currentSlide} of {story.totalSlides}</span>
                          <span>{story.progress}% complete</span>
                        </div>
                        <Progress value={story.progress} className="h-2" />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Last read: {story.lastRead}
                          </span>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                            <Button size="sm" className="vine-button-hero">
                              <BookOpen className="h-4 w-4 mr-1" />
                              Continue Reading
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Completed */}
        <TabsContent value="completed" className="space-y-6">
          <div className="grid gap-6">
            {completed.map((story) => (
              <Card key={story.id} className="vine-card hover-scale cursor-pointer" onClick={() => onNavigate("details", story)}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="w-24 h-36 bg-muted/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{story.title}</h3>
                          <p className="text-muted-foreground">by {story.author}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary">{story.genre}</Badge>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <CheckCircle
                                  key={i}
                                  className={`h-4 w-4 ${i < story.rating ? 'text-primary fill-current' : 'text-muted-foreground'}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Completed {story.completedDate} • {story.totalSlides} slides
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                          <Button size="sm" className="vine-button-hero">
                            <BookOpen className="h-4 w-4 mr-1" />
                            Read Again
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Wishlist */}
        <TabsContent value="wishlist" className="space-y-6">
          <div className="grid gap-6">
            {wishlist.map((story) => (
              <Card key={story.id} className="vine-card hover-scale cursor-pointer" onClick={() => onNavigate("details", story)}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="w-24 h-36 bg-muted/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{story.title}</h3>
                          <p className="text-muted-foreground">by {story.author}</p>
                          <Badge variant="outline" className="mt-1">{story.genre}</Badge>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Added {story.addedDate} • {story.reads} reads • ★{story.rating}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                          <Button size="sm" className="vine-button-hero" onClick={() => onNavigate("reader", story)}>
                            <BookOpen className="h-4 w-4 mr-1" />
                            Start Reading
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}