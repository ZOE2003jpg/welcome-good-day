import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { Trash2, AlertTriangle, Loader2 } from "lucide-react"

interface ClearStoriesProps {
  onNavigate: (page: string, data?: any) => void
}

export function ClearStories({ onNavigate }: ClearStoriesProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteAllStories = async () => {
    try {
      setIsDeleting(true)
      
      const { data, error } = await supabase.functions.invoke('delete-all-stories')
      
      if (error) {
        throw error
      }
      
      toast.success("All stories deleted successfully!")
    } catch (error) {
      console.error('Error deleting stories:', error)
      toast.error("Failed to delete stories. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Trash2 className="h-8 w-8 text-destructive" />
          Clear All Stories
        </h1>
        <p className="text-muted-foreground mt-2">
          Permanently delete all stories from the database
        </p>
      </div>

      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            This action will permanently delete all stories, chapters, slides, comments, likes, and related data from the database. This cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isDeleting}>
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete All Stories
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete:
                  <br />
                  • All stories and their content
                  <br />
                  • All chapters and slides
                  <br />
                  • All comments and likes
                  <br />
                  • All reading progress and library entries
                  <br />
                  <br />
                  Type "DELETE ALL STORIES" to confirm you understand this is permanent.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteAllStories}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Yes, Delete Everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
}