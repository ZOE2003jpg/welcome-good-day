import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  User, 
  Edit, 
  Save, 
  X, 
  BookOpen, 
  Heart, 
  Eye, 
  Star,
  Calendar,
  MapPin,
  Mail,
  Globe,
  Twitter,
  Instagram
} from "lucide-react"
import { useUser } from "@/components/user-context"
import { useStories } from "@/hooks/useStories"

interface ProfileProps {
  onNavigate: (page: string, data?: any) => void
}

export function Profile({ onNavigate }: ProfileProps) {
  const { user } = useUser()
  const { stories, loading: storiesLoading } = useStories()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    displayName: user?.profile?.display_name || "Writer",
    penName: user?.profile?.username || "writer", 
    bio: user?.profile?.bio || "No bio available",
    location: "",
    website: "",
    twitter: "",
    instagram: ""
  })

  // Calculate real stats from stories data
  const userStories = stories.filter(s => s.author_id === user?.id)
  const writerStats = {
    totalStories: userStories.length,
    totalReads: userStories.reduce((sum, story) => sum + story.view_count, 0),
    totalFollowers: 0, // This would need a followers table
    averageRating: 0, // This would need a ratings system
    joinedDate: user?.profile?.created_at ? new Date(user.profile.created_at).toLocaleDateString() : "Unknown"
  }

  // Filter published stories by current user
  const publishedStories = userStories.filter(s => s.status === 'published')

  const handleSave = () => {
    setIsEditing(false)
    // Here you would typically save to your backend
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset form to original values
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <User className="h-8 w-8 text-primary" />
          Writer Profile
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your writer profile and view your publishing statistics
        </p>
      </div>

      {/* Profile Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <Card className="vine-card lg:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user?.profile?.avatar_url || ""} alt="Profile" />
                <AvatarFallback>
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="flex items-center justify-center gap-2">
              {isEditing ? (
                <Input 
                  value={profileData.displayName}
                  onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
                  className="text-center"
                />
              ) : (
                profileData.displayName
              )}
            </CardTitle>
            <CardDescription>
              {isEditing ? (
                <Input 
                  value={profileData.penName}
                  onChange={(e) => setProfileData({...profileData, penName: e.target.value})}
                  className="text-center"
                />
              ) : (
                `@${profileData.penName}`
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location"
                    value={profileData.location}
                    onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                    placeholder="Your location"
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input 
                    id="website"
                    value={profileData.website}
                    onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                    placeholder="yourwebsite.com"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} size="sm" className="flex-1">
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm" className="flex-1">
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {profileData.bio}
                </p>
                
                {profileData.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{profileData.location}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {writerStats.joinedDate}</span>
                </div>

                {profileData.website && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4" />
                    <a href={`https://${profileData.website}`} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                      {profileData.website}
                    </a>
                  </div>
                )}

                <Button onClick={() => setIsEditing(true)} variant="outline" className="w-full">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats and Stories */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="vine-card text-center">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary">{writerStats.totalStories}</div>
                <div className="text-sm text-muted-foreground">Stories</div>
              </CardContent>
            </Card>
            <Card className="vine-card text-center">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{writerStats.totalReads.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Reads</div>
              </CardContent>
            </Card>
            <Card className="vine-card text-center">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{writerStats.totalFollowers.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Followers</div>
              </CardContent>
            </Card>
            <Card className="vine-card text-center">
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {writerStats.averageRating > 0 ? writerStats.averageRating : "N/A"}
                </div>
                <div className="text-sm text-muted-foreground">Avg Rating</div>
              </CardContent>
            </Card>
          </div>

          {/* Published Stories */}
          <Card className="vine-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Published Stories
              </CardTitle>
              <CardDescription>
                Your published works and their performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              {storiesLoading ? (
                <div className="text-center py-8">Loading stories...</div>
              ) : publishedStories.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No published stories yet</p>
                  <p className="text-sm">Start writing to see your stories here</p>
                  <Button 
                    className="mt-4"
                    onClick={() => onNavigate("create-story")}
                  >
                    Create Your First Story
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {publishedStories.map((story) => (
                    <Card key={story.id} className="vine-card">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold">{story.title}</h3>
                              <Badge variant={story.status === 'published' ? 'default' : 'secondary'}>
                                {story.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{story.genre}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                <span>{story.view_count.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="h-4 w-4" />
                                <span>{story.like_count}</span>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Created: {new Date(story.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}