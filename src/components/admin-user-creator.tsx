import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

const users = [
  { email: "olaoluhephzibah3@gmail.com", password: "vinenovel#2025", role: "admin" as const },
  { email: "jossyyoung@gmail.com", password: "vinenovel#2025", role: "writer" as const },
  { email: "hephzibaholaolu3@gmail.com", password: "vinenovel#2025", role: "reader" as const }
]

export function AdminUserCreator() {
  const [creating, setCreating] = useState(false)
  const { toast } = useToast()

  const createUsers = async () => {
    setCreating(true)
    
    for (const userData of users) {
      try {
        // Sign up the user
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              role: userData.role
            }
          }
        })

        if (signUpError) {
          console.error(`Error creating user ${userData.email}:`, signUpError)
          toast({
            title: "Error",
            description: `Failed to create user ${userData.email}: ${signUpError.message}`,
            variant: "destructive"
          })
          continue
        }

        if (data.user) {
          // Create profile directly
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              user_id: data.user.id,
              role: userData.role,
              status: 'active',
              username: userData.email.split('@')[0], // Use email prefix as username
              display_name: userData.email.split('@')[0]
            })

          if (profileError) {
            console.error(`Error creating profile for ${userData.email}:`, profileError)
            toast({
              title: "Profile Error",
              description: `User created but profile failed for ${userData.email}`,
              variant: "destructive"
            })
          } else {
            toast({
              title: "Success",
              description: `Created ${userData.role} user: ${userData.email}`,
            })
          }
        }
      } catch (error) {
        console.error(`Unexpected error for ${userData.email}:`, error)
        toast({
          title: "Error",
          description: `Unexpected error creating ${userData.email}`,
          variant: "destructive"
        })
      }
    }
    
    setCreating(false)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Test Users</CardTitle>
        <CardDescription>
          This will create the three requested users with their roles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          {users.map((user) => (
            <div key={user.email} className="text-sm">
              <strong>{user.role.toUpperCase()}:</strong> {user.email}
            </div>
          ))}
        </div>
        <Button 
          onClick={createUsers} 
          disabled={creating}
          className="w-full"
        >
          {creating ? "Creating Users..." : "Create All Users"}
        </Button>
      </CardContent>
    </Card>
  )
}