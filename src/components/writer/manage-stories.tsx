import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  ArrowLeft, 
  Plus, 
  Search,
  Edit,
  Trash2,
  Eye,
  BookOpen,
  Calendar,
  Filter,
  MoreHorizontal
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ManageStoriesProps {
  onNavigate: (page: string, data?: any) => void
}

export function ManageStories({ onNavigate }: ManageStoriesProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [storyToDelete, setStoryToDelete] = useState<number | null>(null)

  const mockStories = [
    {
      id: 1,
      title: "The Digital Awakening",
      status: "published",
      reads: 15420,
      likes: 1250,
      comments: 340,
      lastUpdated: "2 days ago",
      chapters: 12,
      createdAt: "March 15, 2024",
      genre: "Sci-Fi",
      cover: "/placeholder.svg"
    },
    {
      id: 2,
      title: "Memories in the Rain",
      status: "draft",
      reads: 0,
      likes: 0,
      comments: 0,
      lastUpdated: "5 hours ago",
      chapters: 3,
      createdAt: "March 20, 2024",
      genre: "Romance",
      cover: "/placeholder.svg"
    },
    {
      id: 3,
      title: "The Last Algorithm",
      status: "published",
      reads: 8950,
      likes: 670,
      comments: 180,
      lastUpdated: "1 week ago",
      chapters: 8,
      createdAt: "February 28, 2024",
      genre: "Thriller",
      cover: "/placeholder.svg"
    },
    {
      id: 4,
      title: "Echoes of Tomorrow",
      status: "archived",
      reads: 3200,
      likes: 210,
      comments: 45,
      lastUpdated: "2 months ago",
      chapters: 15,
      createdAt: "January 10, 2024",
      genre: "Fantasy",
      cover: "/placeholder.svg"
    },
    {
      id: 5,
      title: "Urban Legends",
      status: "draft",
      reads: 0,
      likes: 0,
      comments: 0,
      lastUpdated: "1 day ago",
      chapters: 1,
      createdAt: "March 22, 2024",
      genre: "Horror",
      cover: "/placeholder.svg"
    }
  ]

  const filteredStories = mockStories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || story.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "default"
      case "draft": return "secondary"
      case "archived": return "outline"
      default: return "secondary"
    }
  }

  const handleDeleteClick = (storyId: number) => {
    setStoryToDelete(storyId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    // Handle delete logic here
    setDeleteDialogOpen(false)
    setStoryToDelete(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => onNavigate("dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Manage Stories</h1>
            <p className="text-muted-foreground">View and manage all your stories</p>
          </div>
        </div>
        <Button className="vine-button-hero" onClick={() => onNavigate("create-story")}>
          <Plus className="h-4 w-4 mr-2" />
          New Story
        </Button>
      </div>

      {/* Filters */}
      <Card className="vine-card">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {["all", "published", "draft", "archived"].map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus(status)}
                >
                  {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stories Grid */}
      <div className="grid gap-6">
        {filteredStories.map((story) => (
          <Card key={story.id} className="vine-card">
            <CardContent className="p-6">
              <div className="flex gap-6">
                {/* Cover Image */}
                <div className="w-20 h-28 bg-secondary/30 rounded-lg flex-shrink-0 flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                </div>

                {/* Story Details */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{story.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {story.genre} • {story.chapters} chapters • Created {story.createdAt}
                      </p>
                    </div>
                    <Badge variant={getStatusColor(story.status)}>
                      {story.status}
                    </Badge>
                  </div>

                  <div className="flex gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {story.reads.toLocaleString()} reads
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Updated {story.lastUpdated}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex gap-4 text-sm">
                      <span>{story.likes} likes</span>
                      <span>{story.comments} comments</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onNavigate("manage-chapters")}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onNavigate("slide-reader")}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onNavigate("manage-chapters")}>
                            <BookOpen className="h-4 w-4 mr-2" />
                            View Chapters
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Filter className="h-4 w-4 mr-2" />
                            Analytics
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeleteClick(story.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStories.length === 0 && (
        <Card className="vine-card">
          <CardContent className="pt-6 pb-6 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No stories found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || filterStatus !== "all" 
                ? "Try adjusting your search or filters" 
                : "Start your writing journey by creating your first story"
              }
            </p>
            {!searchQuery && filterStatus === "all" && (
              <Button className="vine-button-hero" onClick={() => onNavigate("create-story")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Story
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Story</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this story? This action cannot be undone and will permanently remove the story and all its chapters.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
            >
              Delete Story
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}