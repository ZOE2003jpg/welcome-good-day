import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  UserCheck, 
  Shield, 
  Plus, 
  Trash2, 
  Settings,
  Search,
  Lock,
  Key
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface AdminConfigProps {
  onNavigate: (page: string, data?: any) => void
}

export function AdminConfig({ onNavigate }: AdminConfigProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null)
  const [newAdmin, setNewAdmin] = useState({
    email: "",
    name: "",
    role: "content_moderator"
  })

  // Sample admin data
  const [admins, setAdmins] = useState([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "super_admin",
      lastLogin: "2023-09-15T10:30:00Z"
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "content_moderator",
      lastLogin: "2023-09-14T14:45:00Z"
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@example.com",
      role: "ad_manager",
      lastLogin: "2023-09-13T09:15:00Z"
    }
  ])

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    passwordExpiry: 90,
    sessionTimeout: 30,
    ipRestriction: false,
    auditLogging: true
  })

  // Filter admins based on search query
  const filteredAdmins = admins.filter(admin => 
    admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddAdmin = () => {
    const newAdminWithId = {
      ...newAdmin,
      id: Math.random().toString(36).substring(2, 9),
      lastLogin: new Date().toISOString()
    }
    setAdmins([...admins, newAdminWithId])
    setShowAddDialog(false)
    setNewAdmin({
      email: "",
      name: "",
      role: "content_moderator"
    })
    toast({
      title: "Admin added",
      description: "The admin has been added successfully."
    })
  }

  const handleEditAdmin = () => {
    if (!selectedAdmin) return
    setAdmins(admins.map(admin => 
      admin.id === selectedAdmin.id ? selectedAdmin : admin
    ))
    setShowEditDialog(false)
    toast({
      title: "Admin updated",
      description: "The admin has been updated successfully."
    })
  }

  const handleDeleteAdmin = () => {
    if (!selectedAdmin) return
    setAdmins(admins.filter(admin => admin.id !== selectedAdmin.id))
    setShowDeleteDialog(false)
    toast({
      title: "Admin deleted",
      description: "The admin has been deleted successfully."
    })
  }

  const handleSecuritySettingChange = (setting: string, value: any) => {
    setSecuritySettings({
      ...securitySettings,
      [setting]: value
    })
    toast({
      title: "Settings updated",
      description: `${setting} has been updated successfully.`
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Admin Configuration</h2>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Admin
        </Button>
      </div>

      <Tabs defaultValue="admins" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="admins">Admin Accounts</TabsTrigger>
          <TabsTrigger value="security">Security Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="admins" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search admins..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                {filteredAdmins.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    No admins found
                  </div>
                ) : (
                  filteredAdmins.map((admin) => (
                    <Card key={admin.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{admin.name}</h3>
                            <p className="text-sm text-muted-foreground">{admin.email}</p>
                            <div className="flex items-center mt-2">
                              <Badge variant={
                                admin.role === "super_admin" ? "default" :
                                admin.role === "content_moderator" ? "outline" : "secondary"
                              }>
                                {admin.role.replace("_", " ")}
                              </Badge>
                              <span className="text-xs text-muted-foreground ml-3">
                                Last login: {new Date(admin.lastLogin).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={() => {
                              setSelectedAdmin(admin)
                              setShowEditDialog(true)
                            }}>
                              Edit
                            </Button>
                            {admin.role !== "super_admin" && (
                              <Button variant="destructive" size="sm" onClick={() => {
                                setSelectedAdmin(admin)
                                setShowDeleteDialog(true)
                              }}>
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security settings for the admin panel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Require all admins to use 2FA
                  </p>
                </div>
                <Switch
                  id="two-factor"
                  checked={securitySettings.twoFactorAuth}
                  onCheckedChange={(checked) => 
                    handleSecuritySettingChange("twoFactorAuth", checked)
                  }
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="password-expiry"
                    type="number"
                    value={securitySettings.passwordExpiry}
                    onChange={(e) => 
                      handleSecuritySettingChange("passwordExpiry", parseInt(e.target.value))
                    }
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">
                    Days until password reset is required
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="session-timeout"
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => 
                      handleSecuritySettingChange("sessionTimeout", parseInt(e.target.value))
                    }
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">
                    Minutes of inactivity before automatic logout
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="ip-restriction">IP Restriction</Label>
                  <p className="text-sm text-muted-foreground">
                    Limit admin access to specific IP addresses
                  </p>
                </div>
                <Switch
                  id="ip-restriction"
                  checked={securitySettings.ipRestriction}
                  onCheckedChange={(checked) => 
                    handleSecuritySettingChange("ipRestriction", checked)
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="audit-logging">Audit Logging</Label>
                  <p className="text-sm text-muted-foreground">
                    Log all admin actions for security review
                  </p>
                </div>
                <Switch
                  id="audit-logging"
                  checked={securitySettings.auditLogging}
                  onCheckedChange={(checked) => 
                    handleSecuritySettingChange("auditLogging", checked)
                  }
                />
              </div>
              
              <Button className="w-full mt-4">
                <Shield className="h-4 w-4 mr-2" />
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Admin Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Admin</DialogTitle>
            <DialogDescription>
              Create a new administrator account
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Full Name"
                value={newAdmin.name}
                onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={newAdmin.role} 
                onValueChange={(value) => setNewAdmin({...newAdmin, role: value})}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="content_moderator">Content Moderator</SelectItem>
                  <SelectItem value="ad_manager">Ad Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddAdmin}>Add Admin</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Admin Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Admin</DialogTitle>
            <DialogDescription>
              Modify administrator details
            </DialogDescription>
          </DialogHeader>
          {selectedAdmin && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="edit_name">Name</Label>
                <Input
                  id="edit_name"
                  placeholder="Full Name"
                  value={selectedAdmin.name}
                  onChange={(e) => setSelectedAdmin({...selectedAdmin, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_email">Email</Label>
                <Input
                  id="edit_email"
                  type="email"
                  placeholder="email@example.com"
                  value={selectedAdmin.email}
                  onChange={(e) => setSelectedAdmin({...selectedAdmin, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_role">Role</Label>
                <Select 
                  value={selectedAdmin.role} 
                  onValueChange={(value) => setSelectedAdmin({...selectedAdmin, role: value})}
                  disabled={selectedAdmin.role === "super_admin"}
                >
                  <SelectTrigger id="edit_role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="content_moderator">Content Moderator</SelectItem>
                    <SelectItem value="ad_manager">Ad Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={handleEditAdmin}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Admin Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Admin</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this admin? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteAdmin}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}