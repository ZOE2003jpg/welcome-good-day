import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "@/components/theme-provider"
import { 
  Settings,
  Moon,
  Sun,
  Type,
  Volume2,
  Bell,
  Shield,
  User,
  LogOut,
  Trash2
} from "lucide-react"

interface SettingsPageProps {
  onNavigate: (page: string, data?: any) => void
}

export function SettingsPage({ onNavigate }: SettingsPageProps) {
  const { theme, setTheme } = useTheme()
  const [fontSize, setFontSize] = useState(18)
  const [lineHeight, setLineHeight] = useState(1.6)
  const [autoNextSlide, setAutoNextSlide] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [showProgress, setShowProgress] = useState(true)

  const fontOptions = [
    { value: "inter", label: "Inter (Default)" },
    { value: "georgia", label: "Georgia" },
    { value: "times", label: "Times New Roman" },
    { value: "arial", label: "Arial" },
    { value: "helvetica", label: "Helvetica" }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary" />
            Reader Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Customize your reading experience
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Appearance Settings */}
        <Card className="vine-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5 text-primary" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize the visual appearance of your reading experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-medium">Theme</div>
                <div className="text-sm text-muted-foreground">
                  Choose between light and dark mode
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme("light")}
                >
                  <Sun className="h-4 w-4" />
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme("dark")}
                >
                  <Moon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Font Family */}
            <div className="space-y-2">
              <div className="font-medium">Font Family</div>
              <Select defaultValue="inter">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontOptions.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      {font.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Font Size */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Font Size</span>
                <span className="text-sm text-muted-foreground">{fontSize}px</span>
              </div>
              <Slider
                value={[fontSize]}
                onValueChange={(value) => setFontSize(value[0])}
                min={14}
                max={24}
                step={1}
                className="w-full"
              />
            </div>

            {/* Line Height */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Line Height</span>
                <span className="text-sm text-muted-foreground">{lineHeight}</span>
              </div>
              <Slider
                value={[lineHeight]}
                onValueChange={(value) => setLineHeight(value[0])}
                min={1.2}
                max={2.0}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Preview Text */}
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <p 
                className="text-foreground" 
                style={{ 
                  fontSize: `${fontSize}px`, 
                  lineHeight: lineHeight 
                }}
              >
                This is a preview of how your text will appear while reading. 
                The quick brown fox jumps over the lazy dog.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Reading Experience */}
        <Card className="vine-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="h-5 w-5 text-primary" />
              Reading Experience
            </CardTitle>
            <CardDescription>
              Configure how you interact with stories
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Auto Next Slide */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-medium">Auto-advance slides</div>
                <div className="text-sm text-muted-foreground">
                  Automatically move to next slide after reading
                </div>
              </div>
              <Switch
                checked={autoNextSlide}
                onCheckedChange={setAutoNextSlide}
              />
            </div>

            {/* Show Progress */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-medium">Show progress bar</div>
                <div className="text-sm text-muted-foreground">
                  Display reading progress at top of screen
                </div>
              </div>
              <Switch
                checked={showProgress}
                onCheckedChange={setShowProgress}
              />
            </div>

            {/* Sound Effects */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-medium">Sound effects</div>
                <div className="text-sm text-muted-foreground">
                  Play sounds for slide transitions
                </div>
              </div>
              <Switch
                checked={soundEnabled}
                onCheckedChange={setSoundEnabled}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="vine-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription>
              Manage when and how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Enable Notifications */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-medium">Enable notifications</div>
                <div className="text-sm text-muted-foreground">
                  Receive updates about new chapters and stories
                </div>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>

            {notificationsEnabled && (
              <>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">New chapters</div>
                    <div className="text-sm text-muted-foreground">
                      When stories you're following update
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">Reading reminders</div>
                    <div className="text-sm text-muted-foreground">
                      Gentle nudges to continue reading
                    </div>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">Community activity</div>
                    <div className="text-sm text-muted-foreground">
                      Comments and likes on your activity
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Account & Privacy */}
        <Card className="vine-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Account & Privacy
            </CardTitle>
            <CardDescription>
              Manage your account settings and privacy preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => onNavigate("profile")}
            >
              <User className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>

            <Button variant="outline" className="w-full justify-start">
              <Shield className="h-4 w-4 mr-2" />
              Privacy Settings
            </Button>

            <Button variant="outline" className="w-full justify-start">
              <Volume2 className="h-4 w-4 mr-2" />
              Download My Data
            </Button>

            <div className="border-t pt-4 space-y-2">
              <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
              
              <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Changes */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">
          Reset to Defaults
        </Button>
        <Button className="vine-button-hero">
          Save Changes
        </Button>
      </div>
    </div>
  )
}