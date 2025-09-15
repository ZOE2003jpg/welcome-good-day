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
import { useProfiles } from '@/hooks/useProfiles'

interface ReadersManagementProps {
  onNavigate: (page: string, data?: any) => void
}

export function ReadersManagement({ onNavigate }: ReadersManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const { profiles, loading, error } = useProfiles()

  const readers = profiles.filter(profile => profile.role === 'reader')

  const filteredReaders = readers.filter(reader => {
    const displayName = reader.display_name || reader.username || 'Unknown'
    const matchesSearch = displayName.toLowerCase().includes(searchTerm.toLowerCase())
    const status = (reader as any).status || 'active'
    const matchesStatus = statusFilter === "all" || status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "default"
      case "suspended": return "destructive"
      default: return "outline"
    }
  }

  if (loading) {
    return <div className="space-y-8">
      <div className="text-center">Loading readers...</div>
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
                  placeholder="Search readers by name or username..."
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
                        <h3 className="text-xl font-semibold">{reader.display_name || reader.username || 'Unknown'}</h3>
                        <Badge variant={getStatusColor(reader.status || 'active') as any}>
                          {reader.status || 'active'}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">User ID: {reader.user_id}</p>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Role:</span>
                          <span className="ml-2 font-medium">{reader.role}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Username:</span>
                          <span className="ml-2 font-medium">{reader.username || 'Not set'}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Bio:</span>
                          <span className="ml-2 font-medium">{reader.bio ? reader.bio.substring(0, 50) + '...' : 'No bio'}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Created:</span>
                          <span className="ml-2 font-medium">{new Date(reader.created_at || '').toLocaleDateString()}</span>
                        </div>
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
                      
                      {(reader.status || 'active') === "active" && (
                        <Button size="sm" variant="outline">
                          <Ban className="h-4 w-4 mr-1" />
                          Suspend
                        </Button>
                      )}

                      {(reader.status || 'active') === "suspended" && (
                        <Button size="sm" variant="outline">
                          <UserCheck className="h-4 w-4 mr-1" />
                          Reactivate
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredReaders.length === 0 && (
          <Card className="vine-card">
            <CardContent className="pt-6 text-center text-muted-foreground">
              No readers found matching your criteria.
            </CardContent>
          </Card>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">
              {readers.filter(r => (r.status || 'active') === "active").length}
            </div>
            <div className="text-sm text-muted-foreground">Active Readers</div>
          </CardContent>
        </Card>
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">
              {readers.filter(r => (r.status || 'active') === "suspended").length}
            </div>
            <div className="text-sm text-muted-foreground">Suspended</div>
          </CardContent>
        </Card>
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {readers.length}
            </div>
            <div className="text-sm text-muted-foreground">Total Readers</div>
          </CardContent>
        </Card>
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {readers.filter(r => r.bio && r.bio.length > 0).length}
            </div>
            <div className="text-sm text-muted-foreground">With Bio</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}