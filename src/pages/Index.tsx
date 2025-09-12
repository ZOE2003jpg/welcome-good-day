import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { HomePage } from "@/components/home-page"
import { WriterPanel } from "@/components/writer-panel"
import { ReaderPanel } from "@/components/reader-panel"
import { AdminPanel } from "@/components/admin-panel"

const Index = () => {
  const [currentPanel, setCurrentPanel] = useState<"home" | "writer" | "reader" | "admin">("home")

  const renderPanel = () => {
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
