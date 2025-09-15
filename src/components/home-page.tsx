import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PenTool, BookOpen, Shield, Users, TrendingUp, Zap } from "lucide-react"
import { LoginModal } from "@/components/login-modal"
import { useUser } from "@/components/user-context"
import heroImage from "@/assets/hero-books.jpg"

interface HomePageProps {
  onPanelChange: (panel: "writer" | "reader" | "admin") => void
}

export function HomePage({ onPanelChange }: HomePageProps) {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const { user } = useUser()

  const handlePanelAccess = (panel: "writer" | "reader" | "admin") => {
    if (user?.profile) {
      // Check if user has access to this panel
      const userRole = user.profile.role
      const hasAccess = 
        (panel === "reader") ||
        (panel === "writer" && (userRole === "writer" || userRole === "admin")) ||
        (panel === "admin" && userRole === "admin")
      
      if (hasAccess) {
        onPanelChange(panel)
      }
    } else {
      setShowLoginModal(true)
    }
  }

  const features = [
    {
      icon: PenTool,
      title: "Writer Panel",
      description: "Create and manage your stories with our intuitive slide-based editor",
      action: () => handlePanelAccess("writer"),
      requiresRole: ["writer", "admin"],
    },
    {
      icon: BookOpen,
      title: "Reader Panel",
      description: "Enjoy immersive slide-based reading with smooth transitions",
      action: () => handlePanelAccess("reader"),
      requiresRole: ["reader", "writer", "admin"],
    },
    {
      icon: Shield,
      title: "Admin Panel",
      description: "Manage users, content, and platform analytics",
      action: () => handlePanelAccess("admin"),
      requiresRole: ["admin"],
    },
  ]

  const stats = [
    { icon: Users, label: "Active Users", value: "10,000+" },
    { icon: BookOpen, label: "Stories Published", value: "5,000+" },
    { icon: TrendingUp, label: "Monthly Reads", value: "100K+" },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container px-4 mx-auto">
          <div className="grid lg:grid-cols-2 items-center gap-12">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                  Welcome to{" "}
                  <span className="vine-text-gradient">VineNovel</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  The future of storytelling. Create, read, and discover amazing stories
                  through our innovative slide-based platform.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="vine-button-hero"
                  onClick={() => handlePanelAccess("writer")}
                >
                  <PenTool className="h-5 w-5 mr-2" />
                  {user ? "Start Writing" : "Login to Write"}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => handlePanelAccess("reader")}
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  {user ? "Start Reading" : "Login to Read"}
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="vine-card-elevated p-4 rounded-2xl">
                <img
                  src={heroImage}
                  alt="VineNovel Platform"
                  className="w-full h-auto rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Three Powerful Panels
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create, consume, and manage stories in one platform
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="vine-card text-center group cursor-pointer hover:vine-card-elevated transition-all duration-300">
                  <CardHeader>
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                  <CardDescription className="text-base mb-6">
                      {feature.description}
                      {user?.profile && !feature.requiresRole.includes(user.profile.role) && (
                        <span className="block text-destructive text-sm mt-2">
                          Access restricted to {feature.requiresRole.join(", ")} roles
                        </span>
                      )}
                    </CardDescription>
                    <Button 
                      className="w-full"
                      onClick={feature.action}
                      variant="outline"
                      disabled={user?.profile && !feature.requiresRole.includes(user.profile.role)}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      {user 
                        ? user.profile?.role && feature.requiresRole.includes(user.profile.role) 
                          ? "Launch Panel" 
                          : "Access Denied"
                        : "Login Required"
                      }
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Join Our Growing Community
            </h2>
            <p className="text-xl text-muted-foreground">
              See what makes VineNovel special
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 mx-auto text-center">
          <div className="space-y-6 max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose your path and join the VineNovel community today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="vine-button-hero"
                onClick={() => handlePanelAccess("writer")}
              >
                <PenTool className="h-5 w-5 mr-2" />
                {user ? "Start Writing Stories" : "Login to Write Stories"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => handlePanelAccess("reader")}
              >
                <BookOpen className="h-5 w-5 mr-2" />
                {user ? "Discover Amazing Stories" : "Login to Read Stories"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </div>
  )
}