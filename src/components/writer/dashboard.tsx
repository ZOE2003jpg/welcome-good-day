import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  PenTool, 
  Plus, 
  BookOpen, 
  BarChart3, 
  DollarSign, 
  Bell,
  Eye,
  Heart,
  MessageCircle,
  TrendingUp,
  Users
} from "lucide-react"

interface DashboardProps {
  onNavigate: (page: string, data?: any) => void
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const stats = {
    totalStories: 12,
    totalReads: 15420,
    totalLikes: 1250,
    totalComments: 340,
    earnings: 245.80,
    followers: 89
  }

  const recentNotifications = [
    {
      id: 1,
      message: "New comment on \"The Digital Awakening\"",
      time: "2 hours ago",
      type: "comment"
    },
    {
      id: 2,
      message: "Your story reached 5000+ reads!",
      time: "1 day ago", 
      type: "milestone"
    },
    {
      id: 3,
      message: "Weekly analytics report is ready",
      time: "3 days ago",
      type: "report"
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <PenTool className="h-8 w-8 text-primary" />
            Writer Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here's your writing progress overview
          </p>
        </div>
        <Button size="lg" className="vine-button-hero" onClick={() => onNavigate("create-story")}>
          <Plus className="h-5 w-5 mr-2" />
          Create New Story
        </Button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <BookOpen className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.totalStories}</div>
            <div className="text-sm text-muted-foreground">Stories</div>
          </CardContent>
        </Card>

        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <Eye className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.totalReads.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Reads</div>
          </CardContent>
        </Card>

        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <Heart className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.totalLikes.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Likes</div>
          </CardContent>
        </Card>

        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <MessageCircle className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.totalComments}</div>
            <div className="text-sm text-muted-foreground">Comments</div>
          </CardContent>
        </Card>

        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <DollarSign className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">${stats.earnings}</div>
            <div className="text-sm text-muted-foreground">Earnings</div>
          </CardContent>
        </Card>

        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <Users className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.followers}</div>
            <div className="text-sm text-muted-foreground">Followers</div>
          </CardContent>
        </Card>
      </div>

      {/* Action Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="vine-card cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigate("create-story")}>
          <CardContent className="pt-6 text-center">
            <Plus className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle className="mb-2">Create New Story</CardTitle>
            <CardDescription>Start writing your next masterpiece</CardDescription>
          </CardContent>
        </Card>

        <Card className="vine-card cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigate("manage-stories")}>
          <CardContent className="pt-6 text-center">
            <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle className="mb-2">Manage Stories</CardTitle>
            <CardDescription>Edit and organize your existing works</CardDescription>
          </CardContent>
        </Card>

        <Card className="vine-card cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigate("analytics")}>
          <CardContent className="pt-6 text-center">
            <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle className="mb-2">View Analytics</CardTitle>
            <CardDescription>Track your story performance</CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Notifications Preview */}
      <Card className="vine-card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("notifications")}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentNotifications.map((notification) => (
              <div key={notification.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div>
                  <div className="font-medium">{notification.message}</div>
                  <div className="text-sm text-muted-foreground">{notification.time}</div>
                </div>
                <Badge variant="secondary">{notification.type}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}