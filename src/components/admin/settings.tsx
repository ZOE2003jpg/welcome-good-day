import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { 
  Settings as SettingsIcon, 
  Play, 
  FileText, 
  Palette, 
  Users, 
  Shield,
  Save
} from "lucide-react"

interface SettingsProps {
  onNavigate: (page: string, data?: any) => void
}

export function Settings({ onNavigate }: SettingsProps) {
  const [adFrequency, setAdFrequency] = useState("6")
  const [slideWordLimit, setSlideWordLimit] = useState("400")
  const [defaultTheme, setDefaultTheme] = useState("grey")
  const [autoModeration, setAutoModeration] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [maintenanceMode, setMaintenanceMode] = useState(false)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <SettingsIcon className="h-8 w-8 text-primary" />
          Platform Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Configure platform-wide settings and preferences
        </p>
      </div>

      {/* Ad Configuration */}
      <Card className="vine-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Advertisement Settings
          </CardTitle>
          <CardDescription>
            Configure ad frequency and display options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="ad-frequency">Ad Frequency (every X slides)</Label>
              <Select value={adFrequency} onValueChange={setAdFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4">Every 4 slides</SelectItem>
                  <SelectItem value="5">Every 5 slides</SelectItem>
                  <SelectItem value="6">Every 6 slides (default)</SelectItem>
                  <SelectItem value="8">Every 8 slides</SelectItem>
                  <SelectItem value="10">Every 10 slides</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="slide-word-limit">Slide Word Limit</Label>
              <Select value={slideWordLimit} onValueChange={setSlideWordLimit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="300">300 words</SelectItem>
                  <SelectItem value="400">400 words (default)</SelectItem>
                  <SelectItem value="500">500 words</SelectItem>
                  <SelectItem value="600">600 words</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Skip Button Delay</Label>
                <p className="text-sm text-muted-foreground">
                  How long users must watch before skip option appears
                </p>
              </div>
              <Select defaultValue="5">
                <SelectTrigger className="w-32">
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

            <div className="flex items-center justify-between">
              <div>
                <Label>Maximum Ad Duration</Label>
                <p className="text-sm text-muted-foreground">
                  Maximum length for uploaded ads
                </p>
              </div>
              <Select defaultValue="30">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 seconds</SelectItem>
                  <SelectItem value="30">30 seconds</SelectItem>
                  <SelectItem value="45">45 seconds</SelectItem>
                  <SelectItem value="60">60 seconds</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Settings */}
      <Card className="vine-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Content Settings
          </CardTitle>
          <CardDescription>
            Configure content creation and display settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-moderation</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically flag potentially inappropriate content
                </p>
              </div>
              <Switch 
                checked={autoModeration} 
                onCheckedChange={setAutoModeration}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Require Approval for New Writers</Label>
                <p className="text-sm text-muted-foreground">
                  New writers must be approved before publishing
                </p>
              </div>
              <Switch defaultChecked={true} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Allow Anonymous Comments</Label>
                <p className="text-sm text-muted-foreground">
                  Users can comment without creating an account
                </p>
              </div>
              <Switch defaultChecked={false} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Enable Comments Voting</Label>
                <p className="text-sm text-muted-foreground">
                  Allow users to upvote/downvote comments
                </p>
              </div>
              <Switch defaultChecked={true} />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="content-guidelines">Content Guidelines</Label>
              <Textarea
                id="content-guidelines"
                placeholder="Enter content guidelines for writers..."
                defaultValue="All content must be original and appropriate for general audiences. No explicit violence, hate speech, or copyrighted material."
                className="min-h-[100px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme & UI Settings */}
      <Card className="vine-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme & UI Settings
          </CardTitle>
          <CardDescription>
            Configure default appearance and user interface
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="default-theme">Default Theme</Label>
              <Select value={defaultTheme} onValueChange={setDefaultTheme}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="grey">Grey (default)</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="reading-font">Default Reading Font</Label>
              <Select defaultValue="inter">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inter">Inter</SelectItem>
                  <SelectItem value="arial">Arial</SelectItem>
                  <SelectItem value="georgia">Georgia</SelectItem>
                  <SelectItem value="times">Times New Roman</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Enable Dark Mode Toggle</Label>
                <p className="text-sm text-muted-foreground">
                  Allow users to switch between light and dark themes
                </p>
              </div>
              <Switch defaultChecked={true} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Show Reader Progress</Label>
                <p className="text-sm text-muted-foreground">
                  Display reading progress bars on novels
                </p>
              </div>
              <Switch defaultChecked={true} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Enable Slide Animations</Label>
                <p className="text-sm text-muted-foreground">
                  Use smooth transitions between slides
                </p>
              </div>
              <Switch defaultChecked={true} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Management Settings */}
      <Card className="vine-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </CardTitle>
          <CardDescription>
            Configure user permissions and restrictions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Send email notifications for important events
                </p>
              </div>
              <Switch 
                checked={emailNotifications} 
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Require 2FA for admin accounts
                </p>
              </div>
              <Switch defaultChecked={true} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Account Verification</Label>
                <p className="text-sm text-muted-foreground">
                  Require email verification for new accounts
                </p>
              </div>
              <Switch defaultChecked={true} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
              <Input
                id="session-timeout"
                type="number"
                defaultValue="60"
                min="15"
                max="480"
              />
            </div>

            <div>
              <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
              <Input
                id="max-login-attempts"
                type="number"
                defaultValue="5"
                min="3"
                max="10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card className="vine-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            System Settings
          </CardTitle>
          <CardDescription>
            Platform maintenance and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Temporarily disable public access to the platform
                </p>
              </div>
              <Switch 
                checked={maintenanceMode} 
                onCheckedChange={setMaintenanceMode}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Enable Analytics</Label>
                <p className="text-sm text-muted-foreground">
                  Track user behavior and platform usage
                </p>
              </div>
              <Switch defaultChecked={true} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Backup Database Daily</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically backup database every 24 hours
                </p>
              </div>
              <Switch defaultChecked={true} />
            </div>
          </div>

          <div>
            <Label htmlFor="maintenance-message">Maintenance Message</Label>
            <Textarea
              id="maintenance-message"
              placeholder="Message to display during maintenance..."
              defaultValue="VineNovel is currently undergoing maintenance. We'll be back shortly!"
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="vine-button-hero">
          <Save className="h-4 w-4 mr-2" />
          Save All Settings
        </Button>
      </div>
    </div>
  )
}