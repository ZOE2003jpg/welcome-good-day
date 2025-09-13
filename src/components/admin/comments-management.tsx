import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  MessageSquare, 
  Eye, 
  CheckCircle, 
  Trash2, 
  Ban,
  Search,
  Calendar,
  User,
  BookOpen
} from "lucide-react"

interface CommentsManagementProps {
  onNavigate: (page: string, data?: any) => void
}

export function CommentsManagement({ onNavigate }: CommentsManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  const mockComments = [
    {
      id: 1,
      content: "This chapter was absolutely amazing! The character development is incredible and I can't wait to see what happens next. The plot twist at the end completely caught me off guard!",
      author: "BookLover123",
      authorEmail: "booklover@example.com",
      novel: "Digital Awakening",
      chapter: "Chapter 3: The Revelation",
      status: "approved",
      date: "2 hours ago",
      likes: 15,
      reports: 0,
      novelAuthor: "Sarah Chen"
    },
    {
      id: 2,
      content: "Check out my novel at example.com - it's much better than this garbage!",
      author: "SpamUser",
      authorEmail: "spamuser@example.com",
      novel: "Love in Code",
      chapter: "Chapter 1: First Meeting",
      status: "flagged",
      date: "5 hours ago",
      likes: 0,
      reports: 3,
      novelAuthor: "Alice Wang"
    },
    {
      id: 3,
      content: "The writing style reminds me of my favorite classic novels. Really enjoying the pacing and character interactions.",
      author: "ClassicReader",
      authorEmail: "classic@example.com",
      novel: "Midnight Chronicles",
      chapter: "Chapter 5: New Allies",
      status: "approved",
      date: "1 day ago",
      likes: 8,
      reports: 0,
      novelAuthor: "John Doe"
    },
    {
      id: 4,
      content: "You're all idiots for reading this trash. The author doesn't know how to write.",
      author: "ToxicUser",
      authorEmail: "toxic@example.com",
      novel: "Future Past",
      chapter: "Chapter 2: Time Paradox",
      status: "hidden",
      date: "2 days ago",
      likes: 0,
      reports: 5,
      novelAuthor: "Michael Brown"
    }
  ]

  const filteredComments = mockComments.filter(comment => {
    const matchesSearch = comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.novel.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || comment.status === statusFilter
    
    let matchesDate = true
    if (dateFilter === "today") {
      matchesDate = comment.date.includes("hours ago") || comment.date.includes("minutes ago")
    } else if (dateFilter === "week") {
      matchesDate = comment.date.includes("day") || comment.date.includes("hours ago")
    }
    
    return matchesSearch && matchesStatus && matchesDate
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "default"
      case "flagged": return "destructive"
      case "hidden": return "secondary"
      default: return "outline"
    }
  }

  const truncateContent = (content: string, maxLength: number = 150) => {
    return content.length > maxLength ? content.substring(0, maxLength) + "..." : content
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <MessageSquare className="h-8 w-8 text-primary" />
          Comments Management
        </h1>
        <p className="text-muted-foreground mt-2">
          Monitor and moderate comments across all novels
        </p>
      </div>

      {/* Filters */}
      <Card className="vine-card">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search comments, users, or novels..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        {filteredComments.map((comment) => (
          <Card key={comment.id} className="vine-card">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* User Avatar */}
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>

                {/* Comment Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-semibold">{comment.author}</h3>
                        <Badge variant={getStatusColor(comment.status) as any}>
                          {comment.status}
                        </Badge>
                        {comment.reports > 0 && (
                          <Badge variant="destructive">
                            {comment.reports} reports
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          <span>{comment.novel} → {comment.chapter}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{comment.date}</span>
                        </div>
                        <div>
                          <span>by {comment.novelAuthor}</span>
                        </div>
                      </div>

                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-sm">
                          {truncateContent(comment.content)}
                        </p>
                      </div>

                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>Likes: {comment.likes}</span>
                        <span>Email: {comment.authorEmail}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View Full
                      </Button>
                      
                      {comment.status === "flagged" && (
                        <>
                          <Button size="sm" variant="outline">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </>
                      )}

                      {comment.status === "approved" && (
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Hide
                        </Button>
                      )}

                      <Button size="sm" variant="outline">
                        <Ban className="h-4 w-4 mr-1" />
                        Block User
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
              {mockComments.filter(c => c.status === "approved").length}
            </div>
            <div className="text-sm text-muted-foreground">Approved Comments</div>
          </CardContent>
        </Card>
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">
              {mockComments.filter(c => c.status === "flagged").length}
            </div>
            <div className="text-sm text-muted-foreground">Flagged Comments</div>
          </CardContent>
        </Card>
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-secondary-foreground">
              {mockComments.filter(c => c.status === "hidden").length}
            </div>
            <div className="text-sm text-muted-foreground">Hidden Comments</div>
          </CardContent>
        </Card>
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {mockComments.reduce((sum, c) => sum + c.reports, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Reports</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}