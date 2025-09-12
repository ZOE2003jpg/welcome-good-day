import { useState } from "react"
import { Dashboard } from "./writer/dashboard"
import { CreateStory } from "./writer/create-story"
import { AddChapter } from "./writer/add-chapter" 
import { ManageStories } from "./writer/manage-stories"
import { ManageChapters } from "./writer/manage-chapters"
import { Analytics } from "./writer/analytics"
import { Earnings } from "./writer/earnings"
import { Notifications } from "./writer/notifications"
import { Profile } from "./writer/profile"
import { Settings } from "./writer/settings"

export function WriterPanel() {
  const [currentPage, setCurrentPage] = useState("dashboard")

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard": return <Dashboard onNavigate={setCurrentPage} />
      case "create-story": return <CreateStory onNavigate={setCurrentPage} />
      case "add-chapter": return <AddChapter onNavigate={setCurrentPage} />
      case "manage-stories": return <ManageStories onNavigate={setCurrentPage} />
      case "manage-chapters": return <ManageChapters onNavigate={setCurrentPage} />
      case "analytics": return <Analytics onNavigate={setCurrentPage} />
      case "earnings": return <Earnings onNavigate={setCurrentPage} />
      case "notifications": return <Notifications onNavigate={setCurrentPage} />
      case "profile": return <Profile onNavigate={setCurrentPage} />
      case "settings": return <Settings onNavigate={setCurrentPage} />
      default: return <Dashboard onNavigate={setCurrentPage} />
    }
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      {renderPage()}
    </div>
  )
}