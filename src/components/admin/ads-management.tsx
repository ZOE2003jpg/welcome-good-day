import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { 
  Play, 
  Upload, 
  Eye, 
  Settings, 
  DollarSign, 
  TrendingUp,
  Clock,
  Target,
  BarChart3
} from "lucide-react"

interface AdsManagementProps {
  onNavigate: (page: string, data?: any) => void
}

export function AdsManagement({ onNavigate }: AdsManagementProps) {
  const [adFrequency, setAdFrequency] = useState("6")
  const [skipDelay, setSkipDelay] = useState("5")

  const mockAds = [
    {
      id: 1,
      title: "Mobile Game Ad",
      duration: 15,
      status: "active",
      impressions: 45200,
      clicks: 3240,
      ctr: 7.2,
      revenue: 2847.50,
      uploadDate: "Jan 15, 2024"
    },
    {
      id: 2,
      title: "Fashion Brand",
      duration: 30,
      status: "active",
      impressions: 32000,
      clicks: 1890,
      ctr: 5.9,
      revenue: 1950.00,
      uploadDate: "Feb 1, 2024"
    },
    {
      id: 3,
      title: "Food Delivery",
      duration: 20,
      status: "paused",
      impressions: 28500,
      clicks: 2100,
      ctr: 7.4,
      revenue: 1425.75,
      uploadDate: "Jan 20, 2024"
    }
  ]

  const adPerformanceData = [
    { date: "Jan 1", impressions: 4200, clicks: 315, revenue: 245 },
    { date: "Jan 2", impressions: 4800, clicks: 380, revenue: 290 },
    { date: "Jan 3", impressions: 3900, clicks: 290, revenue: 220 },
    { date: "Jan 4", impressions: 5200, clicks: 420, revenue: 315 },
    { date: "Jan 5", impressions: 6100, clicks: 480, revenue: 380 },
    { date: "Jan 6", impressions: 5800, clicks: 445, revenue: 360 },
    { date: "Jan 7", impressions: 6500, clicks: 520, revenue: 425 }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "default"
      case "paused": return "secondary"
      case "expired": return "destructive"
      default: return "outline"
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Play className="h-8 w-8 text-primary" />
            Ads Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Upload ads, track performance, and manage ad settings
          </p>
        </div>
        <Button className="vine-button-hero">
          <Upload className="h-4 w-4 mr-2" />
          Upload New Ad
        </Button>
      </div>

      {/* Ad Settings */}
      <Card className="vine-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Ad Configuration
          </CardTitle>
          <CardDescription>
            Configure ad frequency and display settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="frequency">Ad Frequency (every X slides)</Label>
                <Select value={adFrequency} onValueChange={setAdFrequency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4">Every 4 slides</SelectItem>
                    <SelectItem value="5">Every 5 slides</SelectItem>
                    <SelectItem value="6">Every 6 slides</SelectItem>
                    <SelectItem value="8">Every 8 slides</SelectItem>
                    <SelectItem value="10">Every 10 slides</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="skip-delay">Skip Button Delay (seconds)</Label>
                <Select value={skipDelay} onValueChange={setSkipDelay}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 seconds</SelectItem>
                    <SelectItem value="5">5 seconds</SelectItem>
                    <SelectItem value="7">7 seconds</SelectItem>
                    <SelectItem value="10">10 seconds</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <Card className="vine-card p-4">
                <h4 className="font-semibold mb-3">Current Performance</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Daily Impressions:</span>
                    <span className="font-medium">6,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average CTR:</span>
                    <span className="font-medium">6.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Daily Revenue:</span>
                    <span className="font-medium text-primary">$425</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
          
          <Button className="vine-button-hero">
            <Settings className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </CardContent>
      </Card>

      {/* Ad Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="vine-card">
          <CardHeader>
            <CardTitle>Ad Impressions & Clicks</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={adPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }} 
                />
                <Bar dataKey="impressions" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
                <Bar dataKey="clicks" fill="hsl(var(--vine-orange-light))" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="vine-card">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={adPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Active Ads */}
      <Card className="vine-card">
        <CardHeader>
          <CardTitle>Active Ad Campaigns</CardTitle>
          <CardDescription>Manage and track your advertising campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAds.map((ad) => (
              <Card key={ad.id} className="vine-card">
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Ad Preview */}
                    <div className="w-32 h-20 bg-muted rounded-lg flex items-center justify-center">
                      <Play className="h-8 w-8 text-muted-foreground" />
                    </div>

                    {/* Ad Info */}
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold">{ad.title}</h3>
                            <Badge variant={getStatusColor(ad.status) as any}>
                              {ad.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Duration:</span>
                              <span className="ml-2 font-medium">{ad.duration}s</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Impressions:</span>
                              <span className="ml-2 font-medium">{ad.impressions.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">CTR:</span>
                              <span className="ml-2 font-medium">{ad.ctr}%</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Revenue:</span>
                              <span className="ml-2 font-medium text-primary">${ad.revenue.toLocaleString()}</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Uploaded: {ad.uploadDate}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                          
                          <Button size="sm" variant="outline">
                            <BarChart3 className="h-4 w-4 mr-1" />
                            View Reports
                          </Button>

                          {ad.status === "active" ? (
                            <Button size="sm" variant="outline">
                              <Clock className="h-4 w-4 mr-1" />
                              Pause
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline">
                              <Play className="h-4 w-4 mr-1" />
                              Resume
                            </Button>
                          )}

                          <Button size="sm" variant="outline">
                            <Settings className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">
              {mockAds.filter(a => a.status === "active").length}
            </div>
            <div className="text-sm text-muted-foreground">Active Campaigns</div>
          </CardContent>
        </Card>
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {mockAds.reduce((sum, a) => sum + a.impressions, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Impressions</div>
          </CardContent>
        </Card>
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {((mockAds.reduce((sum, a) => sum + a.clicks, 0) / mockAds.reduce((sum, a) => sum + a.impressions, 0)) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground">Average CTR</div>
          </CardContent>
        </Card>
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">
              ${mockAds.reduce((sum, a) => sum + a.revenue, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Revenue</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}