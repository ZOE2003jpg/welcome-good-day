import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

  const mockNovels = [
    {
      id: 1,
      title: "Digital Awakening",
      writer: "Sarah Chen",
      category: "Sci-Fi",
      status: "active",
      chapters: 12,
      reads: 45000,
      rating: 4.8,
      publishDate: "Jan 15, 2024",
      cover: "/placeholder.svg"
    },
    {
      id: 2,
      title: "Midnight Chronicles",
      writer: "John Doe",
      category: "Fantasy",
      status: "pending",
      chapters: 8,
      reads: 12000,
      rating: 4.2,
      publishDate: "Feb 3, 2024",
      cover: "/placeholder.svg"
    },
    {
      id: 3,
      title: "Love in Code",
      writer: "Alice Wang",
      category: "Romance",
      status: "banned",
      chapters: 15,
      reads: 28000,
      rating: 4.6,
      publishDate: "Dec 20, 2023",
      cover: "/placeholder.svg"
    },
    {
      id: 4,
      title: "The Last Writer",
      writer: "Michael Brown",
      category: "Drama",
      status: "active",
      chapters: 20,
      reads: 35000,
      rating: 4.5,
      publishDate: "Nov 10, 2023",
      cover: "/placeholder.svg"
    }
  ]

  const filteredNovels = mockNovels.filter(novel => {
    const matchesSearch = novel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         novel.writer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || novel.status === statusFilter
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
      <div className="space-y-4">
        {filteredNovels.map((novel) => (
          <Card key={novel.id} className="vine-card">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Cover Image */}
                <div className="w-full lg:w-24 h-32 lg:h-32 bg-muted rounded-lg flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                </div>

                {/* Novel Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-semibold">{novel.title}</h3>
                        <Badge variant={getStatusColor(novel.status) as any}>
                          {novel.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">by {novel.writer}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span>Category: {novel.category}</span>
                        <span>Chapters: {novel.chapters}</span>
                        <span>Reads: {novel.reads.toLocaleString()}</span>
                        <span>Rating: {novel.rating}/5</span>
                        <span>Published: {novel.publishDate}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onNavigate("chapters", novel)}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        View Chapters
                      </Button>
                      
                      {novel.status === "pending" && (
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

                      {novel.status === "active" && (
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
        ))}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">
              {mockNovels.filter(n => n.status === "active").length}
            </div>
            <div className="text-sm text-muted-foreground">Active Novels</div>
          </CardContent>
        </Card>
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-secondary-foreground">
              {mockNovels.filter(n => n.status === "pending").length}
            </div>
            <div className="text-sm text-muted-foreground">Pending Approval</div>
          </CardContent>
        </Card>
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">
              {mockNovels.filter(n => n.status === "banned").length}
            </div>
            <div className="text-sm text-muted-foreground">Banned</div>
          </CardContent>
        </Card>
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {mockNovels.reduce((sum, n) => sum + n.chapters, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Chapters</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}