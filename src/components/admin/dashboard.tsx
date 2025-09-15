import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"
import { 
  Users, 
  BookOpen, 
  Eye, 
  DollarSign, 
  TrendingUp, 
  Flag,
  Play,
  FileText
} from "lucide-react"
import { useStories } from '@/hooks/useStories'
import { useChapters } from '@/hooks/useChapters'
import { useProfiles } from '@/hooks/useProfiles'
import { useReports } from '@/hooks/useReports'
import { useAds } from '@/hooks/useAds'

const dailyActiveUsers = [
  { date: "Jan 1", users: 1200 },
  { date: "Jan 2", users: 1350 },
  { date: "Jan 3", users: 1180 },
  { date: "Jan 4", users: 1420 },
  { date: "Jan 5", users: 1680 },
  { date: "Jan 6", users: 1850 },
  { date: "Jan 7", users: 1950 }
]

const topNovels = [
  { title: "Digital Awakening", reads: 45000 },
  { title: "Midnight Chronicles", reads: 38000 },
  { title: "Future Past", reads: 32000 },
  { title: "Love in Code", reads: 28000 },
  { title: "The Last Writer", reads: 25000 }
]

const adPerformance = [
  { name: "Views", value: 45200, color: "hsl(var(--vine-orange))" },
  { name: "Clicks", value: 3240, color: "hsl(var(--vine-grey-400))" },
  { name: "Completed", value: 32544, color: "hsl(var(--vine-orange-light))" }
]

interface DashboardProps {
  onNavigate: (page: string, data?: any) => void
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { stories, loading: storiesLoading } = useStories()
  const { chapters, loading: chaptersLoading } = useChapters()
  const { profiles, loading: profilesLoading } = useProfiles()
  const { reports, loading: reportsLoading } = useReports()
  const { ads, loading: adsLoading } = useAds()

  const systemStats = {
    totalNovels: stories.length,
    totalChapters: chapters.length,
    totalReaders: profiles.filter(p => p.role === 'reader').length,
    totalWriters: profiles.filter(p => p.role === 'writer').length,
    adImpressions: ads.reduce((sum, ad) => sum + ad.impressions, 0),
    adRevenue: ads.reduce((sum, ad) => sum + (ad.clicks * 0.5), 0), // Assuming $0.5 per click
    flaggedContent: reports.filter(r => r.status === 'pending').length,
    activeComplaints: reports.filter(r => r.status === 'reviewed').length
  }

  const isLoading = storiesLoading || chaptersLoading || profilesLoading || reportsLoading || adsLoading

  // Get top stories by view count for chart
  const topNovels = stories
    .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
    .slice(0, 5)
    .map(story => ({ 
      title: story.title.length > 15 ? story.title.substring(0, 15) + '...' : story.title, 
      reads: story.view_count || 0 
    }))

  if (isLoading) {
    return <div className="space-y-8">
      <div className="text-center">Loading dashboard...</div>
    </div>
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Platform overview and key metrics
        </p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="vine-card">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <BookOpen className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">{systemStats.totalNovels.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Novels</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="vine-card">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">{systemStats.totalChapters.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Chapters</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="vine-card">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">{systemStats.totalReaders.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Readers</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="vine-card">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">{systemStats.totalWriters.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Writers</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ad Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="vine-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Ads Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Total Impressions</span>
                <span className="font-bold">{systemStats.adImpressions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Revenue (30 days)</span>
                <span className="font-bold text-primary">${systemStats.adRevenue.toLocaleString()}</span>
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => onNavigate("ads")}
              >
                Manage Ads
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="vine-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flag className="h-5 w-5" />
              Reports Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Flagged Content</span>
                <span className="font-bold text-destructive">{systemStats.flaggedContent}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Active Complaints</span>
                <span className="font-bold">{systemStats.activeComplaints}</span>
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => onNavigate("reports")}
              >
                View All Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="vine-card">
          <CardHeader>
            <CardTitle>Daily Active Readers</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyActiveUsers}>
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
                  dataKey="users" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="vine-card">
          <CardHeader>
            <CardTitle>Top 5 Novels by Reads</CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topNovels}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="title" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }} 
                />
                <Bar dataKey="reads" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Ad Performance Chart */}
      <Card className="vine-card">
        <CardHeader>
          <CardTitle>Ad Performance</CardTitle>
          <CardDescription>Views, clicks, and completion rates</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={adPerformance}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value.toLocaleString()}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {adPerformance.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button 
          className="vine-button-hero"
          onClick={() => onNavigate("writers")}
        >
          <Users className="h-4 w-4 mr-2" />
          Manage Writers
        </Button>
        <Button 
          variant="outline"
          onClick={() => onNavigate("novels")}
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Manage Novels
        </Button>
        <Button 
          variant="outline"
          onClick={() => onNavigate("analytics")}
        >
          <BarChart className="h-4 w-4 mr-2" />
          View Analytics
        </Button>
      </div>
    </div>
  )
}