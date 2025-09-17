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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

interface ChapterManagerProps {
  novel?: any
  onNavigate: (page: string, data?: any) => void
}

export function ChapterManager({ novel, onNavigate }: ChapterManagerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentChapter, setCurrentChapter] = useState<any>(null)
  const [newChapterData, setNewChapterData] = useState({
    title: "",
    content: "",
    chapter_number: 1
  })
  
  const { stories } = useStories()
  const story = novel || (stories.length > 0 ? stories[0] : null)
  const { chapters, loading, createChapter, updateChapter, deleteChapter, publishChapter } = useChapters(story?.id)

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

  const handleAddChapter = async () => {
    if (!story?.id) {
      toast({
        title: "Error",
        description: "Please select a story first",
        variant: "destructive"
      })
      return
    }
    
    try {
      await createChapter({
        story_id: story.id,
        title: newChapterData.title,
        content: newChapterData.content,
        chapter_number: newChapterData.chapter_number
      })
      
      setIsAddDialogOpen(false)
      setNewChapterData({
        title: "",
        content: "",
        chapter_number: chapters.length + 1
      })
      
      toast({
        title: "Success",
        description: "Chapter created successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create chapter",
        variant: "destructive"
      })
    }
  }
  
  const handleEditChapter = async () => {
    if (!currentChapter) return
    
    try {
      await updateChapter(currentChapter.id, {
        title: currentChapter.title,
        content: currentChapter.content
      })
      
      setIsEditDialogOpen(false)
      setCurrentChapter(null)
      
      toast({
        title: "Success",
        description: "Chapter updated successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update chapter",
        variant: "destructive"
      })
    }
  }
  
  const handleDeleteChapter = async () => {
    if (!currentChapter) return
    
    try {
      await deleteChapter(currentChapter.id)
      
      setIsDeleteDialogOpen(false)
      setCurrentChapter(null)
      
      toast({
        title: "Success",
        description: "Chapter deleted successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete chapter",
        variant: "destructive"
      })
    }
  }
  
  const handleTogglePublish = async (chapter: any) => {
    try {
      if (chapter.status === 'draft') {
        await publishChapter(chapter.id)
      } else {
        await updateChapter(chapter.id, { status: 'draft' })
      }
      
      toast({
        title: "Success",
        description: `Chapter ${chapter.status === 'draft' ? 'published' : 'unpublished'} successfully`
      })
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${chapter.status === 'draft' ? 'publish' : 'unpublish'} chapter`,
        variant: "destructive"
      })
    }
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
            Managing chapters for "{currentNovel.title}" by {currentNovel.author_name || "Unknown Author"}
          </p>
        </div>
        <Button 
          className="vine-button-hero"
          onClick={() => {
            setNewChapterData({
              title: "",
              content: "",
              chapter_number: chapters.length + 1
            })
            setIsAddDialogOpen(true)
          }}
        >
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
                {currentNovel.genre || "Unknown Genre"} • Story ID: {currentNovel.id || "N/A"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onNavigate("reader", { storyId: currentNovel.id })}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview Novel
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onNavigate("novels", { editStory: currentNovel })}
              >
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
        {filteredChapters.length === 0 && !loading && (
          <Card className="vine-card">
            <CardContent className="pt-6 text-center py-12">
              <p className="text-muted-foreground">No chapters found. Create your first chapter!</p>
            </CardContent>
          </Card>
        )}
        
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
                        <span>Words: {chapter.content ? chapter.content.split(/\s+/).length : 0}</span>
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
                        onClick={() => {
                          setCurrentChapter(chapter)
                          setIsDeleteDialogOpen(true)
                        }}
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

      {/* Add Chapter Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Chapter</DialogTitle>
            <DialogDescription>
              Create a new chapter for "{currentNovel.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title">Chapter Title</label>
              <Input
                id="title"
                value={newChapterData.title}
                onChange={(e) => setNewChapterData({...newChapterData, title: e.target.value})}
                placeholder="Enter chapter title"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="chapter_number">Chapter Number</label>
              <Input
                id="chapter_number"
                type="number"
                value={newChapterData.chapter_number}
                onChange={(e) => setNewChapterData({...newChapterData, chapter_number: parseInt(e.target.value)})}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="content">Content</label>
              <Textarea
                id="content"
                value={newChapterData.content}
                onChange={(e) => setNewChapterData({...newChapterData, content: e.target.value})}
                placeholder="Enter chapter content"
                rows={10}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddChapter}>Create Chapter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Chapter Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Chapter</DialogTitle>
            <DialogDescription>
              Edit chapter details
            </DialogDescription>
          </DialogHeader>
          {currentChapter && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="edit-title">Chapter Title</label>
                <Input
                  id="edit-title"
                  value={currentChapter.title}
                  onChange={(e) => setCurrentChapter({...currentChapter, title: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="edit-content">Content</label>
                <Textarea
                  id="edit-content"
                  value={currentChapter.content}
                  onChange={(e) => setCurrentChapter({...currentChapter, content: e.target.value})}
                  rows={10}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditChapter}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Chapter Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Chapter</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this chapter? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteChapter}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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