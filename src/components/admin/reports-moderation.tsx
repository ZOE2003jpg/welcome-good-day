import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Flag, 
  Eye, 
  CheckCircle, 
  X, 
  AlertTriangle,
  Search,
  MessageSquare,
  BookOpen,
  User
} from "lucide-react"

interface ReportsModerationProps {
  onNavigate: (page: string, data?: any) => void
}

export function ReportsModeration({ onNavigate }: ReportsModerationProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const mockReports = [
    {
      id: 1,
      title: "Inappropriate Content in Chapter 3",
      type: "novel",
      contentId: "novel_123",
      contentTitle: "Digital Awakening - Chapter 3",
      author: "Sarah Chen",
      reporter: "User123",
      reporterEmail: "user123@example.com",
      reason: "Inappropriate content",
      description: "This chapter contains explicit content that violates community guidelines.",
      status: "pending",
      date: "2 hours ago",
      severity: "high"
    },
    {
      id: 2,
      title: "Spam Comment on Novel",
      type: "comment",
      contentId: "comment_456",
      contentTitle: "Comment on 'Love in Code'",
      author: "John Doe",
      reporter: "BookLover",
      reporterEmail: "booklover@example.com",
      reason: "Spam",
      description: "User is posting the same promotional comment on multiple novels.",
      status: "pending",
      date: "5 hours ago",
      severity: "medium"
    },
    {
      id: 3,
      title: "Plagiarism Report",
      type: "novel",
      contentId: "novel_789",
      contentTitle: "Midnight Chronicles",
      author: "Alice Wang",
      reporter: "WriterGuard",
      reporterEmail: "writerguard@example.com",
      reason: "Plagiarism",
      description: "This novel appears to be copied from another published work.",
      status: "reviewed",
      date: "1 day ago",
      severity: "high"
    },
    {
      id: 4,
      title: "Harassment in Comments",
      type: "comment",
      contentId: "comment_321",
      contentTitle: "Comment thread on 'Future Past'",
      author: "TrollUser",
      reporter: "SafeReader",
      reporterEmail: "safereader@example.com",
      reason: "Harassment",
      description: "User is making personal attacks against other readers.",
      status: "resolved",
      date: "3 days ago",
      severity: "high"
    }
  ]

  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.contentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || report.status === statusFilter
    const matchesType = typeFilter === "all" || report.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "destructive"
      case "reviewed": return "secondary"
      case "resolved": return "default"
      default: return "outline"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "destructive"
      case "medium": return "secondary"
      case "low": return "outline"
      default: return "outline"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "novel": return BookOpen
      case "comment": return MessageSquare
      case "user": return User
      default: return Flag
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Flag className="h-8 w-8 text-primary" />
          Reports & Moderation
        </h1>
        <p className="text-muted-foreground mt-2">
          Review flagged content and moderate community violations
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
                  placeholder="Search reports..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="novel">Novels</SelectItem>
                <SelectItem value="comment">Comments</SelectItem>
                <SelectItem value="user">Users</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report) => {
          const TypeIcon = getTypeIcon(report.type)
          
          return (
            <Card key={report.id} className="vine-card">
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Report Icon */}
                  <div className="w-16 h-16 bg-destructive/10 rounded-lg flex items-center justify-center">
                    <TypeIcon className="h-8 w-8 text-destructive" />
                  </div>

                  {/* Report Info */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-lg font-semibold">{report.title}</h3>
                          <Badge variant={getStatusColor(report.status) as any}>
                            {report.status}
                          </Badge>
                          <Badge variant={getSeverityColor(report.severity) as any}>
                            {report.severity} priority
                          </Badge>
                          <Badge variant="outline">
                            {report.type}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">{report.contentTitle}</p>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Author:</span>
                            <span className="ml-2 font-medium">{report.author}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Reporter:</span>
                            <span className="ml-2 font-medium">{report.reporter}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Reason:</span>
                            <span className="ml-2 font-medium">{report.reason}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Reported:</span>
                            <span className="ml-2 font-medium">{report.date}</span>
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="text-sm text-muted-foreground">
                            <strong>Description:</strong> {report.description}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Review Content
                        </Button>
                        
                        {report.status === "pending" && (
                          <>
                            <Button size="sm" variant="outline">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button size="sm" variant="outline">
                              <X className="h-4 w-4 mr-1" />
                              Delete Content
                            </Button>
                            <Button size="sm" variant="outline">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              Warn Author
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Moderation Notes */}
                    {report.status !== "pending" && (
                      <Card className="vine-card p-4 bg-muted/50">
                        <h4 className="font-semibold mb-2">Moderation Notes</h4>
                        <p className="text-sm text-muted-foreground">
                          {report.status === "resolved" 
                            ? "Content removed and user warned. Additional reports may result in account suspension."
                            : "Under review by moderation team. Awaiting final decision."
                          }
                        </p>
                      </Card>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">
              {mockReports.filter(r => r.status === "pending").length}
            </div>
            <div className="text-sm text-muted-foreground">Pending Reports</div>
          </CardContent>
        </Card>
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-secondary-foreground">
              {mockReports.filter(r => r.status === "reviewed").length}
            </div>
            <div className="text-sm text-muted-foreground">Under Review</div>
          </CardContent>
        </Card>
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {mockReports.filter(r => r.status === "resolved").length}
            </div>
            <div className="text-sm text-muted-foreground">Resolved</div>
          </CardContent>
        </Card>
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">
              {mockReports.filter(r => r.severity === "high").length}
            </div>
            <div className="text-sm text-muted-foreground">High Priority</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}