import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { HomePage } from "@/components/home-page"
import { WriterPanel } from "@/components/writer-panel"
import { ReaderPanel } from "@/components/reader-panel"
import { AdminPanel } from "@/components/admin-panel"
import { useUser } from "@/components/user-context"

const Index = () => {
  const [currentPanel, setCurrentPanel] = useState<"home" | "writer" | "reader" | "admin">("home")
  const { user } = useUser()

  // Redirect to home if user doesn't have access to current panel
  useEffect(() => {
    if (!user && currentPanel !== "home") {
      setCurrentPanel("home")
      return
    }

    if (user && currentPanel !== "home") {
      const hasAccess = 
        (currentPanel === "reader") ||
        (currentPanel === "writer" && (user.role === "writer" || user.role === "admin")) ||
        (currentPanel === "admin" && user.role === "admin")
      
      if (!hasAccess) {
        setCurrentPanel("home")
      }
    }
  }, [user, currentPanel])

  const renderPanel = () => {
    // Additional security check
    if (!user && currentPanel !== "home") {
      return <HomePage onPanelChange={setCurrentPanel} />
    }

    if (user && currentPanel !== "home") {
      const hasAccess = 
        (currentPanel === "reader") ||
        (currentPanel === "writer" && (user.role === "writer" || user.role === "admin")) ||
        (currentPanel === "admin" && user.role === "admin")
      
      if (!hasAccess) {
        return <HomePage onPanelChange={setCurrentPanel} />
      }
    }

    switch (currentPanel) {
      case "writer":
        return <WriterPanel />
      case "reader":
        return <ReaderPanel />
      case "admin":
        return <AdminPanel />
      default:
        return <HomePage onPanelChange={setCurrentPanel} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPanel={currentPanel} onPanelChange={setCurrentPanel} />
      {renderPanel()}
    </div>
  )
};

export default Index;
