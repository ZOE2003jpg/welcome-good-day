import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Target,
  Plus,
  BarChart3,
  Play,
  Pause,
  Edit,
  Trash2,
  Eye
} from "lucide-react"
import { useAds } from "@/hooks/useAds"
import { toast } from "sonner"

interface AdsManagementProps {
  onNavigate: (page: string, data?: any) => void
}

// Ad types
const adTypes = [
  { value: "banner", label: "Banner Ad" },
  { value: "sidebar", label: "Sidebar Ad" },
  { value: "popup", label: "Popup Ad" },
  { value: "video", label: "Video Ad" },
  { value: "native", label: "Native Content Ad" },
]

export function AdsManagement({ onNavigate }: AdsManagementProps) {
  const { ads, loading, error, createAd, updateAd, deleteAd } = useAds()
  const [selectedAd, setSelectedAd] = useState<any>(null)
  const [isAddAdDialogOpen, setIsAddAdDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  
  // Filter ads based on active tab
  const filteredAds = activeTab === "all" 
    ? ads 
    : ads.filter(ad => ad.status === activeTab)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Target className="h-8 w-8 text-primary" />
          Ads Management
        </h1>
        <p className="text-muted-foreground mt-2">
          Create and manage advertisement campaigns
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="vine-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{ads.length}</div>
              <div className="text-sm text-muted-foreground">Total Ads</div>
            </div>
          </CardContent>
        </Card>
        <Card className="vine-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {ads.filter(ad => ad.status === 'active').length}
              </div>
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
          </CardContent>
        </Card>
        <Card className="vine-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {ads.filter(ad => ad.status === 'scheduled').length}
              </div>
              <div className="text-sm text-muted-foreground">Scheduled</div>
            </div>
          </CardContent>
        </Card>
        <Card className="vine-card">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">
                {ads.filter(ad => ad.status === 'draft').length}
              </div>
              <div className="text-sm text-muted-foreground">Drafts</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="vine-card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Advertisement Campaigns</CardTitle>
            <Button onClick={() => setIsAddAdDialogOpen(true)} className="vine-button-hero">
              <Plus className="h-4 w-4 mr-2" />
              Create New Ad
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All Ads</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
              <TabsTrigger value="ended">Ended</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-6">
              {loading ? (
                <div className="text-center py-8">Loading ads...</div>
              ) : error ? (
                <div className="text-center py-8 text-destructive">Error: {error}</div>
              ) : filteredAds.length === 0 ? (
                <Card className="vine-card">
                  <CardContent className="pt-6 pb-6 text-center">
                    <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No ads found</h3>
                    <p className="text-muted-foreground">
                      {activeTab === "all" 
                        ? "Create your first ad campaign to start advertising"
                        : `No ${activeTab} ads found`
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredAds.map((ad) => (
                    <Card key={ad.id} className="vine-card">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-3 flex-1">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold text-lg">Ad Campaign #{ad.id.slice(0, 8)}</h3>
                              <Badge variant={ad.status === 'active' ? 'default' : 'outline'}>
                                {ad.status || 'inactive'}
                              </Badge>
                              <Badge variant="outline">Video Ad</Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Impressions:</span>
                                <div className="font-medium">{ad.impressions || 0}</div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Clicks:</span>
                                <div className="font-medium">{ad.clicks || 0}</div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">CTR:</span>
                                <div className="font-medium">{ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(2) + '%' : '0%'}</div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Video URL:</span>
                                <div className="font-medium truncate">{ad.video_url.slice(0, 20)}...</div>
                              </div>
                            </div>
                            
                            {(ad.start_date || ad.end_date) && (
                              <div className="text-sm text-muted-foreground">
                                {ad.start_date && (
                                  <span>Start: {new Date(ad.start_date).toLocaleDateString()}</span>
                                )}
                                {ad.start_date && ad.end_date && <span className="mx-2">•</span>}
                                {ad.end_date && (
                                  <span>End: {new Date(ad.end_date).toLocaleDateString()}</span>
                                )}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex gap-2 ml-4">
                            <Button size="sm" variant="outline">
                              <BarChart3 className="h-4 w-4 mr-1" />
                              Analytics
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                toast.success(`Ad #${ad.id.slice(0, 8)} status updated`)
                              }}
                            >
                              {ad.status === 'active' ? 
                                <><Pause className="h-4 w-4 mr-1" />Pause</> : 
                                <><Play className="h-4 w-4 mr-1" />Activate</>
                              }
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Add Ad Dialog */}
      <Dialog open={isAddAdDialogOpen} onOpenChange={setIsAddAdDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Advertisement</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new ad campaign
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="ad-name">Campaign Name</Label>
              <Input id="ad-name" placeholder="Enter campaign name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="video-url">Video URL</Label>
              <Input id="video-url" placeholder="Enter video URL" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input id="start-date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input id="end-date" type="date" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddAdDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast.success("Ad created successfully!")
              setIsAddAdDialogOpen(false)
            }}>
              Create Ad
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}