import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Trash2, Plus, Edit, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Profile, Link } from "@shared/schema";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: Profile;
  links: Link[];
  onNewLink: () => void;
  onEditLink: (link: Link) => void;
  onLogout?: () => void;
}

export default function AdminPanel({ 
  isOpen, 
  onClose, 
  profile, 
  links, 
  onNewLink, 
  onEditLink,
  onLogout 
}: AdminPanelProps) {
  const [username, setUsername] = useState(profile?.username || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const backgroundUploadRef = useRef<HTMLInputElement>(null);
  const profileUploadRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: Partial<Profile>) => {
      const response = await apiRequest("PUT", "/api/profile", profileData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteLinkMutation = useMutation({
    mutationFn: async (linkId: number) => {
      await apiRequest("DELETE", `/api/links/${linkId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/links"] });
      toast({
        title: "Link deleted",
        description: "The link has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete link. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (file: File, type: 'background' | 'profile') => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      updateProfileMutation.mutate({
        username: profile?.username || "",
        bio: profile?.bio || "",
        profilePicture: type === 'profile' ? result : profile?.profilePicture,
        backgroundImage: type === 'background' ? result : profile?.backgroundImage,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, 'background');
    }
  };

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, 'profile');
    }
  };

  const handleRemoveBackground = () => {
    updateProfileMutation.mutate({
      username: profile?.username || "",
      bio: profile?.bio || "",
      profilePicture: profile?.profilePicture,
      backgroundImage: "",
    });
  };

  const handleUpdateText = () => {
    updateProfileMutation.mutate({
      username,
      bio,
      profilePicture: profile?.profilePicture,
      backgroundImage: profile?.backgroundImage,
    });
  };

  const handleDeleteLink = (linkId: number) => {
    deleteLinkMutation.mutate(linkId);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-80 bg-dark-gray/95 backdrop-blur-md z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Admin Panel</h2>
                <div className="flex items-center gap-2">
                  {onLogout && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onLogout}
                      className="text-red-400 hover:text-red-300"
                      title="Logout"
                    >
                      <LogOut className="h-5 w-5" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Background Settings */}
              <Card className="mb-6 bg-medium-gray/50 border-light-gray/30">
                <CardHeader>
                  <CardTitle className="text-gaming-purple">Background</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <input
                    type="file"
                    ref={backgroundUploadRef}
                    accept="image/*,image/gif"
                    onChange={handleBackgroundUpload}
                    className="hidden"
                  />
                  <Button
                    onClick={() => backgroundUploadRef.current?.click()}
                    className="w-full bg-medium-gray hover:bg-light-gray"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Background (Image/GIF)
                  </Button>
                  <Button
                    onClick={handleRemoveBackground}
                    variant="destructive"
                    className="w-full"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Background
                  </Button>
                </CardContent>
              </Card>

              {/* Profile Settings */}
              <Card className="mb-6 bg-medium-gray/50 border-light-gray/30">
                <CardHeader>
                  <CardTitle className="text-gaming-cyan">Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <input
                    type="file"
                    ref={profileUploadRef}
                    accept="image/*"
                    onChange={handleProfileUpload}
                    className="hidden"
                  />
                  <Button
                    onClick={() => profileUploadRef.current?.click()}
                    className="w-full bg-medium-gray hover:bg-light-gray"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Change Profile Picture
                  </Button>
                  <Input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-medium-gray border-light-gray focus:border-gaming-purple"
                  />
                  <Textarea
                    placeholder="Bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="bg-medium-gray border-light-gray focus:border-gaming-purple resize-none"
                    rows={3}
                  />
                  <Button
                    onClick={handleUpdateText}
                    className="w-full bg-gaming-purple hover:bg-gaming-purple/80"
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </CardContent>
              </Card>

              {/* Links Management */}
              <Card className="bg-medium-gray/50 border-light-gray/30">
                <CardHeader>
                  <CardTitle className="text-white">Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 mb-4">
                    {links.map((link) => (
                      <div key={link.id} className="flex items-center justify-between p-2 bg-light-gray/30 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <i className={`${link.icon} text-white text-sm`}></i>
                          <span className="text-white text-sm">{link.title}</span>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditLink(link)}
                            className="text-gray-400 hover:text-white p-1"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteLink(link.id)}
                            className="text-red-400 hover:text-red-300 p-1"
                            disabled={deleteLinkMutation.isPending}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={onNewLink}
                    className="w-full bg-gaming-purple hover:bg-gaming-purple/80"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Link
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
