import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
import { useReports } from '@/hooks/useReports'

interface ReportsModerationProps {
  onNavigate: (page: string, data?: any) => void
}

export function ReportsModeration({ onNavigate }: ReportsModerationProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { reports, loading, error, updateReportStatus } = useReports()

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (report.description && report.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || report.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "destructive"
      case "reviewed": return "secondary"
      case "resolved": return "default"
      default: return "outline"
    }
  }

  const getSeverityColor = (reason: string) => {
    // Determine severity based on reason
    const highSeverityReasons = ['harassment', 'hate-speech', 'violence', 'illegal-content']
    const isHighSeverity = highSeverityReasons.some(severe => reason.toLowerCase().includes(severe))
    return isHighSeverity ? "destructive" : "secondary"
  }

  const getTypeIcon = (reason: string) => {
    if (reason.toLowerCase().includes('comment')) return MessageSquare
    if (reason.toLowerCase().includes('novel') || reason.toLowerCase().includes('story')) return BookOpen
    if (reason.toLowerCase().includes('user')) return User
    return Flag
  }

  const handleStatusUpdate = async (reportId: string, newStatus: 'pending' | 'reviewed' | 'resolved') => {
    try {
      await updateReportStatus(reportId, newStatus)
    } catch (err) {
      console.error('Failed to update report status:', err)
    }
  }

  if (loading) {
    return <div className="space-y-8">
      <div className="text-center">Loading reports...</div>
    </div>
  }

  if (error) {
    return <div className="space-y-8">
      <div className="text-center text-destructive">Error: {error}</div>
    </div>
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
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report) => {
          const TypeIcon = getTypeIcon(report.reason)
          
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
                          <h3 className="text-lg font-semibold">Report: {report.reason}</h3>
                          <Badge variant={getStatusColor(report.status) as any}>
                            {report.status}
                          </Badge>
                          <Badge variant={getSeverityColor(report.reason) as any}>
                            {getSeverityColor(report.reason) === "destructive" ? "high priority" : "medium priority"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Reporter ID:</span>
                            <span className="ml-2 font-medium">{report.reporter_id}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Story ID:</span>
                            <span className="ml-2 font-medium">{report.story_id || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Reported:</span>
                            <span className="ml-2 font-medium">{new Date(report.created_at).toLocaleDateString()}</span>
                          </div>
                          {report.reviewed_at && (
                            <div>
                              <span className="text-muted-foreground">Reviewed:</span>
                              <span className="ml-2 font-medium">{new Date(report.reviewed_at).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                        {report.description && (
                          <div className="mt-3">
                            <p className="text-sm text-muted-foreground">
                              <strong>Description:</strong> {report.description}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Review Content
                        </Button>
                        
                        {report.status === "pending" && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleStatusUpdate(report.id, 'reviewed')}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Mark Reviewed
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleStatusUpdate(report.id, 'resolved')}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Resolve
                            </Button>
                          </>
                        )}
                        
                        {report.status === "reviewed" && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleStatusUpdate(report.id, 'resolved')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Moderation Notes */}
                    {report.status !== "pending" && (
                      <Card className="vine-card p-4 bg-muted/50">
                        <h4 className="font-semibold mb-2">Moderation Notes</h4>
                        <p className="text-sm text-muted-foreground">
                          {report.status === "resolved" 
                            ? "Report has been resolved by moderation team."
                            : "Report is under review by moderation team."
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
        
        {filteredReports.length === 0 && (
          <Card className="vine-card">
            <CardContent className="pt-6 text-center text-muted-foreground">
              No reports found matching your criteria.
            </CardContent>
          </Card>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">
              {reports.filter(r => r.status === "pending").length}
            </div>
            <div className="text-sm text-muted-foreground">Pending Reports</div>
          </CardContent>
        </Card>
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-secondary-foreground">
              {reports.filter(r => r.status === "reviewed").length}
            </div>
            <div className="text-sm text-muted-foreground">Under Review</div>
          </CardContent>
        </Card>
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {reports.filter(r => r.status === "resolved").length}
            </div>
            <div className="text-sm text-muted-foreground">Resolved</div>
          </CardContent>
        </Card>
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {reports.length}
            </div>
            <div className="text-sm text-muted-foreground">Total Reports</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}