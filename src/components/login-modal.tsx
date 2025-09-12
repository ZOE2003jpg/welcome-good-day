import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PenTool, BookOpen, Shield } from "lucide-react"
import { UserRole, useUser } from "@/components/user-context"

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [selectedRole, setSelectedRole] = useState<UserRole>("reader")
  const { login } = useUser()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password) {
      login(email, password, selectedRole)
      onOpenChange(false)
      setEmail("")
      setPassword("")
    }
  }

  const roleOptions = [
    {
      value: "reader" as UserRole,
      label: "Reader",
      icon: BookOpen,
      description: "Access reader panel and community features"
    },
    {
      value: "writer" as UserRole,
      label: "Writer", 
      icon: PenTool,
      description: "Create and manage stories, access analytics"
    },
    {
      value: "admin" as UserRole,
      label: "Admin",
      icon: Shield,
      description: "Full platform management and moderation"
    }
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Welcome to <span className="vine-text-gradient">VineNovel</span>
          </DialogTitle>
          <DialogDescription className="text-center">
            Choose your role and sign in to get started
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Role Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Select Your Role</Label>
            <Tabs value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
              <TabsList className="grid w-full grid-cols-3">
                {roleOptions.map((role) => {
                  const Icon = role.icon
                  return (
                    <TabsTrigger key={role.value} value={role.value} className="flex items-center gap-1">
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{role.label}</span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>
              
              {roleOptions.map((role) => (
                <TabsContent key={role.value} value={role.value} className="mt-4">
                  <Card className="vine-card">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-3 mb-2">
                        <role.icon className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">{role.label} Access</CardTitle>
                      </div>
                      <CardDescription>{role.description}</CardDescription>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Login Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full vine-button-hero">
            Sign In as {roleOptions.find(r => r.value === selectedRole)?.label}
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          <p>Demo credentials: Use any email/password combination</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}