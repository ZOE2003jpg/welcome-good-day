import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Play, 
  Eye, 
  Plus, 
  Trash2, 
  BarChart3,
  Search,
  Calendar,
  TrendingUp,
  DollarSign,
  Filter
} from "lucide-react"
import { useAds } from "@/hooks/useAds"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AdsManagementProps {
  onNavigate: (page: string, data?: any) => void
}

export function AdsManagement({ onNavigate }: AdsManagementProps) {
  const { ads, loading, createAd, updateAd, deleteAd } = useAds()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedAd, setSelectedAd] = useState<any>(null)
  const [newAd, setNewAd] = useState({
    video_url: "",
    start_date: "",
    end_date: ""
  })

  // Filter ads based on search query and status
  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.video_url.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || ad.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAddAd = async () => {
    try {
      await createAd(newAd)
      setShowAddDialog(false)
      setNewAd({
        video_url: "",
        start_date: "",
        end_date: ""
      })
      toast({
        title: "Ad created",
        description: "The ad has been created successfully."
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create ad.",
        variant: "destructive"
      })
    }
  }

  const handleEditAd = async () => {
    try {
      if (!selectedAd) return
      await updateAd(selectedAd.id, {
        video_url: selectedAd.video_url,
        start_date: selectedAd.start_date,
        end_date: selectedAd.end_date,
        status: selectedAd.status
      })
      setShowEditDialog(false)
      toast({
        title: "Ad updated",
        description: "The ad has been updated successfully."
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update ad.",
        variant: "destructive"
      })
    }
  }

  const handleDeleteAd = async () => {
    try {
      if (!selectedAd) return
      await deleteAd(selectedAd.id)
      setShowDeleteDialog(false)
      toast({
        title: "Ad deleted",
        description: "The ad has been deleted successfully."
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete ad.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Ads Management</h2>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Ad
        </Button>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">Ad List</TabsTrigger>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search ads..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="ended">Ended</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {filteredAds.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    {loading ? "Loading ads..." : "No ads found"}
                  </div>
                ) : (
                  filteredAds.map((ad) => (
                    <Card key={ad.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex items-start">
                          <div className="bg-muted h-24 w-40 flex items-center justify-center">
                            <Play className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <div className="p-4 flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-medium truncate max-w-md">{ad.video_url}</h3>
                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                  <Calendar className="h-3.5 w-3.5 mr-1" />
                                  <span>
                                    {new Date(ad.start_date).toLocaleDateString()} - {new Date(ad.end_date).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <Badge variant={
                                ad.status === "active" ? "default" :
                                ad.status === "scheduled" ? "outline" :
                                ad.status === "ended" ? "secondary" : "destructive"
                              }>
                                {ad.status || "Active"}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center space-x-4 text-sm">
                                <div className="flex items-center">
                                  <Eye className="h-3.5 w-3.5 mr-1" />
                                  <span>{ad.impressions.toLocaleString()} views</span>
                                </div>
                                <div className="flex items-center">
                                  <TrendingUp className="h-3.5 w-3.5 mr-1" />
                                  <span>{((ad.clicks / ad.impressions) * 100 || 0).toFixed(2)}% CTR</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm" onClick={() => {
                                  setSelectedAd(ad)
                                  setShowEditDialog(true)
                                }}>
                                  Edit
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => {
                                  setSelectedAd(ad)
                                  setShowDeleteDialog(true)
                                }}>
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
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
        
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {ads.reduce((sum, ad) => sum + ad.impressions, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across all ad campaigns
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {ads.reduce((sum, ad) => sum + ad.clicks, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across all ad campaigns
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average CTR</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(ads.reduce((sum, ad) => sum + ad.clicks, 0) / 
                    ads.reduce((sum, ad) => sum + ad.impressions, 0) * 100 || 0).toFixed(2)}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Click-through rate
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Ad Performance</CardTitle>
              <CardDescription>
                Comparison of impressions and clicks by ad
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <BarChart3 className="h-16 w-16 text-muted-foreground" />
                <div className="ml-4 text-muted-foreground">
                  Performance chart visualization would appear here
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Ad Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Ad</DialogTitle>
            <DialogDescription>
              Create a new advertisement campaign
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="video_url" className="text-sm font-medium">Video URL</label>
              <Input
                id="video_url"
                placeholder="https://example.com/video.mp4"
                value={newAd.video_url}
                onChange={(e) => setNewAd({...newAd, video_url: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="start_date" className="text-sm font-medium">Start Date</label>
                <Input
                  id="start_date"
                  type="date"
                  value={newAd.start_date}
                  onChange={(e) => setNewAd({...newAd, start_date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="end_date" className="text-sm font-medium">End Date</label>
                <Input
                  id="end_date"
                  type="date"
                  value={newAd.end_date}
                  onChange={(e) => setNewAd({...newAd, end_date: e.target.value})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddAd}>Create Ad</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Ad Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Ad</DialogTitle>
            <DialogDescription>
              Modify the advertisement details
            </DialogDescription>
          </DialogHeader>
          {selectedAd && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label htmlFor="edit_video_url" className="text-sm font-medium">Video URL</label>
                <Input
                  id="edit_video_url"
                  placeholder="https://example.com/video.mp4"
                  value={selectedAd.video_url}
                  onChange={(e) => setSelectedAd({...selectedAd, video_url: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit_start_date" className="text-sm font-medium">Start Date</label>
                  <Input
                    id="edit_start_date"
                    type="date"
                    value={selectedAd.start_date}
                    onChange={(e) => setSelectedAd({...selectedAd, start_date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit_end_date" className="text-sm font-medium">End Date</label>
                  <Input
                    id="edit_end_date"
                    type="date"
                    value={selectedAd.end_date}
                    onChange={(e) => setSelectedAd({...selectedAd, end_date: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="edit_status" className="text-sm font-medium">Status</label>
                <Select 
                  value={selectedAd.status || "active"} 
                  onValueChange={(value) => setSelectedAd({...selectedAd, status: value})}
                >
                  <SelectTrigger id="edit_status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="ended">Ended</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={handleEditAd}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Ad Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Ad</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this ad? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteAd}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}