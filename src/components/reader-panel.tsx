import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight,
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  Settings,
  Library,
  Play,
  Pause,
  Star,
  TrendingUp,
  Clock,
  Eye
} from "lucide-react"

export function ReaderPanel() {
  const [activeTab, setActiveTab] = useState("reader")
  const [currentSlide, setCurrentSlide] = useState(1)
  
  const mockStory = {
    title: "The Digital Awakening",
    author: "Sarah Chen",
    totalSlides: 15,
    currentSlide: 1,
    progress: 20,
    likes: 89,
    comments: 23,
    isBookmarked: false
  }

  const mockLibrary = [
    {
      id: 1,
      title: "The Digital Awakening",
      author: "Sarah Chen",
      progress: 20,
      status: "reading",
      lastRead: "Today"
    },
    {
      id: 2,
      title: "Memories in the Rain",
      author: "John Doe",
      progress: 100,
      status: "completed",
      lastRead: "Yesterday"
    },
    {
      id: 3,
      title: "The Last Algorithm",
      author: "Alice Wang",
      progress: 0,
      status: "wishlist",
      lastRead: "Never"
    }
  ]

  const trendingStories = [
    {
      id: 1,
      title: "The Quantum Paradox",
      author: "Dr. Marcus Reid",
      reads: "12.5K",
      rating: 4.8,
      genre: "Sci-Fi"
    },
    {
      id: 2,
      title: "Echoes of Tomorrow",
      author: "Luna Martinez",
      reads: "8.3K",
      rating: 4.6,
      genre: "Drama"
    },
    {
      id: 3,
      title: "The Silent Code",
      author: "Alex Thompson",
      reads: "15.2K",
      rating: 4.9,
      genre: "Thriller"
    }
  ]

  const nextSlide = () => {
    if (currentSlide < mockStory.totalSlides) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 1) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  return (
    <div className="container px-4 py-8 mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            Reader Panel
          </h1>
          <p className="text-muted-foreground mt-2">
            Immersive slide-based reading experience
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="reader">Slide Reader</TabsTrigger>
          <TabsTrigger value="library">My Library</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="discover">Discover</TabsTrigger>
        </TabsList>

        {/* Slide Reader Tab */}
        <TabsContent value="reader" className="space-y-6">
          <Card className="vine-card-elevated">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{mockStory.title}</CardTitle>
                  <CardDescription className="text-base">
                    by {mockStory.author}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Slide {currentSlide} of {mockStory.totalSlides}</span>
                  <span>{mockStory.progress}% complete</span>
                </div>
                <Progress value={mockStory.progress} className="h-2" />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Slide Content */}
              <div className="vine-slide-container min-h-[400px] p-8 bg-muted/30 rounded-lg">
                <div className="prose prose-lg max-w-none">
                  <p className="text-lg leading-relaxed">
                    The city never slept, but tonight it seemed to pulse with an otherworldly energy. 
                    Neon lights flickered in patterns that Maya had never noticed before, 
                    creating a rhythm that matched her racing heartbeat.
                  </p>
                  <p className="mt-4 text-lg leading-relaxed">
                    She paused at the intersection, watching the streams of data that now 
                    seemed visible in the air around her. The enhancement had worked, 
                    perhaps too well.
                  </p>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex justify-between items-center">
                <Button 
                  variant="outline" 
                  onClick={prevSlide}
                  disabled={currentSlide === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                
                <div className="flex gap-4">
                  <Button size="sm" variant="outline">
                    <Heart className="h-4 w-4 mr-1" />
                    {mockStory.likes}
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {mockStory.comments}
                  </Button>
                  <Button size="sm" variant="outline">
                    <Share className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>

                <Button 
                  onClick={nextSlide}
                  disabled={currentSlide === mockStory.totalSlides}
                  className="vine-button-hero"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Ad Placeholder */}
          <Card className="vine-card border-dashed border-2">
            <CardContent className="py-8 text-center">
              <Play className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Video ad will appear after 6 slides
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Library Tab */}
        <TabsContent value="library" className="space-y-6">
          <div className="grid gap-6">
            {mockLibrary.map((item) => (
              <Card key={item.id} className="vine-card">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-muted-foreground">by {item.author}</p>
                    </div>
                    <Badge variant={
                      item.status === "completed" ? "default" : 
                      item.status === "reading" ? "secondary" : "outline"
                    }>
                      {item.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{item.progress}%</span>
                    </div>
                    <Progress value={item.progress} className="h-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Last read: {item.lastRead}
                      </span>
                      <div className="flex gap-2">
                        {item.status === "reading" && (
                          <Button size="sm" className="vine-button-hero">
                            <BookOpen className="h-4 w-4 mr-1" />
                            Continue
                          </Button>
                        )}
                        {item.status === "wishlist" && (
                          <Button size="sm" variant="outline">
                            <Play className="h-4 w-4 mr-1" />
                            Start Reading
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Community Tab */}
        <TabsContent value="community" className="space-y-6">
          <Card className="vine-card">
            <CardHeader>
              <CardTitle>Community Features</CardTitle>
              <CardDescription>
                Connect with other readers and writers
              </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <Card className="vine-card p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  Recent Comments
                </h3>
                <div className="space-y-3">
                  <div className="border-b pb-2">
                    <p className="text-sm">"Amazing story! Can't wait for the next chapter."</p>
                    <p className="text-xs text-muted-foreground">- Reader123 on "Digital Awakening"</p>
                  </div>
                  <div className="border-b pb-2">
                    <p className="text-sm">"The plot twist in chapter 5 was incredible!"</p>
                    <p className="text-xs text-muted-foreground">- BookLover on "Quantum Paradox"</p>
                  </div>
                </div>
              </Card>

              <Card className="vine-card p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Liked Stories
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>The Digital Awakening</span>
                    <span>89 likes</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Memories in the Rain</span>
                    <span>56 likes</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>The Last Algorithm</span>
                    <span>156 likes</span>
                  </div>
                </div>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Discover Tab */}
        <TabsContent value="discover" className="space-y-6">
          <Card className="vine-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Trending Stories
              </CardTitle>
              <CardDescription>
                Discover popular stories from the community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {trendingStories.map((story) => (
                  <Card key={story.id} className="vine-card">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
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
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Bookmark className="h-4 w-4" />
                          </Button>
                          <Button size="sm" className="vine-button-hero">
                            <BookOpen className="h-4 w-4 mr-1" />
                            Read
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}