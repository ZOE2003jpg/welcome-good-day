import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  FileText, 
  Edit, 
  Trash2, 
  Eye, 
  Lock, 
  Unlock,
  ArrowLeft,
  Search,
  Plus
} from "lucide-react"

interface ChapterManagerProps {
  novel?: any
  onNavigate: (page: string, data?: any) => void
}

export function ChapterManager({ novel, onNavigate }: ChapterManagerProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const mockChapters = [
    {
      id: 1,
      title: "The Beginning",
      description: "Our hero starts their journey",
      wordCount: 2400,
      slideCount: 6,
      status: "published",
      publishDate: "Jan 15, 2024",
      reads: 15000,
      likes: 450
    },
    {
      id: 2,
      title: "First Challenge",
      description: "Obstacles arise in the digital world",
      wordCount: 3200,
      slideCount: 8,
      status: "published",
      publishDate: "Jan 22, 2024",
      reads: 12000,
      likes: 380
    },
    {
      id: 3,
      title: "New Allies",
      description: "Meeting friends and forming bonds",
      wordCount: 2800,
      slideCount: 7,
      status: "draft",
      publishDate: null,
      reads: 0,
      likes: 0
    },
    {
      id: 4,
      title: "The Revelation",
      description: "A shocking discovery changes everything",
      wordCount: 4000,
      slideCount: 10,
      status: "locked",
      publishDate: "Feb 1, 2024",
      reads: 8000,
      likes: 520
    }
  ]

  const filteredChapters = mockChapters.filter(chapter =>
    chapter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chapter.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "default"
      case "draft": return "secondary"
      case "locked": return "destructive"
      default: return "outline"
    }
  }

  const currentNovel = novel || {
    title: "Digital Awakening",
    writer: "Sarah Chen",
    category: "Sci-Fi"
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <Button 
            variant="ghost" 
            onClick={() => onNavigate("novels")}
            className="mb-4 p-0 h-auto font-normal text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Novels
          </Button>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            Chapter Manager
          </h1>
          <p className="text-muted-foreground mt-2">
            Managing chapters for "{currentNovel.title}" by {currentNovel.writer}
          </p>
        </div>
        <Button className="vine-button-hero">
          <Plus className="h-4 w-4 mr-2" />
          Add New Chapter
        </Button>
      </div>

      {/* Novel Info */}
      <Card className="vine-card">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">{currentNovel.title}</h3>
              <p className="text-muted-foreground">
                {currentNovel.category} • by {currentNovel.writer}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview Novel
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Novel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <Card className="vine-card">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search chapters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Chapters List */}
      <div className="space-y-4">
        {filteredChapters.map((chapter, index) => (
          <Card key={chapter.id} className="vine-card">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Chapter Number */}
                <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-lg">
                  <span className="text-xl font-bold text-primary">{index + 1}</span>
                </div>

                {/* Chapter Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-semibold">{chapter.title}</h3>
                        <Badge variant={getStatusColor(chapter.status) as any}>
                          {chapter.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">{chapter.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span>Words: {chapter.wordCount.toLocaleString()}</span>
                        <span>Slides: {chapter.slideCount}</span>
                        {chapter.publishDate && (
                          <span>Published: {chapter.publishDate}</span>
                        )}
                        <span>Reads: {chapter.reads.toLocaleString()}</span>
                        <span>Likes: {chapter.likes}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View Slides
                      </Button>
                      
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit Chapter
                      </Button>

                      {chapter.status === "locked" ? (
                        <Button size="sm" variant="outline">
                          <Unlock className="h-4 w-4 mr-1" />
                          Unlock
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline">
                          <Lock className="h-4 w-4 mr-1" />
                          Lock
                        </Button>
                      )}

                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chapter Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">
              {mockChapters.filter(c => c.status === "published").length}
            </div>
            <div className="text-sm text-muted-foreground">Published</div>
          </CardContent>
        </Card>
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-secondary-foreground">
              {mockChapters.filter(c => c.status === "draft").length}
            </div>
            <div className="text-sm text-muted-foreground">Drafts</div>
          </CardContent>
        </Card>
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {mockChapters.reduce((sum, c) => sum + c.wordCount, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Words</div>
          </CardContent>
        </Card>
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {mockChapters.reduce((sum, c) => sum + c.slideCount, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Slides</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}