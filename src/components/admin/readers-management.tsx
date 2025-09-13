import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Users, 
  Eye, 
  Ban, 
  UserCheck,
  Search,
  Flag,
  BookOpen,
  Clock
} from "lucide-react"

interface ReadersManagementProps {
  onNavigate: (page: string, data?: any) => void
}

export function ReadersManagement({ onNavigate }: ReadersManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const mockReaders = [
    {
      id: 1,
      name: "Emma Wilson",
      email: "emma@example.com",
      status: "active",
      joinDate: "Jan 15, 2024",
      novelsRead: 45,
      timeSpent: "120 hours",
      favoriteGenre: "Romance",
      lastActive: "2 hours ago",
      reports: 0,
      comments: 150
    },
    {
      id: 2,
      name: "David Johnson",
      email: "david@example.com",
      status: "active",
      joinDate: "Feb 3, 2024",
      novelsRead: 28,
      timeSpent: "85 hours",
      favoriteGenre: "Sci-Fi",
      lastActive: "1 day ago",
      reports: 1,
      comments: 89
    },
    {
      id: 3,
      name: "Lisa Brown",
      email: "lisa@example.com",
      status: "suspended",
      joinDate: "Dec 20, 2023",
      novelsRead: 67,
      timeSpent: "200 hours",
      favoriteGenre: "Fantasy",
      lastActive: "5 days ago",
      reports: 3,
      comments: 245
    },
    {
      id: 4,
      name: "Robert Davis",
      email: "robert@example.com",
      status: "active",
      joinDate: "Nov 10, 2023",
      novelsRead: 89,
      timeSpent: "300 hours",
      favoriteGenre: "Mystery",
      lastActive: "30 minutes ago",
      reports: 0,
      comments: 420
    }
  ]

  const filteredReaders = mockReaders.filter(reader => {
    const matchesSearch = reader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reader.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || reader.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "default"
      case "suspended": return "destructive"
      default: return "outline"
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          Readers Management
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage reader accounts, activity, and platform access
        </p>
      </div>

      {/* Filters */}
      <Card className="vine-card">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search readers by name or email..."
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
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Readers List */}
      <div className="space-y-4">
        {filteredReaders.map((reader) => (
          <Card key={reader.id} className="vine-card">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Avatar */}
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
                </div>

                {/* Reader Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-semibold">{reader.name}</h3>
                        <Badge variant={getStatusColor(reader.status) as any}>
                          {reader.status}
                        </Badge>
                        {reader.reports > 0 && (
                          <Badge variant="destructive">
                            {reader.reports} reports
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground">{reader.email}</p>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Novels Read:</span>
                          <span className="ml-2 font-medium">{reader.novelsRead}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Time Spent:</span>
                          <span className="ml-2 font-medium">{reader.timeSpent}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Favorite Genre:</span>
                          <span className="ml-2 font-medium">{reader.favoriteGenre}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Comments:</span>
                          <span className="ml-2 font-medium">{reader.comments}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span>Joined: {reader.joinDate}</span>
                        <span>Last Active: {reader.lastActive}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onNavigate("reader-profile", reader)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Reader
                      </Button>
                      
                      {reader.status === "active" && (
                        <Button size="sm" variant="outline">
                          <Ban className="h-4 w-4 mr-1" />
                          Suspend
                        </Button>
                      )}

                      {reader.status === "suspended" && (
                        <Button size="sm" variant="outline">
                          <UserCheck className="h-4 w-4 mr-1" />
                          Reactivate
                        </Button>
                      )}

                      {reader.reports > 0 && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onNavigate("reports", { reader })}
                        >
                          <Flag className="h-4 w-4 mr-1" />
                          View Reports
                        </Button>
                      )}
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
              {mockReaders.filter(r => r.status === "active").length}
            </div>
            <div className="text-sm text-muted-foreground">Active Readers</div>
          </CardContent>
        </Card>
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">
              {mockReaders.filter(r => r.status === "suspended").length}
            </div>
            <div className="text-sm text-muted-foreground">Suspended</div>
          </CardContent>
        </Card>
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {mockReaders.reduce((sum, r) => sum + r.novelsRead, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Novels Read</div>
          </CardContent>
        </Card>
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {mockReaders.filter(r => r.reports > 0).length}
            </div>
            <div className="text-sm text-muted-foreground">Readers with Reports</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}