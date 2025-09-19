import { useState } from "react"
import { DiscoverPage } from "@/components/reader/discover-page"
import { SlideReader } from "@/components/reader/slide-reader"
import { LibraryPage } from "@/components/reader/library-page"
import { SearchPage } from "@/components/reader/search-page"
import { SettingsPage } from "@/components/reader/settings-page"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useUser } from "@/components/user-context"
import { 
  Compass, 
  BookOpen, 
  Library, 
  Search, 
  Settings as SettingsIcon,
  Home,
  PenTool,
  Shield
} from "lucide-react"

interface ReaderPanelProps {
  onPanelChange?: (panel: "home" | "writer" | "reader" | "admin") => void
}

export function ReaderPanel({ onPanelChange }: ReaderPanelProps) {
  const [currentPage, setCurrentPage] = useState("discover")
  const [currentStory, setCurrentStory] = useState(null)
  const { user } = useUser()

  const handleNavigate = (page: string, data?: any) => {
    if (data) {
      setCurrentStory(data)
    }
    setCurrentPage(page)
  }

  const navigationItems = [
    { id: "discover", label: "Discover", icon: Compass },
    { id: "library", label: "My Library", icon: Library },
    { id: "search", label: "Search", icon: Search },
    { id: "settings", label: "Settings", icon: SettingsIcon }
  ]

  const panelItems = [
    { id: "home", label: "Home", icon: Home },
    ...(user?.profile && ["writer", "admin"].includes(user.profile.role) ? [{ id: "writer", label: "Writer Panel", icon: PenTool }] : []),
    ...(user?.profile?.role === "admin" ? [{ id: "admin", label: "Admin Panel", icon: Shield }] : [])
  ]

  const renderPage = () => {
    switch (currentPage) {
      case "discover":
        return <DiscoverPage onNavigate={handleNavigate} />
      case "reader":
        return <SlideReader story={currentStory} onNavigate={handleNavigate} />
      case "library":
        return <LibraryPage onNavigate={handleNavigate} />
      case "search":
        return <SearchPage onNavigate={handleNavigate} />
      case "settings":
        return <SettingsPage onNavigate={handleNavigate} />
      default:
        return <DiscoverPage onNavigate={handleNavigate} />
    }
  }

  // If we're in reader mode, show full screen reader
  if (currentPage === "reader") {
    return <SlideReader story={currentStory} onNavigate={handleNavigate} />
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-card border-r border-border p-6">
        <div className="flex items-center gap-3 mb-8">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold">Reader Panel</h1>
        </div>
        
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleNavigate(item.id)}
              >
                <Icon className="h-4 w-4 mr-3" />
                {item.label}
              </Button>
            )
          })}
        </nav>

        {onPanelChange && panelItems.length > 0 && (
          <>
            <Separator className="my-6" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground px-3">Switch Panel</p>
              {panelItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => onPanelChange(item.id as any)}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Button>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        {renderPage()}
      </div>
    </div>
  )
}