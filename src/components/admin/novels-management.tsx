import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStories } from "@/hooks/useStories"
import { 
  BookOpen, 
  Eye, 
  Edit, 
  Ban, 
  CheckCircle, 
  X, 
  Search,
  Plus,
  FileText
} from "lucide-react"

interface NovelsManagementProps {
  onNavigate: (page: string, data?: any) => void
}

export function NovelsManagement({ onNavigate }: NovelsManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { stories, loading } = useStories()

  const filteredStories = stories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (story.profiles?.display_name || story.profiles?.username || "").toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || story.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "default"
      case "pending": return "secondary"
      case "banned": return "destructive"
      default: return "outline"
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            Novels Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage novels, approve content, and moderate publications
          </p>
        </div>
        <Button className="vine-button-hero">
          <Plus className="h-4 w-4 mr-2" />
          Add New Novel
        </Button>
      </div>

      {/* Filters */}
      <Card className="vine-card">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search novels or writers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Novels List */}
      {loading ? (
        <div className="text-center py-8">Loading stories...</div>
      ) : (
        <div className="space-y-4">
          {filteredStories.length === 0 ? (
            <Card className="vine-card">
              <CardContent className="pt-6 pb-6 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No stories found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== "all" 
                    ? "Try adjusting your search or filters" 
                    : "No stories have been created yet"
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredStories.map((story) => (
              <Card key={story.id} className="vine-card">
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Cover Image */}
                    <div className="w-full lg:w-24 h-32 lg:h-32 bg-muted rounded-lg flex items-center justify-center">
                      {story.cover_image_url ? (
                        <img src={story.cover_image_url} alt={story.title} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <BookOpen className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>

                    {/* Novel Info */}
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-semibold">{story.title}</h3>
                            <Badge variant={getStatusColor(story.status) as any}>
                              {story.status}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground">
                            by {story.profiles?.display_name || story.profiles?.username || "Anonymous"}
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span>Category: {story.genre || "General"}</span>
                            <span>Reads: {story.view_count.toLocaleString()}</span>
                            <span>Likes: {story.like_count}</span>
                            <span>Comments: {story.comment_count}</span>
                            <span>Published: {new Date(story.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => onNavigate("chapters", story)}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            View Chapters
                          </Button>
                          
                          {story.status === "draft" && (
                            <>
                              <Button size="sm" variant="outline">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button size="sm" variant="outline">
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}

                          {story.status === "published" && (
                            <Button size="sm" variant="outline">
                              <Ban className="h-4 w-4 mr-1" />
                              Block
                            </Button>
                          )}

                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>

                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">
              {stories.filter(s => s.status === "published").length}
            </div>
            <div className="text-sm text-muted-foreground">Published Stories</div>
          </CardContent>
        </Card>
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-secondary-foreground">
              {stories.filter(s => s.status === "draft").length}
            </div>
            <div className="text-sm text-muted-foreground">Draft Stories</div>
          </CardContent>
        </Card>
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">
              {stories.filter(s => s.status === "archived").length}
            </div>
            <div className="text-sm text-muted-foreground">Archived</div>
          </CardContent>
        </Card>
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {stories.length}
            </div>
            <div className="text-sm text-muted-foreground">Total Stories</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}