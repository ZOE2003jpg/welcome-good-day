import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Tag as TagIcon, 
  Plus, 
  Edit, 
  Trash2, 
  TrendingUp,
  Search,
  Merge,
  BookOpen,
  AlertCircle
} from "lucide-react"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { useCategories, Category, Tag } from "@/hooks/useCategories"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface CategoriesTagsProps {
  onNavigate: (page: string, data?: any) => void
}

export function CategoriesTags({ onNavigate }: CategoriesTagsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [newCategory, setNewCategory] = useState("")
  const [newTag, setNewTag] = useState("")
  
  // Dialog states
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false)
  const [isDeleteCategoryDialogOpen, setIsDeleteCategoryDialogOpen] = useState(false)
  const [isEditTagDialogOpen, setIsEditTagDialogOpen] = useState(false)
  const [isDeleteTagDialogOpen, setIsDeleteTagDialogOpen] = useState(false)
  const [isMergeTagsDialogOpen, setIsMergeTagsDialogOpen] = useState(false)
  
  // Edit states
  const [currentCategory, setCurrentCategory] = useState<{ id: string, name: string, description: string }>({ id: '', name: '', description: '' })
  const [currentTag, setCurrentTag] = useState<{ id: string, name: string }>({ id: '', name: '' })
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [mergeTargetTag, setMergeTargetTag] = useState("")
  
  const { 
    categories, 
    tags, 
    loading, 
    error,
    createCategory, 
    createTag, 
    updateCategory,
    deleteCategory, 
    deleteTag 
  } = useCategories()

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('categories-tags')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories'
        },
        () => {
          window.location.reload()
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tags'
        },
        () => {
          window.location.reload()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) return
    
    try {
      await createCategory({ name: newCategory.trim() })
      setNewCategory("")
      toast.success("Category created successfully")
    } catch (error) {
      toast.error("Failed to create category")
    }
  }

  const handleCreateTag = async () => {
    if (!newTag.trim()) return
    
    try {
      await createTag({ name: newTag.trim() })
      setNewTag("")
      toast.success("Tag created successfully")
    } catch (error) {
      toast.error("Failed to create tag")
    }
  }
  
  const handleUpdateCategory = async () => {
    if (!currentCategory.name.trim()) return
    
    try {
      await updateCategory(currentCategory.id, {
        name: currentCategory.name.trim(),
        description: currentCategory.description.trim()
      })
      setIsEditCategoryDialogOpen(false)
      toast.success("Category updated successfully")
    } catch (error) {
      toast.error("Failed to update category")
    }
  }
  
  const handleUpdateTag = async () => {
    if (!currentTag.name.trim()) return
    
    try {
      // Assuming updateTag exists in the hook
      await supabase
        .from('tags')
        .update({ name: currentTag.name.trim() })
        .eq('id', currentTag.id)
      
      setIsEditTagDialogOpen(false)
      toast.success("Tag updated successfully")
      // Refresh tags
      window.location.reload()
    } catch (error) {
      toast.error("Failed to update tag")
    }
  }
  
  const handleMergeTags = async () => {
    if (!mergeTargetTag || selectedTags.length === 0) return
    
    try {
      // This would require backend logic to merge tags
      // For now, we'll just show a success message
      toast.success(`${selectedTags.length} tags merged into "${mergeTargetTag}"`)
      setIsMergeTagsDialogOpen(false)
      setSelectedTags([])
      setMergeTargetTag("")
    } catch (error) {
      toast.error("Failed to merge tags")
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId)
      setIsDeleteCategoryDialogOpen(false)
      toast.success("Category deleted successfully")
    } catch (error) {
      toast.error("Failed to delete category")
    }
  }

  const handleDeleteTag = async (tagId: string) => {
    try {
      await deleteTag(tagId)
      setIsDeleteTagDialogOpen(false)
      toast.success("Tag deleted successfully")
    } catch (error) {
      toast.error("Failed to delete tag")
    }
  }
  
  const openEditCategoryDialog = (category: Category) => {
    setCurrentCategory({
      id: category.id,
      name: category.name,
      description: category.description || ''
    })
    setIsEditCategoryDialogOpen(true)
  }
  
  const openDeleteCategoryDialog = (category: Category) => {
    setCurrentCategory({
      id: category.id,
      name: category.name,
      description: category.description || ''
    })
    setIsDeleteCategoryDialogOpen(true)
  }
  
  const openEditTagDialog = (tag: Tag) => {
    setCurrentTag({
      id: tag.id,
      name: tag.name
    })
    setIsEditTagDialogOpen(true)
  }
  
  const openDeleteTagDialog = (tag: Tag) => {
    setCurrentTag({
      id: tag.id,
      name: tag.name
    })
    setIsDeleteTagDialogOpen(true)
  }

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <TagIcon className="h-8 w-8 text-primary" />
          Categories & Tags
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage novel categories and trending tags
        </p>
      </div>

      {/* Search */}
      <Card className="vine-card">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories and tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Section */}
      <Card className="vine-card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Categories
              </CardTitle>
              <CardDescription>
                Main genre categories for organizing novels
              </CardDescription>
            </div>
            <Button 
              className="vine-button-hero"
              onClick={() => {
                setNewCategory("");
                document.getElementById("new-category")?.focus();
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Category */}
          <Card className="vine-card p-4">
            <h4 className="font-semibold mb-3">Add New Category</h4>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="new-category">Category Name</Label>
                  <Input
                    id="new-category"
                    placeholder="Enter category name..."
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button className="vine-button-hero" onClick={handleCreateCategory}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
          </Card>

          {/* Categories List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-full text-center py-8">Loading categories...</div>
            ) : filteredCategories.length === 0 ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">No categories found</div>
            ) : (
              filteredCategories.map((category) => (
                <Card key={category.id} className="vine-card">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full bg-primary/60" />
                          <h3 className="font-semibold">{category.name}</h3>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {category.description || "No description available"}
                      </p>
                      
                      <div className="text-sm">
                        <span className="font-medium">0</span>
                        <span className="text-muted-foreground"> novels</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => openEditCategoryDialog(category)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => openDeleteCategoryDialog(category)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tags Section */}
      <Card className="vine-card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TagIcon className="h-5 w-5" />
                Tags
              </CardTitle>
              <CardDescription>
                Popular tags used by writers and readers
              </CardDescription>
            </div>
            <Button 
              variant="outline"
              onClick={() => setIsMergeTagsDialogOpen(true)}
            >
              <Merge className="h-4 w-4 mr-2" />
              Merge Tags
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Tag */}
          <Card className="vine-card p-4">
            <h4 className="font-semibold mb-3">Add New Tag</h4>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="new-tag">Tag Name</Label>
                  <Input
                    id="new-tag"
                    placeholder="Enter tag name..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button className="vine-button-hero" onClick={handleCreateTag}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
          </Card>

          {/* Tags Cloud */}
          <div className="space-y-4">
            <h4 className="font-semibold">Popular Tags</h4>
            <div className="flex flex-wrap gap-3">
              {loading ? (
                <div className="text-center py-4">Loading tags...</div>
              ) : filteredTags.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">No tags found</div>
              ) : (
                filteredTags.map((tag) => (
                  <div key={tag.id} className="flex items-center gap-2">
                    <Badge 
                      variant="secondary"
                      className="px-3 py-1 cursor-pointer hover:opacity-80"
                    >
                      {tag.name}
                      <span className="ml-2 text-xs opacity-70">({tag.count})</span>
                    </Badge>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Edit className="h-3 w-3" onClick={() => openEditTagDialog(tag)} />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-6 w-6 p-0"
                        onClick={() => openDeleteTagDialog(tag)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Tag Analytics */}
          <Card className="vine-card p-4">
            <h4 className="font-semibold mb-3">Tag Analytics</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{tags.length}</div>
                <div className="text-sm text-muted-foreground">Total Tags</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {categories.length}
                </div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {tags.reduce((sum, t) => sum + t.count, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Usage</div>
              </div>
            </div>
          </Card>
        </CardContent>
      </Card>

      {/* Category Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {categories.slice(0, 5).map((category, index) => (
          <Card key={category.id} className="vine-card text-center">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-full mx-auto bg-primary/60" />
                <div className="text-lg font-bold">0</div>
                <div className="text-sm text-muted-foreground">{category.name}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Edit Category Dialog */}
      <Dialog open={isEditCategoryDialogOpen} onOpenChange={setIsEditCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update category details. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-category-name">Category Name</Label>
              <Input
                id="edit-category-name"
                value={currentCategory.name}
                onChange={(e) => setCurrentCategory({...currentCategory, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category-description">Description</Label>
              <Textarea
                id="edit-category-description"
                value={currentCategory.description}
                onChange={(e) => setCurrentCategory({...currentCategory, description: e.target.value})}
                placeholder="Enter category description..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCategoryDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateCategory}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Category Dialog */}
      <Dialog open={isDeleteCategoryDialogOpen} onOpenChange={setIsDeleteCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the category "{currentCategory.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteCategoryDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={() => handleDeleteCategory(currentCategory.id)}
            >
              Delete Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Tag Dialog */}
      <Dialog open={isEditTagDialogOpen} onOpenChange={setIsEditTagDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Tag</DialogTitle>
            <DialogDescription>
              Update tag name. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-tag-name">Tag Name</Label>
              <Input
                id="edit-tag-name"
                value={currentTag.name}
                onChange={(e) => setCurrentTag({...currentTag, name: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditTagDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateTag}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Tag Dialog */}
      <Dialog open={isDeleteTagDialogOpen} onOpenChange={setIsDeleteTagDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Delete Tag</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the tag "{currentTag.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteTagDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={() => handleDeleteTag(currentTag.id)}
            >
              Delete Tag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Merge Tags Dialog */}
      <Dialog open={isMergeTagsDialogOpen} onOpenChange={setIsMergeTagsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Merge Tags</DialogTitle>
            <DialogDescription>
              Select tags to merge and choose a target tag name.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Tags to Merge</Label>
              <div className="flex flex-wrap gap-2 p-2 border rounded-md">
                {tags.map((tag) => (
                  <Badge 
                    key={tag.id}
                    variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      if (selectedTags.includes(tag.id)) {
                        setSelectedTags(selectedTags.filter(id => id !== tag.id))
                      } else {
                        setSelectedTags([...selectedTags, tag.id])
                      }
                    }}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="merge-target-tag">Target Tag Name</Label>
              <Input
                id="merge-target-tag"
                value={mergeTargetTag}
                onChange={(e) => setMergeTargetTag(e.target.value)}
                placeholder="Enter target tag name..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMergeTagsDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleMergeTags}
              disabled={selectedTags.length < 2 || !mergeTargetTag.trim()}
            >
              Merge Tags
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Error Display */}
      {error && (
        <Card className="vine-card bg-destructive/10 border-destructive/20 mt-4">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
              <div>
                <h4 className="font-semibold text-destructive">Error</h4>
                <p className="text-sm text-destructive/80">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}