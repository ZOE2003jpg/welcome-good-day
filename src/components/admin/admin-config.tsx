import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { 
  Shield, 
  Plus, 
  Edit, 
  Trash2, 
  Key, 
  User,
  Clock,
  Search,
  UserCheck,
  Settings
} from "lucide-react"

interface AdminConfigProps {
  onNavigate: (page: string, data?: any) => void
}

export function AdminConfig({ onNavigate }: AdminConfigProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [newAdminEmail, setNewAdminEmail] = useState("")
  const [newAdminRole, setNewAdminRole] = useState("moderator")

  const mockAdmins = [
    {
      id: 1,
      name: "John Smith",
      email: "john@vinenovel.com",
      role: "super-admin",
      status: "active",
      lastLogin: "2 hours ago",
      createdDate: "Jan 1, 2024",
      twoFactorEnabled: true,
      loginAttempts: 0
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@vinenovel.com", 
      role: "content-moderator",
      status: "active",
      lastLogin: "1 day ago",
      createdDate: "Jan 15, 2024",
      twoFactorEnabled: true,
      loginAttempts: 0
    },
    {
      id: 3,
      name: "Mike Davis",
      email: "mike@vinenovel.com",
      role: "ad-manager",
      status: "inactive",
      lastLogin: "1 week ago",
      createdDate: "Feb 1, 2024",
      twoFactorEnabled: false,
      loginAttempts: 2
    },
    {
      id: 4,
      name: "Lisa Brown",
      email: "lisa@vinenovel.com",
      role: "moderator",
      status: "active",
      lastLogin: "30 minutes ago",
      createdDate: "Feb 10, 2024",
      twoFactorEnabled: true,
      loginAttempts: 0
    }
  ]

  const adminRoles = [
    {
      name: "super-admin",
      description: "Full access to all platform features and settings",
      permissions: ["all"],
      color: "destructive"
    },
    {
      name: "content-moderator", 
      description: "Manage content, users, and reports",
      permissions: ["content", "users", "reports"],
      color: "default"
    },
    {
      name: "ad-manager",
      description: "Manage advertisements and revenue",
      permissions: ["ads", "analytics"],
      color: "secondary"
    },
    {
      name: "moderator",
      description: "Basic moderation and user management",
      permissions: ["reports", "comments"],
      color: "outline"
    }
  ]

  const filteredAdmins = mockAdmins.filter(admin =>
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleColor = (role: string) => {
    const roleConfig = adminRoles.find(r => r.name === role)
    return roleConfig?.color || "outline"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "default"
      case "inactive": return "secondary"
      case "suspended": return "destructive"
      default: return "outline"
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          Admin Configuration
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage admin accounts, roles, and security settings
        </p>
      </div>

      {/* Add New Admin */}
      <Card className="vine-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Admin
          </CardTitle>
          <CardDescription>
            Create a new admin account with specific role permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="admin-email">Email Address</Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="admin@vinenovel.com"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="admin-role">Role</Label>
              <Select value={newAdminRole} onValueChange={setNewAdminRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {adminRoles.map((role) => (
                    <SelectItem key={role.name} value={role.name}>
                      {role.name.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button className="vine-button-hero w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Admin
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Roles */}
      <Card className="vine-card">
        <CardHeader>
          <CardTitle>Admin Roles & Permissions</CardTitle>
          <CardDescription>
            Define what each admin role can access and manage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {adminRoles.map((role) => (
              <Card key={role.name} className="vine-card">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold capitalize">
                        {role.name.replace("-", " ")}
                      </h3>
                      <Badge variant={role.color as any}>
                        {role.name}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {role.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map((permission) => (
                        <Badge key={permission} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                    <Button size="sm" variant="outline" className="w-full">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit Role
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search Admins */}
      <Card className="vine-card">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search admins by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Admin Accounts */}
      <Card className="vine-card">
        <CardHeader>
          <CardTitle>Admin Accounts</CardTitle>
          <CardDescription>
            Manage existing admin accounts and their access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAdmins.map((admin) => (
              <Card key={admin.id} className="vine-card">
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Admin Avatar */}
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-primary" />
                    </div>

                    {/* Admin Info */}
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-lg font-semibold">{admin.name}</h3>
                            <Badge variant={getRoleColor(admin.role) as any}>
                              {admin.role.replace("-", " ")}
                            </Badge>
                            <Badge variant={getStatusColor(admin.status) as any}>
                              {admin.status}
                            </Badge>
                            {admin.twoFactorEnabled && (
                              <Badge variant="outline">
                                <Key className="h-3 w-3 mr-1" />
                                2FA
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground">{admin.email}</p>
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Last Login:</span>
                              <span className="ml-2 font-medium">{admin.lastLogin}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Created:</span>
                              <span className="ml-2 font-medium">{admin.createdDate}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Failed Logins:</span>
                              <span className="ml-2 font-medium">{admin.loginAttempts}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          
                          <Button size="sm" variant="outline">
                            <Settings className="h-4 w-4 mr-1" />
                            Permissions
                          </Button>

                          <Button size="sm" variant="outline">
                            <Key className="h-4 w-4 mr-1" />
                            Reset Password
                          </Button>

                          {admin.status === "active" ? (
                            <Button size="sm" variant="outline">
                              <Clock className="h-4 w-4 mr-1" />
                              Suspend
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline">
                              <UserCheck className="h-4 w-4 mr-1" />
                              Activate
                            </Button>
                          )}

                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="vine-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Configure security policies for admin accounts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Force Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Require all admins to enable 2FA
                </p>
              </div>
              <Switch defaultChecked={true} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Password Complexity Requirements</Label>
                <p className="text-sm text-muted-foreground">
                  Enforce strong password policies
                </p>
              </div>
              <Switch defaultChecked={true} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-lock Inactive Sessions</Label>
                <p className="text-sm text-muted-foreground">
                  Lock admin sessions after inactivity
                </p>
              </div>
              <Switch defaultChecked={true} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Log All Admin Actions</Label>
                <p className="text-sm text-muted-foreground">
                  Track all administrative activities
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
                defaultValue="30"
                min="5"
                max="120"
              />
            </div>

            <div>
              <Label htmlFor="max-failed-logins">Max Failed Login Attempts</Label>
              <Input
                id="max-failed-logins"
                type="number"
                defaultValue="3"
                min="3"
                max="10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">
              {mockAdmins.filter(a => a.status === "active").length}
            </div>
            <div className="text-sm text-muted-foreground">Active Admins</div>
          </CardContent>
        </Card>
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {mockAdmins.filter(a => a.twoFactorEnabled).length}
            </div>
            <div className="text-sm text-muted-foreground">2FA Enabled</div>
          </CardContent>
        </Card>
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {mockAdmins.filter(a => a.role === "super-admin").length}
            </div>
            <div className="text-sm text-muted-foreground">Super Admins</div>
          </CardContent>
        </Card>
        <Card className="vine-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-destructive">
              {mockAdmins.reduce((sum, a) => sum + a.loginAttempts, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Failed Logins</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}