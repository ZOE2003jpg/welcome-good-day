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
import { useChapters } from "@/hooks/useChapters"
import { useStories } from "@/hooks/useStories"

interface ChapterManagerProps {
  novel?: any
  onNavigate: (page: string, data?: any) => void
}

export function ChapterManager({ novel, onNavigate }: ChapterManagerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const { stories } = useStories()
  const story = novel || (stories.length > 0 ? stories[0] : null)
  const { chapters, loading, updateChapter, deleteChapter } = useChapters(story?.id)

  const filteredChapters = chapters.filter(chapter =>
    chapter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (chapter.content && chapter.content.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "default"
      case "draft": return "secondary"
      default: return "outline"
    }
  }

  const currentNovel = story || {
    title: "Select a Story",
    author_id: "Unknown",
    genre: "Unknown"
  }

  if (loading) {
    return <div className="space-y-8">
      <div className="text-center">Loading chapters...</div>
    </div>
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
                {currentNovel.genre} • Story ID: {currentNovel.id}
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
                  <span className="text-xl font-bold text-primary">{chapter.chapter_number}</span>
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
                      <p className="text-muted-foreground">
                        {chapter.content ? chapter.content.substring(0, 100) + '...' : 'No content'}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span>Words: {(chapter as any).word_count || 0}</span>
                        <span>Slides: {(chapter as any).slide_count || 0}</span>
                        <span>Created: {new Date(chapter.created_at).toLocaleDateString()}</span>
                        <span>Views: {chapter.view_count || 0}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onNavigate("slide-reader", { chapterId: chapter.id })}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Slides
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onNavigate("add-chapter", { chapterId: chapter.id })}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit Chapter
                      </Button>

                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => deleteChapter(chapter.id)}
                      >
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
        
        {filteredChapters.length === 0 && (
          <Card className="vine-card">
            <CardContent className="pt-6 text-center text-muted-foreground">
              No chapters found for this story.
            </CardContent>
          </Card>
        )}
      </div>

      {/* Chapter Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">
              {chapters.filter(c => c.status === "published").length}
            </div>
            <div className="text-sm text-muted-foreground">Published</div>
          </CardContent>
        </Card>
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-secondary-foreground">
              {chapters.filter(c => c.status === "draft").length}
            </div>
            <div className="text-sm text-muted-foreground">Drafts</div>
          </CardContent>
        </Card>
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {chapters.reduce((sum, c) => sum + ((c as any).word_count || 0), 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Words</div>
          </CardContent>
        </Card>
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {chapters.reduce((sum, c) => sum + ((c as any).slide_count || 0), 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Slides</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}