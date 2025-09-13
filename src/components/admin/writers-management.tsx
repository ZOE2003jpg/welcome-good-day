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
  CheckCircle, 
  MessageSquare,
  RefreshCw,
  Search,
  Plus,
  UserCheck
} from "lucide-react"

interface WritersManagementProps {
  onNavigate: (page: string, data?: any) => void
}

export function WritersManagement({ onNavigate }: WritersManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const mockWriters = [
    {
      id: 1,
      name: "Sarah Chen",
      email: "sarah@example.com",
      status: "verified",
      joinDate: "Jan 15, 2024",
      novels: 5,
      totalReads: 125000,
      followers: 850,
      rating: 4.8,
      earnings: 2847.50,
      lastActive: "2 hours ago"
    },
    {
      id: 2,
      name: "John Doe",
      email: "john@example.com",
      status: "pending",
      joinDate: "Feb 3, 2024",
      novels: 2,
      totalReads: 45000,
      followers: 320,
      rating: 4.2,
      earnings: 890.25,
      lastActive: "1 day ago"
    },
    {
      id: 3,
      name: "Alice Wang",
      email: "alice@example.com",
      status: "suspended",
      joinDate: "Dec 20, 2023",
      novels: 8,
      totalReads: 200000,
      followers: 1250,
      rating: 4.6,
      earnings: 5234.75,
      lastActive: "5 days ago"
    },
    {
      id: 4,
      name: "Michael Brown",
      email: "michael@example.com",
      status: "verified",
      joinDate: "Nov 10, 2023",
      novels: 12,
      totalReads: 350000,
      followers: 2100,
      rating: 4.9,
      earnings: 8945.50,
      lastActive: "30 minutes ago"
    }
  ]

  const filteredWriters = mockWriters.filter(writer => {
    const matchesSearch = writer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         writer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || writer.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified": return "default"
      case "pending": return "secondary"
      case "suspended": return "destructive"
      default: return "outline"
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            Writers Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage writer accounts, verification, and platform access
          </p>
        </div>
        <Button className="vine-button-hero">
          <Plus className="h-4 w-4 mr-2" />
          Invite Writer
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
                  placeholder="Search writers by name or email..."
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
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Writers List */}
      <div className="space-y-4">
        {filteredWriters.map((writer) => (
          <Card key={writer.id} className="vine-card">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Avatar */}
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
                </div>

                {/* Writer Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-semibold">{writer.name}</h3>
                        <Badge variant={getStatusColor(writer.status) as any}>
                          {writer.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">{writer.email}</p>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Novels:</span>
                          <span className="ml-2 font-medium">{writer.novels}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total Reads:</span>
                          <span className="ml-2 font-medium">{writer.totalReads.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Followers:</span>
                          <span className="ml-2 font-medium">{writer.followers}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Rating:</span>
                          <span className="ml-2 font-medium">{writer.rating}/5</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span>Joined: {writer.joinDate}</span>
                        <span>Earnings: ${writer.earnings.toLocaleString()}</span>
                        <span>Last Active: {writer.lastActive}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onNavigate("writer-profile", writer)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Writer
                      </Button>
                      
                      {writer.status === "pending" && (
                        <Button size="sm" variant="outline">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Verify
                        </Button>
                      )}

                      {writer.status === "verified" && (
                        <Button size="sm" variant="outline">
                          <Ban className="h-4 w-4 mr-1" />
                          Suspend
                        </Button>
                      )}

                      {writer.status === "suspended" && (
                        <Button size="sm" variant="outline">
                          <UserCheck className="h-4 w-4 mr-1" />
                          Reactivate
                        </Button>
                      )}

                      <Button size="sm" variant="outline">
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Reset Password
                      </Button>

                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Message
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
              {mockWriters.filter(w => w.status === "verified").length}
            </div>
            <div className="text-sm text-muted-foreground">Verified Writers</div>
          </CardContent>
        </Card>
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-secondary-foreground">
              {mockWriters.filter(w => w.status === "pending").length}
            </div>
            <div className="text-sm text-muted-foreground">Pending Verification</div>
          </CardContent>
        </Card>
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">
              {mockWriters.filter(w => w.status === "suspended").length}
            </div>
            <div className="text-sm text-muted-foreground">Suspended</div>
          </CardContent>
        </Card>
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              ${mockWriters.reduce((sum, w) => sum + w.earnings, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Earnings</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}