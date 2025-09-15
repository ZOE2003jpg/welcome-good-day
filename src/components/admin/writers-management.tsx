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
import { useProfiles } from '@/hooks/useProfiles'

interface WritersManagementProps {
  onNavigate: (page: string, data?: any) => void
}

export function WritersManagement({ onNavigate }: WritersManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { profiles, loading, error } = useProfiles()

  const writers = profiles.filter(profile => profile.role === 'writer')

  const filteredWriters = writers.filter(writer => {
    const displayName = writer.display_name || writer.username || 'Unknown'
    const matchesSearch = displayName.toLowerCase().includes(searchTerm.toLowerCase())
    const status = (writer as any).status || 'active'
    const matchesStatus = statusFilter === "all" || status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "default"
      case "pending": return "secondary"
      case "suspended": return "destructive"
      default: return "outline"
    }
  }

  if (loading) {
    return <div className="space-y-8">
      <div className="text-center">Loading writers...</div>
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
                  placeholder="Search writers by name or username..."
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
                        <h3 className="text-xl font-semibold">{writer.display_name || writer.username || 'Unknown'}</h3>
                        <Badge variant={getStatusColor(writer.status || 'active') as any}>
                          {writer.status || 'active'}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">User ID: {writer.user_id}</p>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Role:</span>
                          <span className="ml-2 font-medium">{writer.role}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Username:</span>
                          <span className="ml-2 font-medium">{writer.username || 'Not set'}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Bio:</span>
                          <span className="ml-2 font-medium">{writer.bio ? writer.bio.substring(0, 50) + '...' : 'No bio'}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Created:</span>
                          <span className="ml-2 font-medium">{new Date(writer.created_at || '').toLocaleDateString()}</span>
                        </div>
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
        
        {filteredWriters.length === 0 && (
          <Card className="vine-card">
            <CardContent className="pt-6 text-center text-muted-foreground">
              No writers found matching your criteria.
            </CardContent>
          </Card>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">
              {writers.filter(w => (w.status || 'active') === "active").length}
            </div>
            <div className="text-sm text-muted-foreground">Active Writers</div>
          </CardContent>
        </Card>
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-secondary-foreground">
              {writers.filter(w => !w.status || (w.status || 'active') === "pending").length}
            </div>
            <div className="text-sm text-muted-foreground">New Writers</div>
          </CardContent>
        </Card>
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {writers.length}
            </div>
            <div className="text-sm text-muted-foreground">Total Writers</div>
          </CardContent>
        </Card>
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {writers.filter(w => w.bio && w.bio.length > 0).length}
            </div>
            <div className="text-sm text-muted-foreground">With Bio</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}