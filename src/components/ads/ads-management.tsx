import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  BarChart,
  DollarSign,
  Image,
  Eye,
  EyeOff,
  Calendar,
  Users,
  Target,
  Save,
  RefreshCw
} from "lucide-react";

// Sample data for ads
const ads = [
  {
    id: "1",
    name: "Summer Sale Promotion",
    type: "banner",
    status: "active",
    impressions: 12500,
    clicks: 450,
    ctr: "3.6%",
    spend: "$1,200",
    startDate: "2023-06-01",
    endDate: "2023-06-30",
    targeting: ["18-35", "US", "Mobile"],
  },
  {
    id: "2",
    name: "New Product Launch",
    type: "sidebar",
    status: "scheduled",
    impressions: 0,
    clicks: 0,
    ctr: "0%",
    spend: "$0",
    startDate: "2023-07-15",
    endDate: "2023-08-15",
    targeting: ["25-45", "Global", "All devices"],
  },
  {
    id: "3",
    name: "Holiday Special",
    type: "popup",
    status: "draft",
    impressions: 0,
    clicks: 0,
    ctr: "0%",
    spend: "$0",
    startDate: "",
    endDate: "",
    targeting: ["All ages", "US, EU", "All devices"],
  },
  {
    id: "4",
    name: "Membership Discount",
    type: "banner",
    status: "ended",
    impressions: 30200,
    clicks: 1250,
    ctr: "4.1%",
    spend: "$2,500",
    startDate: "2023-05-01",
    endDate: "2023-05-31",
    targeting: ["25-55", "Premium users", "All devices"],
  },
];

// Ad types
const adTypes = [
  { value: "banner", label: "Banner Ad" },
  { value: "sidebar", label: "Sidebar Ad" },
  { value: "popup", label: "Popup Ad" },
  { value: "video", label: "Video Ad" },
  { value: "native", label: "Native Content Ad" },
];

// Targeting options
const targetingOptions = {
  age: ["All ages", "13-17", "18-24", "25-34", "35-44", "45-54", "55-64", "65+"],
  location: ["Global", "US", "EU", "Asia", "Latin America", "Africa", "Australia"],
  devices: ["All devices", "Desktop", "Mobile", "Tablet"],
  userType: ["All users", "New users", "Returning users", "Premium users"],
};

export default function AdsManagement() {
  // State for dialogs
  const [isAddAdDialogOpen, setIsAddAdDialogOpen] = useState(false);
  const [isEditAdDialogOpen, setIsEditAdDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  
  // State for current selections
  const [currentAd, setCurrentAd] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  
  // Handler functions
  const handleEditAd = (ad) => {
    setCurrentAd(ad);
    setIsEditAdDialogOpen(true);
  };
  
  const handleDeleteAd = (ad) => {
    setCurrentAd(ad);
    setIsDeleteDialogOpen(true);
  };
  
  const handlePreviewAd = (ad) => {
    setCurrentAd(ad);
    setIsPreviewDialogOpen(true);
  };
  
  const confirmDeleteAd = () => {
    toast.success(`Deleted ad: ${currentAd?.name}`);
    setIsDeleteDialogOpen(false);
  };
  
  const handleStatusChange = (ad, newStatus) => {
    toast.success(`Ad "${ad.name}" status changed to ${newStatus}`);
  };

  // Filter ads based on active tab
  const filteredAds = activeTab === "all" 
    ? ads 
    : ads.filter(ad => ad.status === activeTab);

  return (
    <>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Ads Management</h2>
          <Button onClick={() => setIsAddAdDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Ad
          </Button>
        </div>
        
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Ads</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="ended">Ended</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {activeTab === "all" ? "All Advertisements" : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Ads`}
                  </CardTitle>
                  <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search ads..."
                      className="w-full pl-8"
                    />
                  </div>
                </div>
                <CardDescription>
                  {filteredAds.length} {filteredAds.length === 1 ? "advertisement" : "advertisements"} found
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredAds.map((ad) => (
                    <div
                      key={ad.id}
                      className="flex flex-col space-y-3 rounded-md border p-4 sm:flex-row sm:space-x-4 sm:space-y-0"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{ad.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {adTypes.find(type => type.value === ad.type)?.label}
                            </p>
                          </div>
                          <Badge
                            variant={
                              ad.status === "active" ? "default" :
                              ad.status === "scheduled" ? "outline" :
                              ad.status === "draft" ? "secondary" : "destructive"
                            }
                          >
                            {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
                          </Badge>
                        </div>
                        
                        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{ad.impressions.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BarChart className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{ad.ctr}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{ad.spend}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {ad.startDate ? `${ad.startDate.split('-')[1]}/${ad.startDate.split('-')[2]}` : "Not set"}
                              {ad.endDate ? ` - ${ad.endDate.split('-')[1]}/${ad.endDate.split('-')[2]}` : ""}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-2 flex flex-wrap gap-1">
                          {ad.targeting.map((target, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {target}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePreviewAd(ad)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Preview</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditAd(ad)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        {ad.status === "active" ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleStatusChange(ad, "paused")}
                          >
                            <EyeOff className="h-4 w-4" />
                            <span className="sr-only">Pause</span>
                          </Button>
                        ) : ad.status !== "ended" ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleStatusChange(ad, "active")}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Activate</span>
                          </Button>
                        ) : null}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteAd(ad)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {filteredAds.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Image className="h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">No ads found</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {activeTab === "all" 
                          ? "You haven't created any ads yet." 
                          : `You don't have any ${activeTab} ads.`}
                      </p>
                      <Button 
                        className="mt-4" 
                        onClick={() => setIsAddAdDialogOpen(true)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Ad
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>
              Summary of your advertising performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Impressions</p>
                      <p className="text-2xl font-bold">42,700</p>
                    </div>
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">+12.5% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Clicks</p>
                      <p className="text-2xl font-bold">1,700</p>
                    </div>
                    <BarChart className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">+8.2% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Average CTR</p>
                      <p className="text-2xl font-bold">3.98%</p>
                    </div>
                    <Target className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">-0.3% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Spend</p>
                      <p className="text-2xl font-bold">$3,700</p>
                    </div>
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">+15.3% from last month</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
      
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
            <div className="grid gap-2">
              <Label htmlFor="ad-name">Ad Name</Label>
              <Input id="ad-name" placeholder="Enter ad campaign name" />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="ad-type">Ad Type</Label>
              <Select>
                <SelectTrigger id="ad-type">
                  <SelectValue placeholder="Select ad type" />
                </SelectTrigger>
                <SelectContent>
                  {adTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input id="start-date" type="date" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input id="end-date" type="date" />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="budget">Budget</Label>
              <div className="relative">
                <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="budget" type="number" className="pl-8" placeholder="Enter budget amount" />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label>Targeting</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="age-targeting" className="text-sm">Age Groups</Label>
                  <Select>
                    <SelectTrigger id="age-targeting">
                      <SelectValue placeholder="Select age groups" />
                    </SelectTrigger>
                    <SelectContent>
                      {targetingOptions.age.map((age) => (
                        <SelectItem key={age} value={age}>
                          {age}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location-targeting" className="text-sm">Location</Label>
                  <Select>
                    <SelectTrigger id="location-targeting">
                      <SelectValue placeholder="Select locations" />
                    </SelectTrigger>
                    <SelectContent>
                      {targetingOptions.location.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="grid gap-2">
                  <Label htmlFor="device-targeting" className="text-sm">Devices</Label>
                  <Select>
                    <SelectTrigger id="device-targeting">
                      <SelectValue placeholder="Select devices" />
                    </SelectTrigger>
                    <SelectContent>
                      {targetingOptions.devices.map((device) => (
                        <SelectItem key={device} value={device}>
                          {device}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="user-targeting" className="text-sm">User Type</Label>
                  <Select>
                    <SelectTrigger id="user-targeting">
                      <SelectValue placeholder="Select user types" />
                    </SelectTrigger>
                    <SelectContent>
                      {targetingOptions.userType.map((userType) => (
                        <SelectItem key={userType} value={userType}>
                          {userType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="ad-content">Ad Content/Image</Label>
              <div className="flex items-center justify-center border-2 border-dashed rounded-md p-6">
                <div className="flex flex-col items-center space-y-2">
                  <Image className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Drag and drop your ad image here or click to browse
                  </p>
                  <Button variant="outline" size="sm">
                    Upload Image
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="save-draft" />
              <Label htmlFor="save-draft">Save as draft</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddAdDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast.success("New ad campaign created");
              setIsAddAdDialogOpen(false);
            }}>
              Create Ad
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Ad Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Advertisement</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this ad campaign?
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              This action cannot be undone. This will permanently delete the ad campaign
              and remove all associated data and analytics.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteAd}>
              Delete Ad
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Preview Ad Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Ad Preview</DialogTitle>
            <DialogDescription>
              Preview how your ad will appear to users
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {currentAd && (
              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <h3 className="font-medium">{currentAd.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {adTypes.find(type => type.value === currentAd.type)?.label}
                  </p>
                  
                  <div className="mt-4 flex items-center justify-center border rounded-md p-8">
                    <div className="flex flex-col items-center space-y-2">
                      <Image className="h-16 w-16 text-muted-foreground" />
                      <p className="text-sm text-center">
                        Ad preview placeholder for {currentAd.name}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm font-medium">Status</p>
                      <Badge
                        variant={
                          currentAd.status === "active" ? "default" :
                          currentAd.status === "scheduled" ? "outline" :
                          currentAd.status === "draft" ? "secondary" : "destructive"
                        }
                        className="mt-1"
                      >
                        {currentAd.status.charAt(0).toUpperCase() + currentAd.status.slice(1)}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Campaign Dates</p>
                      <p className="text-sm">
                        {currentAd.startDate ? `${currentAd.startDate}` : "Not set"}
                        {currentAd.endDate ? ` to ${currentAd.endDate}` : ""}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-sm font-medium">Targeting</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {currentAd.targeting.map((target, index) => (
                        <Badge key={index} variant="outline">
                          {target}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setIsPreviewDialogOpen(false);
              handleEditAd(currentAd);
            }}>
              Edit Ad
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}