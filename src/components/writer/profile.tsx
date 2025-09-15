import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  ArrowLeft,
  User,
  Edit,
  Camera,
  BookOpen,
  Calendar,
  Eye,
  Heart,
  Users,
  Award,
  Link as LinkIcon,
  Save
} from "lucide-react"

interface ProfileProps {
  onNavigate: (page: string, data?: any) => void
}

export function Profile({ onNavigate }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    displayName: "Alex Morgan",
    penName: "A.M. Storyteller", 
    bio: "Passionate science fiction writer with a love for exploring the boundaries between technology and humanity. I believe in the power of stories to inspire and transform.",
    location: "San Francisco, CA",
    website: "alexmorgan.author",
    twitter: "@alexmorgan_sf",
    instagram: "@amstoryteller"
  })

  const writerStats = {
    totalStories: 12,
    totalReads: 145230,
    totalFollowers: 1420,
    averageRating: 4.8,
    joinedDate: "January 2023"
  }

  const publishedStories = [
    {
      id: 1,
      title: "The Digital Awakening",
      genre: "Sci-Fi",
      status: "Completed",
      chapters: 15,
      reads: 45200,
      likes: 2150,
      rating: 4.9,
      publishedDate: "March 2024"
    },
    {
      id: 2,
      title: "The Last Algorithm",
      genre: "Thriller",
      status: "Ongoing",
      chapters: 12,
      reads: 32100,
      likes: 1680,
      rating: 4.7,
      publishedDate: "February 2024"
    },
    {
      id: 3,
      title: "Memories in the Rain",
      genre: "Romance",
      status: "Completed",
      chapters: 8,
      reads: 18950,
      likes: 950,
      rating: 4.8,
      publishedDate: "January 2024"
    },
    {
      id: 4,
      title: "Echoes of Tomorrow", 
      genre: "Fantasy",
      status: "Completed",
      chapters: 20,
      reads: 28200,
      likes: 1450,
      rating: 4.6,
      publishedDate: "December 2023"
    }
  ]

  const achievements = [
    {
      title: "Trending Writer",
      description: "Featured in trending stories 5+ times",
      icon: Award,
      earned: true
    },
    {
      title: "Reader's Choice",
      description: "Story rated 4.5+ stars by 100+ readers",
      icon: Heart,
      earned: true
    },
    {
      title: "Prolific Author",
      description: "Published 10+ stories",
      icon: BookOpen,
      earned: true
    },
    {
      title: "Community Favorite",
      description: "Gained 1000+ followers",
      icon: Users,
      earned: true
    }
  ]

  const handleSave = () => {
    // Handle save profile logic here
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => onNavigate("dashboard")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Writer Profile</h1>
            <p className="text-muted-foreground">Manage your public writer profile</p>
          </div>
        </div>
        <Button 
          variant={isEditing ? "default" : "outline"}
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className={isEditing ? "vine-button-hero" : ""}
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="vine-card">
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="text-lg">AM</AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button 
                      size="icon"
                      variant="secondary" 
                      className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              {isEditing && (
                <div className="text-center">
                  <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Upload New Photo
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Writer Stats */}
          <Card className="vine-card">
            <CardHeader>
              <CardTitle>Writer Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stories Published</span>
                <span className="font-medium">{writerStats.totalStories}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Reads</span>
                <span className="font-medium">{writerStats.totalReads.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Followers</span>
                <span className="font-medium">{writerStats.totalFollowers.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Average Rating</span>
                <span className="font-medium">{writerStats.averageRating} ⭐</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Member Since</span>
                <span className="font-medium">{writerStats.joinedDate}</span>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="vine-card">
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div key={index} className={`flex items-center gap-3 p-2 rounded-lg ${
                    achievement.earned ? "bg-primary/10" : "bg-secondary/20"
                  }`}>
                    <achievement.icon className={`h-5 w-5 ${
                      achievement.earned ? "text-primary" : "text-muted-foreground"
                    }`} />
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        achievement.earned ? "" : "text-muted-foreground"
                      }`}>
                        {achievement.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Details Form */}
          <Card className="vine-card">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                This information will be visible to readers on your profile page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="display-name">Display Name</Label>
                  <Input
                    id="display-name"
                    value={profileData.displayName}
                    onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pen-name">Pen Name</Label>
                  <Input
                    id="pen-name"
                    value={profileData.penName}
                    onChange={(e) => setProfileData({...profileData, penName: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  disabled={!isEditing}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={profileData.location}
                  onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-4">
                <Label>Social Links</Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Website URL"
                      value={profileData.website}
                      onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground w-4">@</span>
                    <Input
                      placeholder="Twitter handle"
                      value={profileData.twitter}
                      onChange={(e) => setProfileData({...profileData, twitter: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground w-4">@</span>
                    <Input
                      placeholder="Instagram handle"
                      value={profileData.instagram}
                      onChange={(e) => setProfileData({...profileData, instagram: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Published Stories */}
          <Card className="vine-card">
            <CardHeader>
              <CardTitle>Published Works</CardTitle>
              <CardDescription>Stories visible on your public profile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {publishedStories.map((story) => (
                  <div key={story.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-medium">{story.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <Badge variant="outline">{story.genre}</Badge>
                        <span>{story.chapters} chapters</span>
                        <span>{story.status}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {story.reads.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {story.likes.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          ⭐ {story.rating}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => onNavigate("manage-chapters")}>
                      <BookOpen className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}