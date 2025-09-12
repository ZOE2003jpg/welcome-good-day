import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { 
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Calendar,
  CreditCard,
  Eye,
  Target,
  AlertCircle
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface EarningsProps {
  onNavigate: (page: string) => void
}

export function Earnings({ onNavigate }: EarningsProps) {
  const [payoutDialogOpen, setPayoutDialogOpen] = useState(false)
  const [payoutAmount, setPayoutAmount] = useState("")

  const earningsData = {
    availableBalance: 245.80,
    totalEarnings: 1420.50,
    thisMonthEarnings: 89.30,
    minimumPayout: 50.00,
    nextPayoutDate: "April 1, 2024"
  }

  const payoutHistory = [
    {
      id: 1,
      date: "March 1, 2024",
      amount: 125.50,
      status: "completed",
      method: "PayPal"
    },
    {
      id: 2,
      date: "February 1, 2024", 
      amount: 98.20,
      status: "completed",
      method: "Bank Transfer"
    },
    {
      id: 3,
      date: "January 1, 2024",
      amount: 156.75,
      status: "completed",
      method: "PayPal"
    },
    {
      id: 4,
      date: "December 1, 2023",
      amount: 87.40,
      status: "pending",
      method: "Bank Transfer"
    }
  ]

  const revenueBreakdown = [
    { source: "Ad Revenue Share", amount: 180.20, percentage: 73 },
    { source: "Premium Reader Tips", amount: 45.60, percentage: 19 },
    { source: "Story Promotions", amount: 20.00, percentage: 8 }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "default"
      case "pending": return "secondary"
      case "failed": return "destructive"
      default: return "secondary"
    }
  }

  const canRequestPayout = earningsData.availableBalance >= earningsData.minimumPayout

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => onNavigate("dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Earnings Dashboard</h1>
            <p className="text-muted-foreground">Track your revenue and manage payouts</p>
          </div>
        </div>
        <Dialog open={payoutDialogOpen} onOpenChange={setPayoutDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="vine-button-hero" 
              disabled={!canRequestPayout}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Request Payout
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Payout</DialogTitle>
              <DialogDescription>
                Request a payout of your available earnings. Minimum payout amount is ${earningsData.minimumPayout}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="payout-amount">Payout Amount</Label>
                <Input
                  id="payout-amount"
                  type="number"
                  placeholder={`Max: $${earningsData.availableBalance}`}
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                />
              </div>
              <div className="p-4 bg-secondary/20 rounded-lg">
                <p className="text-sm">
                  <strong>Available Balance:</strong> ${earningsData.availableBalance.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Payouts are processed on the 1st of each month
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPayoutDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="vine-button-hero" onClick={() => setPayoutDialogOpen(false)}>
                Submit Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Balance Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-3xl font-bold">${earningsData.availableBalance.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">Available Balance</div>
          </CardContent>
        </Card>

        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-3xl font-bold">${earningsData.totalEarnings.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">Total Earnings</div>
          </CardContent>
        </Card>

        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-3xl font-bold">${earningsData.thisMonthEarnings.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">This Month</div>
          </CardContent>
        </Card>

        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <Target className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">${earningsData.minimumPayout.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">Min. Payout</div>
          </CardContent>
        </Card>
      </div>

      {/* Payout Progress */}
      <Card className="vine-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Payout Progress
          </CardTitle>
          <CardDescription>
            Track your progress towards the minimum payout threshold
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Current Balance</span>
              <span>${earningsData.availableBalance.toFixed(2)} / ${earningsData.minimumPayout.toFixed(2)}</span>
            </div>
            <Progress value={(earningsData.availableBalance / earningsData.minimumPayout) * 100} />
            {canRequestPayout ? (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Target className="h-4 w-4" />
                Ready for payout! You can request withdrawal now.
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                ${(earningsData.minimumPayout - earningsData.availableBalance).toFixed(2)} more needed for payout
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Breakdown */}
        <Card className="vine-card">
          <CardHeader>
            <CardTitle>Revenue Breakdown</CardTitle>
            <CardDescription>How you're earning money on VineNovel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueBreakdown.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{item.source}</span>
                    <span>${item.amount.toFixed(2)}</span>
                  </div>
                  <Progress value={item.percentage} />
                  <div className="text-xs text-muted-foreground text-right">
                    {item.percentage}% of total
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="vine-card">
          <CardHeader>
            <CardTitle>Earning Insights</CardTitle>
            <CardDescription>Performance insights for this month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-secondary/20 rounded-lg">
              <div>
                <p className="font-medium">Average per 1K reads</p>
                <p className="text-sm text-muted-foreground">Revenue rate</p>
              </div>
              <div className="text-right">
                <p className="font-bold">$2.85</p>
                <p className="text-xs text-green-600">+$0.15 vs last month</p>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-secondary/20 rounded-lg">
              <div>
                <p className="font-medium">Top earning story</p>
                <p className="text-sm text-muted-foreground">Best performer</p>
              </div>
              <div className="text-right">
                <p className="font-bold">$45.20</p>
                <p className="text-xs text-muted-foreground">The Digital Awakening</p>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-secondary/20 rounded-lg">
              <div>
                <p className="font-medium">Next payout</p>
                <p className="text-sm text-muted-foreground">Scheduled date</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{earningsData.nextPayoutDate}</p>
                <p className="text-xs text-muted-foreground">Automatic processing</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payout History */}
      <Card className="vine-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payout History
          </CardTitle>
          <CardDescription>Your previous withdrawals and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payoutHistory.map((payout) => (
              <div key={payout.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">${payout.amount.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">{payout.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium">{payout.method}</p>
                    <Badge variant={getStatusColor(payout.status)}>
                      {payout.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Earning Tips */}
      <Card className="vine-card">
        <CardHeader>
          <CardTitle>Maximize Your Earnings</CardTitle>
          <CardDescription>Tips to increase your revenue on VineNovel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex gap-3">
                <Eye className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Engage Your Readers</p>
                  <p className="text-sm text-muted-foreground">
                    Stories with higher engagement rates earn more from ad revenue
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Post Regularly</p>
                  <p className="text-sm text-muted-foreground">
                    Consistent updates keep readers coming back
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex gap-3">
                <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Quality Content</p>
                  <p className="text-sm text-muted-foreground">
                    Higher completion rates lead to better monetization
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Target className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Optimize Chapters</p>
                  <p className="text-sm text-muted-foreground">
                    Proper chapter length increases ad placement opportunities
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}