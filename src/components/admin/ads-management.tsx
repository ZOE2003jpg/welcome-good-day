import { useState, useEffect } from "react"
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
import { useAds } from "@/hooks/useAds"
import { useSystemSettings } from "@/hooks/useSystemSettings"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface AdsManagementProps {
  onNavigate: (page: string, data?: any) => void
}

export function AdsManagement({ onNavigate }: AdsManagementProps) {
  const { ads, loading, createAd, updateAd, deleteAd } = useAds()
  const { getSetting, updateSetting } = useSystemSettings()
  const [adFrequency, setAdFrequency] = useState("6")
  const [skipDelay, setSkipDelay] = useState("5")

  // Load current settings
  useEffect(() => {
    const frequency = getSetting('ads_frequency')
    const delay = getSetting('ads_skip_delay')
    if (frequency) setAdFrequency(frequency)
    if (delay) setSkipDelay(delay)
  }, [getSetting])

  const handleSaveSettings = async () => {
    try {
      await updateSetting('ads_frequency', adFrequency)
      await updateSetting('ads_skip_delay', skipDelay)
      toast.success('Settings saved successfully')
    } catch (error) {
      toast.error('Failed to save settings')
    }
  }

  const handleToggleAdStatus = async (adId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'paused' : 'active'
      await updateAd(adId, { status: newStatus })
      toast.success(`Ad ${newStatus === 'active' ? 'activated' : 'paused'}`)
    } catch (error) {
      toast.error('Failed to update ad status')
    }
  }

  // Realtime subscription for ads
  useEffect(() => {
    const channel = supabase
      .channel('ads-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ads'
        },
        () => {
          window.location.reload()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

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
          
          <Button className="vine-button-hero" onClick={handleSaveSettings}>
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
            {loading ? (
              <div className="text-center py-8">Loading ads...</div>
            ) : ads.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No ads found</div>
            ) : (
              ads.map((ad) => (
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
                            <h3 className="text-lg font-semibold">Ad Campaign</h3>
                            <Badge variant="default">
                              Active
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Video URL:</span>
                              <span className="ml-2 font-medium text-xs">{ad.video_url.slice(0, 30)}...</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Impressions:</span>
                              <span className="ml-2 font-medium">{ad.impressions.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Clicks:</span>
                              <span className="ml-2 font-medium">{ad.clicks.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">CTR:</span>
                              <span className="ml-2 font-medium">{ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(2) : 0}%</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Created: {new Date(ad.created_at).toLocaleDateString()}
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

                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleToggleAdStatus(ad.id, 'active')}
                          >
                            <Clock className="h-4 w-4 mr-1" />
                            Pause
                          </Button>

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
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">
              {ads.length}
            </div>
            <div className="text-sm text-muted-foreground">Total Campaigns</div>
          </CardContent>
        </Card>
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {ads.reduce((sum, a) => sum + a.impressions, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Impressions</div>
          </CardContent>
        </Card>
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {ads.reduce((sum, a) => sum + a.clicks, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Clicks</div>
          </CardContent>
        </Card>
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">
              {ads.reduce((sum, a) => sum + a.impressions, 0) > 0 
                ? ((ads.reduce((sum, a) => sum + a.clicks, 0) / ads.reduce((sum, a) => sum + a.impressions, 0)) * 100).toFixed(1)
                : 0}%
            </div>
            <div className="text-sm text-muted-foreground">Average CTR</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}