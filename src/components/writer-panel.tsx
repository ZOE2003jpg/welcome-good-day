import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  PenTool, 
  Plus, 
  BookOpen, 
  BarChart3, 
  DollarSign, 
  Bell,
  Edit,
  Trash2,
  Eye,
  Clock,
  Heart,
  MessageCircle,
  TrendingUp
} from "lucide-react"

export function WriterPanel() {
  const [activeTab, setActiveTab] = useState("create")
  
  const mockStories = [
    {
      id: 1,
      title: "The Digital Awakening",
      status: "published",
      reads: 1250,
      likes: 89,
      comments: 23,
      lastUpdated: "2 days ago",
      chapters: 12
    },
    {
      id: 2,
      title: "Memories in the Rain",
      status: "draft",
      reads: 0,
      likes: 0,
      comments: 0,
      lastUpdated: "5 hours ago",
      chapters: 3
    },
    {
      id: 3,
      title: "The Last Algorithm",
      status: "published",
      reads: 2100,
      likes: 156,
      comments: 45,
      lastUpdated: "1 week ago",
      chapters: 8
    }
  ]

  const analytics = {
    totalReads: 3350,
    totalLikes: 245,
    totalComments: 68,
    completionRate: 78,
    earnings: 125.50
  }

  return (
    <div className="container px-4 py-8 mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <PenTool className="h-8 w-8 text-primary" />
            Writer Panel
          </h1>
          <p className="text-muted-foreground mt-2">
            Create and manage your stories with powerful tools
          </p>
        </div>
        <Button size="lg" className="vine-button-hero">
          <Plus className="h-5 w-5 mr-2" />
          Create New Story
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="stories">My Stories</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Create Story Tab */}
        <TabsContent value="create" className="space-y-6">
          <Card className="vine-card">
            <CardHeader>
              <CardTitle>Story Editor</CardTitle>
              <CardDescription>
                Start writing your story. The system will automatically split your content into slides every 300 words.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="vine-card p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Edit className="h-5 w-5 text-primary" />
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Slide
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Re-split Content
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Clock className="h-4 w-4 mr-2" />
                      Save as Draft
                    </Button>
                    <Button className="w-full justify-start vine-button-hero">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Publish Story
                    </Button>
                  </div>
                </Card>
                
                <Card className="vine-card p-6">
                  <h3 className="font-semibold mb-4">Story Details</h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Word Count:</span>
                      <span className="font-medium">0 words</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Slides:</span>
                      <span className="font-medium">0 slides</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reading Time:</span>
                      <span className="font-medium">0 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge variant="secondary">Draft</Badge>
                    </div>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Stories Tab */}
        <TabsContent value="stories" className="space-y-6">
          <div className="grid gap-6">
            {mockStories.map((story) => (
              <Card key={story.id} className="vine-card">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{story.title}</CardTitle>
                      <CardDescription>
                        {story.chapters} chapters • Updated {story.lastUpdated}
                      </CardDescription>
                    </div>
                    <Badge variant={story.status === "published" ? "default" : "secondary"}>
                      {story.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {story.reads}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {story.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {story.comments}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="vine-card text-center">
              <CardContent className="pt-6">
                <Eye className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{analytics.totalReads.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Reads</div>
              </CardContent>
            </Card>
            <Card className="vine-card text-center">
              <CardContent className="pt-6">
                <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{analytics.totalLikes}</div>
                <div className="text-sm text-muted-foreground">Total Likes</div>
              </CardContent>
            </Card>
            <Card className="vine-card text-center">
              <CardContent className="pt-6">
                <MessageCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{analytics.totalComments}</div>
                <div className="text-sm text-muted-foreground">Total Comments</div>
              </CardContent>
            </Card>
            <Card className="vine-card text-center">
              <CardContent className="pt-6">
                <BarChart3 className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{analytics.completionRate}%</div>
                <div className="text-sm text-muted-foreground">Completion Rate</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Earnings Tab */}
        <TabsContent value="earnings" className="space-y-6">
          <Card className="vine-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Earnings Overview
              </CardTitle>
              <CardDescription>
                Track your revenue from ad shares and reader engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-4xl font-bold text-primary">
                  ${analytics.earnings.toFixed(2)}
                </div>
                <p className="text-muted-foreground">Available for withdrawal</p>
                <Button className="vine-button-hero">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Request Payout
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="vine-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Recent Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <div className="font-medium">New comment on "The Digital Awakening"</div>
                  <div className="text-sm text-muted-foreground">2 hours ago</div>
                </div>
                <div className="border-b pb-4">
                  <div className="font-medium">Your story reached 1000+ reads!</div>
                  <div className="text-sm text-muted-foreground">1 day ago</div>
                </div>
                <div className="border-b pb-4">
                  <div className="font-medium">Weekly analytics report is ready</div>
                  <div className="text-sm text-muted-foreground">3 days ago</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}