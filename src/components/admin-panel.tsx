import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Shield, 
  Users, 
  Flag, 
  BarChart3, 
  Settings,
  Megaphone,
  Star,
  Eye,
  Ban,
  CheckCircle,
  Trash2,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Play
} from "lucide-react"

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState("users")
  
  const mockUsers = [
    {
      id: 1,
      name: "Sarah Chen",
      email: "sarah@example.com",
      status: "verified",
      joinDate: "Jan 15, 2024",
      stories: 5,
      reads: "2.1K"
    },
    {
      id: 2,
      name: "John Doe",
      email: "john@example.com",
      status: "pending",
      joinDate: "Feb 3, 2024",
      stories: 2,
      reads: "856"
    },
    {
      id: 3,
      name: "Alice Wang",
      email: "alice@example.com",
      status: "banned",
      joinDate: "Dec 20, 2023",
      stories: 8,
      reads: "5.2K"
    }
  ]

  const flaggedContent = [
    {
      id: 1,
      title: "Inappropriate Content in Chapter 3",
      type: "story",
      reporter: "User123",
      reason: "Inappropriate content",
      date: "2 hours ago",
      status: "pending"
    },
    {
      id: 2,
      title: "Spam Comment on 'Digital Awakening'",
      type: "comment",
      reporter: "BookLover",
      reason: "Spam",
      date: "5 hours ago",
      status: "pending"
    }
  ]

  const systemStats = {
    activeUsers: 10847,
    totalStories: 5234,
    monthlyReads: 125000,
    adRevenue: 2847.50,
    avgEngagement: 78
  }

  return (
    <div className="container px-4 py-8 mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            Admin Panel
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage users, content, and platform analytics
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="ads">Ad Controls</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {/* User Management Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card className="vine-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>
                View and manage user accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockUsers.map((user) => (
                  <Card key={user.id} className="vine-card">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold">{user.name}</h3>
                            <Badge variant={
                              user.status === "verified" ? "default" :
                              user.status === "banned" ? "destructive" : "secondary"
                            }>
                              {user.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>Joined: {user.joinDate}</span>
                            <span>Stories: {user.stories}</span>
                            <span>Reads: {user.reads}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {user.status === "pending" && (
                            <Button size="sm" variant="outline">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Verify
                            </Button>
                          )}
                          {user.status !== "banned" && (
                            <Button size="sm" variant="outline">
                              <Ban className="h-4 w-4 mr-1" />
                              Ban
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Moderation Tab */}
        <TabsContent value="content" className="space-y-6">
          <Card className="vine-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flag className="h-5 w-5" />
                Content Moderation
              </CardTitle>
              <CardDescription>
                Review flagged stories and comments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {flaggedContent.map((item) => (
                  <Card key={item.id} className="vine-card border-l-4 border-l-destructive">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold">{item.title}</h3>
                            <Badge variant="outline">{item.type}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Reported by {item.reporter} • {item.reason}
                          </p>
                          <p className="text-sm text-muted-foreground">{item.date}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                          <Button size="sm" variant="outline">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card className="vine-card text-center">
              <CardContent className="pt-6">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{systemStats.activeUsers.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </CardContent>
            </Card>
            <Card className="vine-card text-center">
              <CardContent className="pt-6">
                <Flag className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{systemStats.totalStories.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Stories</div>
              </CardContent>
            </Card>
            <Card className="vine-card text-center">
              <CardContent className="pt-6">
                <Eye className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{(systemStats.monthlyReads / 1000).toFixed(0)}K</div>
                <div className="text-sm text-muted-foreground">Monthly Reads</div>
              </CardContent>
            </Card>
            <Card className="vine-card text-center">
              <CardContent className="pt-6">
                <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">${systemStats.adRevenue.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Ad Revenue</div>
              </CardContent>
            </Card>
            <Card className="vine-card text-center">
              <CardContent className="pt-6">
                <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{systemStats.avgEngagement}%</div>
                <div className="text-sm text-muted-foreground">Avg Engagement</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Ad Controls Tab */}
        <TabsContent value="ads" className="space-y-6">
          <Card className="vine-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Ad Controls
              </CardTitle>
              <CardDescription>
                Manage video ad frequency and placement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="vine-card p-6">
                  <h3 className="font-semibold mb-4">Current Settings</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Ad Frequency:</span>
                      <span className="font-medium">Every 6 slides</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ad Duration:</span>
                      <span className="font-medium">15-30 seconds</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Skip Option:</span>
                      <span className="font-medium">After 5 seconds</span>
                    </div>
                  </div>
                </Card>
                
                <Card className="vine-card p-6">
                  <h3 className="font-semibold mb-4">Ad Performance</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Total Views:</span>
                      <span className="font-medium">45.2K</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completion Rate:</span>
                      <span className="font-medium">72%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Revenue (30 days):</span>
                      <span className="font-medium text-primary">$2,847.50</span>
                    </div>
                  </div>
                </Card>
              </div>
              
              <Button className="vine-button-hero">
                <Settings className="h-4 w-4 mr-2" />
                Edit Ad Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Announcements Tab */}
        <TabsContent value="announcements" className="space-y-6">
          <Card className="vine-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5" />
                Announcements & Featured Stories
              </CardTitle>
              <CardDescription>
                Manage platform announcements and featured content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                <Button className="vine-button-hero">
                  <Megaphone className="h-4 w-4 mr-2" />
                  New Announcement
                </Button>
                <Button variant="outline">
                  <Star className="h-4 w-4 mr-2" />
                  Feature Story
                </Button>
              </div>
              
              <Card className="vine-card">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">Recent Announcements</h3>
                  <div className="space-y-3">
                    <div className="border-b pb-3">
                      <p className="font-medium">Platform Update v2.1</p>
                      <p className="text-sm text-muted-foreground">New slide transitions and reader improvements</p>
                      <p className="text-xs text-muted-foreground">Posted 2 days ago</p>
                    </div>
                    <div className="border-b pb-3">
                      <p className="font-medium">Writing Contest Winner</p>
                      <p className="text-sm text-muted-foreground">Congratulations to the monthly contest winner!</p>
                      <p className="text-xs text-muted-foreground">Posted 1 week ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-6">
          <Card className="vine-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                System Logs & Security
              </CardTitle>
              <CardDescription>
                Monitor system activity and security events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono text-sm">2024-01-15 14:32:01</span>
                    <Badge variant="outline">INFO</Badge>
                  </div>
                  <p className="text-sm">User login: sarah@example.com from IP 192.168.1.1</p>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono text-sm">2024-01-15 14:28:15</span>
                    <Badge variant="destructive">WARN</Badge>
                  </div>
                  <p className="text-sm">Multiple failed login attempts for john@example.com</p>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono text-sm">2024-01-15 14:25:42</span>
                    <Badge variant="outline">INFO</Badge>
                  </div>
                  <p className="text-sm">New story published: "The Digital Awakening" by Sarah Chen</p>
                </div>
              </div>
              
              <Button variant="outline" className="mt-4">
                <Eye className="h-4 w-4 mr-2" />
                View Full Logs
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}