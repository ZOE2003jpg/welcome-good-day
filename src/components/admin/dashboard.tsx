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
  onNavigate: (page: string) => void
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const systemStats = {
    totalNovels: 5234,
    totalChapters: 47829,
    totalReaders: 12847,
    totalWriters: 1583,
    adImpressions: 452000,
    adRevenue: 8947.50,
    flaggedContent: 23,
    activeComplaints: 7
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