import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "@/components/theme-provider"
import { useUser } from "@/components/user-context"
import { 
  ArrowLeft,
  Settings as SettingsIcon,
  User,
  Bell,
  Palette,
  Shield,
  Download,
  Trash2,
  LogOut,
  Mail,
  Lock,
  Eye,
  EyeOff
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface SettingsProps {
  onNavigate: (page: string) => void
}

export function Settings({ onNavigate }: SettingsProps) {
  const { theme, setTheme } = useTheme()
  const { user, logout } = useUser()
  const [showPassword, setShowPassword] = useState(false)
  
  const [accountData, setAccountData] = useState({
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const [notifications, setNotifications] = useState({
    emailComments: true,
    emailMilestones: true,
    emailFollowers: false,
    emailWeeklyReport: true,
    pushComments: true,
    pushLikes: true,
    pushAdmin: true,
    pushUpdates: true
  })

  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    showEmail: false,
    showReadingHistory: true,
    allowMessages: true
  })

  const handleLogout = () => {
    logout()
    onNavigate("dashboard")
  }

  const handleDeleteAccount = () => {
    // Handle account deletion logic here
    console.log("Account deletion requested")
  }

  const handleSaveAccount = () => {
    // Handle account save logic here
    console.log("Account settings saved")
  }

  const handleExportData = () => {
    // Handle data export logic here
    console.log("Data export requested")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => onNavigate("dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your account and preferences</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Account Settings */}
        <div className="space-y-6">
          <Card className="vine-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Information
              </CardTitle>
              <CardDescription>Update your account details and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={accountData.email}
                  onChange={(e) => setAccountData({...accountData, email: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showPassword ? "text" : "password"}
                    value={accountData.currentPassword}
                    onChange={(e) => setAccountData({...accountData, currentPassword: e.target.value})}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password (Optional)</Label>
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={accountData.newPassword}
                  onChange={(e) => setAccountData({...accountData, newPassword: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  value={accountData.confirmPassword}
                  onChange={(e) => setAccountData({...accountData, confirmPassword: e.target.value})}
                />
              </div>

              <Button className="w-full vine-button-hero" onClick={handleSaveAccount}>
                <Lock className="h-4 w-4 mr-2" />
                Save Account Settings
              </Button>
            </CardContent>
          </Card>

          {/* Theme Settings */}
          <Card className="vine-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>Customize the look and feel of VineNovel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Choose your preferred theme or sync with your system
                </p>
              </div>

              <div className="space-y-3">
                <Label>Display Options</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Compact Mode</p>
                      <p className="text-sm text-muted-foreground">Reduce spacing for more content</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Reduced Motion</p>
                      <p className="text-sm text-muted-foreground">Minimize animations</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications & Privacy */}
        <div className="space-y-6">
          <Card className="vine-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Email Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Comments on stories</p>
                      <p className="text-sm text-muted-foreground">When readers comment on your work</p>
                    </div>
                    <Switch 
                      checked={notifications.emailComments}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, emailComments: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Story milestones</p>
                      <p className="text-sm text-muted-foreground">Achievement notifications</p>
                    </div>
                    <Switch 
                      checked={notifications.emailMilestones}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, emailMilestones: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New followers</p>
                      <p className="text-sm text-muted-foreground">When someone follows you</p>
                    </div>
                    <Switch 
                      checked={notifications.emailFollowers}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, emailFollowers: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Weekly reports</p>
                      <p className="text-sm text-muted-foreground">Analytics summaries</p>
                    </div>
                    <Switch 
                      checked={notifications.emailWeeklyReport}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, emailWeeklyReport: checked})
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Push Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Real-time comments</p>
                      <p className="text-sm text-muted-foreground">Instant comment notifications</p>
                    </div>
                    <Switch 
                      checked={notifications.pushComments}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, pushComments: checked})
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Likes and reactions</p>
                      <p className="text-sm text-muted-foreground">When readers like your stories</p>
                    </div>
                    <Switch 
                      checked={notifications.pushLikes}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, pushLikes: checked})
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="vine-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Security
              </CardTitle>
              <CardDescription>Control your privacy and data settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Public Profile</p>
                  <p className="text-sm text-muted-foreground">Allow others to view your profile</p>
                </div>
                <Switch 
                  checked={privacy.profilePublic}
                  onCheckedChange={(checked) => 
                    setPrivacy({...privacy, profilePublic: checked})
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show Email</p>
                  <p className="text-sm text-muted-foreground">Display email on public profile</p>
                </div>
                <Switch 
                  checked={privacy.showEmail}
                  onCheckedChange={(checked) => 
                    setPrivacy({...privacy, showEmail: checked})
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Allow Messages</p>
                  <p className="text-sm text-muted-foreground">Let readers send you messages</p>
                </div>
                <Switch 
                  checked={privacy.allowMessages}
                  onCheckedChange={(checked) => 
                    setPrivacy({...privacy, allowMessages: checked})
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Data Management */}
      <Card className="vine-card">
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Manage your data and account actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>

            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Account</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to permanently delete your account? This action cannot be undone and will remove all your stories, data, and followers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={handleDeleteAccount}
                  >
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}