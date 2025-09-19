import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserCheck, Users, Crown, Search } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { useProfiles } from "@/hooks/useProfiles"

interface UserPromotionProps {
  onNavigate: (page: string, data?: any) => void
}

export function UserPromotion({ onNavigate }: UserPromotionProps) {
  const [userId, setUserId] = useState("")
  const [role, setRole] = useState<"reader" | "writer" | "admin">("reader")
  const [loading, setLoading] = useState(false)
  const { profiles, updateProfile, fetchProfiles } = useProfiles()

  const promoteUserById = async (userIdInput: string, newRole: "reader" | "writer" | "admin") => {
    setLoading(true)
    try {
      await updateProfile(userIdInput, { role: newRole })
      toast.success(`User promoted to ${newRole}`)
      await fetchProfiles()
    } catch (error) {
      console.error('Error promoting user:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to promote user')
    } finally {
      setLoading(false)
    }
  }

  const handlePromoteUser = async () => {
    if (!userId.trim()) {
      toast.error("Please enter a user ID")
      return
    }
    
    await promoteUserById(userId.trim(), role)
    setUserId("")
  }

  const handlePromoteByRole = async (targetRole: "reader" | "writer" | "admin", profileToUpdate: any) => {
    await promoteUserById(profileToUpdate.user_id, targetRole)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <UserCheck className="h-8 w-8 text-primary" />
          User Promotion
        </h1>
        <p className="text-muted-foreground mt-2">
          Promote users to different roles: Reader, Writer, or Admin
        </p>
      </div>

      {/* Individual User Promotion */}
      <Card className="vine-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Promote User by ID
          </CardTitle>
          <CardDescription>
            Promote users by their user ID (found in the users list below)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="user-id">User ID</Label>
                <Input
                  id="user-id"
                  placeholder="Enter user ID..."
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-role">New Role</Label>
                <Select value={role} onValueChange={(value: "reader" | "writer" | "admin") => setRole(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reader">Reader</SelectItem>
                    <SelectItem value="writer">Writer</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button 
              onClick={handlePromoteUser}
              disabled={loading || !userId.trim()}
              className="vine-button-hero"
            >
              {loading ? "Promoting..." : "Promote User"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Users List */}
      <Card className="vine-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Current Users
          </CardTitle>
          <CardDescription>
            All registered users and their current roles - click buttons to change roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profiles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No users found
              </div>
            ) : (
              <div className="grid gap-2">
                {profiles.map((profile) => (
                  <div key={profile.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">
                        {profile.display_name || profile.username || "Anonymous"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ID: {profile.user_id}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Status: {profile.status || 'active'}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`inline-flex px-3 py-1 rounded-md text-sm font-medium ${
                        profile.role === 'admin' ? 'bg-red-100 text-red-800' :
                        profile.role === 'writer' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                      </div>
                      <div className="flex gap-1">
                        {profile.role !== 'reader' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handlePromoteByRole('reader', profile)}
                            disabled={loading}
                          >
                            → Reader
                          </Button>
                        )}
                        {profile.role !== 'writer' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handlePromoteByRole('writer', profile)}
                            disabled={loading}
                          >
                            → Writer
                          </Button>
                        )}
                        {profile.role !== 'admin' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handlePromoteByRole('admin', profile)}
                            disabled={loading}
                          >
                            → Admin
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="vine-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Instructions for Specific Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>To promote the three specific users mentioned:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>jossyyoungolaolu@gmail.com</strong> → Find their user ID above and promote to Reader</li>
              <li><strong>hephzibaholaolu3@gmail.com</strong> → Find their user ID above and promote to Writer</li>
              <li><strong>olaoluhephzibah3@gmail.com</strong> → Find their user ID above and promote to Admin</li>
            </ul>
            <p className="text-muted-foreground mt-2">
              Users need to be registered first (sign up) before they appear in the list above.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}