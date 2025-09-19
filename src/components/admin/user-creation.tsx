import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, Crown, CheckCircle } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { useUser } from "@/components/user-context"

interface UserCreationProps {
  onNavigate: (page: string, data?: any) => void
}

export function UserCreation({ onNavigate }: UserCreationProps) {
  const [loading, setLoading] = useState(false)
  const [created, setCreated] = useState<string[]>([])
  const { session } = useUser()

  const createUserProfile = async (email: string, role: "reader" | "writer" | "admin") => {
    try {
      // Create a profile for existing users
      const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers()
      
      if (usersError) throw usersError
      
      const user = users?.find((u: any) => u.email === email)
      
      if (user) {
        // User exists, create/update profile
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            user_id: user.id,
            role: role,
            status: 'active',
            username: email.split('@')[0],
            display_name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)
          })

        if (profileError) throw profileError
        return true
      } else {
        throw new Error(`User with email ${email} not found. They need to sign up first.`)
      }
    } catch (error) {
      console.error('Error creating profile:', error)
      throw error
    }
  }

  const handleCreateAllUsers = async () => {
    const users = [
      { email: "jossyyoungolaolu@gmail.com", role: "reader" as const },
      { email: "hephzibaholaolu3@gmail.com", role: "writer" as const },
      { email: "olaoluhephzibah3@gmail.com", role: "admin" as const }
    ]

    setLoading(true)
    const createdUsers: string[] = []

    for (const user of users) {
      try {
        await createUserProfile(user.email, user.role)
        createdUsers.push(user.email)
        toast.success(`Profile created for ${user.email} as ${user.role}`)
      } catch (error) {
        toast.error(`Failed to create profile for ${user.email}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    setCreated(createdUsers)
    setLoading(false)
    
    if (createdUsers.length === users.length) {
      toast.success("All user profiles created successfully!")
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <UserPlus className="h-8 w-8 text-primary" />
          User Profile Creation
        </h1>
        <p className="text-muted-foreground mt-2">
          Create profiles for the three specified users with their correct roles
        </p>
      </div>

      {/* User Creation */}
      <Card className="vine-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Create User Profiles
          </CardTitle>
          <CardDescription>
            This will create profiles for users who have already signed up
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">jossyyoungolaolu@gmail.com</div>
                    <div className="text-xs text-muted-foreground">→ Reader Role</div>
                  </div>
                  {created.includes("jossyyoungolaolu@gmail.com") && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">hephzibaholaolu3@gmail.com</div>
                    <div className="text-xs text-muted-foreground">→ Writer Role</div>
                  </div>
                  {created.includes("hephzibaholaolu3@gmail.com") && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">olaoluhephzibah3@gmail.com</div>
                    <div className="text-xs text-muted-foreground">→ Admin Role</div>
                  </div>
                  {created.includes("olaoluhephzibah3@gmail.com") && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>
              </Card>
            </div>
            
            <Button 
              onClick={handleCreateAllUsers}
              disabled={loading || created.length === 3}
              className="w-full vine-button-hero"
            >
              {loading ? "Creating Profiles..." : 
               created.length === 3 ? "All Profiles Created ✓" : 
               "Create All User Profiles"}
            </Button>

            {created.length > 0 && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Successfully Created:</h4>
                <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                  {created.map(email => (
                    <li key={email}>✓ {email}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Important Notes:</h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Users must sign up first before profiles can be created</li>
                <li>• After profile creation, users will be automatically routed to their correct panels</li>
                <li>• Refresh the page after creation to see updated user lists</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}