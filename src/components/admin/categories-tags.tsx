import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Tag, 
  Plus, 
  Edit, 
  Trash2, 
  TrendingUp,
  Search,
  Merge,
  BookOpen
} from "lucide-react"

interface CategoriesTagsProps {
  onNavigate: (page: string, data?: any) => void
}

export function CategoriesTags({ onNavigate }: CategoriesTagsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [newCategory, setNewCategory] = useState("")
  const [newTag, setNewTag] = useState("")

  const mockCategories = [
    {
      id: 1,
      name: "Romance",
      description: "Love stories and romantic relationships",
      novelCount: 1250,
      color: "#FF6B9D",
      trending: true
    },
    {
      id: 2,
      name: "Sci-Fi",
      description: "Science fiction and futuristic stories",
      novelCount: 890,
      color: "#4ECDC4",
      trending: true
    },
    {
      id: 3,
      name: "Fantasy",
      description: "Magical worlds and mythical creatures",
      novelCount: 1100,
      color: "#A8E6CF",
      trending: false
    },
    {
      id: 4,
      name: "Mystery",
      description: "Crime, detective, and suspense stories",
      novelCount: 650,
      color: "#C7CEEA",
      trending: false
    },
    {
      id: 5,
      name: "Drama",
      description: "Emotional and character-driven narratives",
      novelCount: 780,
      color: "#FFD93D",
      trending: true
    }
  ]

  const mockTags = [
    { id: 1, name: "enemies-to-lovers", count: 245, trending: true },
    { id: 2, name: "time-travel", count: 189, trending: true },
    { id: 3, name: "magic-academy", count: 156, trending: false },
    { id: 4, name: "office-romance", count: 134, trending: true },
    { id: 5, name: "cyberpunk", count: 112, trending: false },
    { id: 6, name: "vampire", count: 98, trending: false },
    { id: 7, name: "slow-burn", count: 87, trending: true },
    { id: 8, name: "dystopian", count: 76, trending: false },
    { id: 9, name: "royal-fantasy", count: 65, trending: false },
    { id: 10, name: "workplace", count: 54, trending: false }
  ]

  const filteredCategories = mockCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredTags = mockTags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Tag className="h-8 w-8 text-primary" />
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
            <Button className="vine-button-hero">
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
                <Button className="vine-button-hero">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
          </Card>

          {/* Categories List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCategories.map((category) => (
              <Card key={category.id} className="vine-card">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <h3 className="font-semibold">{category.name}</h3>
                        {category.trending && (
                          <Badge variant="outline" className="text-xs">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                    
                    <div className="text-sm">
                      <span className="font-medium">{category.novelCount}</span>
                      <span className="text-muted-foreground"> novels</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tags Section */}
      <Card className="vine-card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Tags
              </CardTitle>
              <CardDescription>
                Popular tags used by writers and readers
              </CardDescription>
            </div>
            <Button variant="outline">
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
                <Button className="vine-button-hero">
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
              {filteredTags.map((tag) => (
                <div key={tag.id} className="flex items-center gap-2">
                  <Badge 
                    variant={tag.trending ? "default" : "secondary"}
                    className="px-3 py-1 cursor-pointer hover:opacity-80"
                  >
                    {tag.trending && <TrendingUp className="h-3 w-3 mr-1" />}
                    {tag.name}
                    <span className="ml-2 text-xs opacity-70">({tag.count})</span>
                  </Badge>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tag Analytics */}
          <Card className="vine-card p-4">
            <h4 className="font-semibold mb-3">Tag Analytics</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{mockTags.length}</div>
                <div className="text-sm text-muted-foreground">Total Tags</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {mockTags.filter(t => t.trending).length}
                </div>
                <div className="text-sm text-muted-foreground">Trending Tags</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {mockTags.reduce((sum, t) => sum + t.count, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Usage</div>
              </div>
            </div>
          </Card>
        </CardContent>
      </Card>

      {/* Category Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {mockCategories.map((category) => (
          <Card key={category.id} className="vine-card text-center">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div 
                  className="w-8 h-8 rounded-full mx-auto"
                  style={{ backgroundColor: category.color }}
                />
                <div className="text-lg font-bold">{category.novelCount}</div>
                <div className="text-sm text-muted-foreground">{category.name}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}