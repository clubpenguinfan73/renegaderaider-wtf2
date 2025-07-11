import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Trash2, Plus, Edit2, LogOut, Music, User, Image, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [entranceText, setEntranceText] = useState(profile?.entranceText || "click to enter...");
  const [entranceFontSize, setEntranceFontSize] = useState(profile?.entranceFontSize || "4xl");
  const [entranceFontFamily, setEntranceFontFamily] = useState(profile?.entranceFontFamily || "Inter");
  const [entranceFontColor, setEntranceFontColor] = useState(profile?.entranceFontColor || "#ffffff");
  const [musicEnabled, setMusicEnabled] = useState(profile?.musicEnabled || false);
  const [discordEnabled, setDiscordEnabled] = useState(profile?.discordEnabled || false);
  const [discordUserId, setDiscordUserId] = useState(profile?.discordUserId || "");
  const [discordApplicationId, setDiscordApplicationId] = useState(profile?.discordApplicationId || "");
  const [spotifyEnabled, setSpotifyEnabled] = useState(profile?.spotifyEnabled || false);
  const [spotifyTrackName, setSpotifyTrackName] = useState(profile?.spotifyTrackName || "");
  const [spotifyArtistName, setSpotifyArtistName] = useState(profile?.spotifyArtistName || "");
  const [spotifyAlbumArt, setSpotifyAlbumArt] = useState(profile?.spotifyAlbumArt || "");
  const [spotifyTrackUrl, setSpotifyTrackUrl] = useState(profile?.spotifyTrackUrl || "");
  
  const backgroundUploadRef = useRef<HTMLInputElement>(null);
  const profileUploadRef = useRef<HTMLInputElement>(null);
  const musicUploadRef = useRef<HTMLInputElement>(null);
  const spotifyAlbumUploadRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Sync local state with profile prop changes
  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
      setBio(profile.bio || "");
      setEntranceText(profile.entranceText || "click to enter...");
      setEntranceFontSize(profile.entranceFontSize || "4xl");
      setEntranceFontFamily(profile.entranceFontFamily || "Inter");
      setEntranceFontColor(profile.entranceFontColor || "#ffffff");
      setMusicEnabled(profile.musicEnabled || false);
      setDiscordEnabled(profile.discordEnabled || false);
      setDiscordUserId(profile.discordUserId || "");
      setDiscordApplicationId(profile.discordApplicationId || "");
      setSpotifyEnabled(profile.spotifyEnabled || false);
      setSpotifyTrackName(profile.spotifyTrackName || "");
      setSpotifyArtistName(profile.spotifyArtistName || "");
      setSpotifyAlbumArt(profile.spotifyAlbumArt || "");
      setSpotifyTrackUrl(profile.spotifyTrackUrl || "");
    }
  }, [profile]);

  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/profile", "PUT", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      toast({
        title: "Profile updated successfully",
        description: "Your changes have been saved.",
      });
    },
  });

  const deleteLinkMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/links/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/links"] });
      toast({
        title: "Link deleted",
        description: "The link has been removed from your profile.",
      });
    },
  });

  const handleFileUpload = (file: File, type: 'background' | 'profile' | 'music' | 'spotify-album') => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      
      const updateData: any = {
        username: username || profile?.username || "",
        bio: bio || profile?.bio || "",
        profilePicture: profile?.profilePicture,
        backgroundImage: profile?.backgroundImage,
        backgroundMusic: profile?.backgroundMusic,
        musicEnabled: musicEnabled,
        discordEnabled: discordEnabled,
        discordUserId: discordUserId,
        discordApplicationId: discordApplicationId,
        spotifyEnabled: spotifyEnabled,
        spotifyTrackName: spotifyTrackName,
        spotifyArtistName: spotifyArtistName,
        spotifyAlbumArt: spotifyAlbumArt,
        spotifyTrackUrl: spotifyTrackUrl,
      };

      if (type === 'background') {
        updateData.backgroundImage = result;
      } else if (type === 'profile') {
        updateData.profilePicture = result;
      } else if (type === 'music') {
        updateData.backgroundMusic = result;
        updateData.musicEnabled = true;
        setMusicEnabled(true);
      } else if (type === 'spotify-album') {
        updateData.spotifyAlbumArt = result;
        setSpotifyAlbumArt(result);
      }

      updateProfileMutation.mutate(updateData);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    updateProfileMutation.mutate({
      username,
      bio,
      entranceText,
      entranceFontSize,
      entranceFontFamily,
      entranceFontColor,
      profilePicture: profile?.profilePicture,
      backgroundImage: profile?.backgroundImage,
      backgroundMusic: profile?.backgroundMusic,
      musicEnabled: musicEnabled,
      discordEnabled: discordEnabled,
      discordUserId: discordUserId,
      discordApplicationId: discordApplicationId,
      spotifyEnabled: spotifyEnabled,
      spotifyTrackName: spotifyTrackName,
      spotifyArtistName: spotifyArtistName,
      spotifyAlbumArt: spotifyAlbumArt,
      spotifyTrackUrl: spotifyTrackUrl,
    });
  };

  const handleToggleMusic = (checked: boolean) => {
    setMusicEnabled(checked);
    updateProfileMutation.mutate({
      username: username || profile?.username || "",
      bio: bio || profile?.bio || "",
      entranceText: entranceText || profile?.entranceText || "click to enter...",
      entranceFontSize: entranceFontSize || profile?.entranceFontSize || "4xl",
      entranceFontFamily: entranceFontFamily || profile?.entranceFontFamily || "Inter",
      entranceFontColor: entranceFontColor || profile?.entranceFontColor || "#ffffff",
      profilePicture: profile?.profilePicture,
      backgroundImage: profile?.backgroundImage,
      backgroundMusic: profile?.backgroundMusic,
      musicEnabled: checked,
      discordEnabled: profile?.discordEnabled,
      discordUserId: profile?.discordUserId,
      discordApplicationId: profile?.discordApplicationId,
      spotifyEnabled: profile?.spotifyEnabled,
      spotifyTrackName: profile?.spotifyTrackName,
      spotifyArtistName: profile?.spotifyArtistName,
      spotifyAlbumArt: profile?.spotifyAlbumArt,
      spotifyTrackUrl: profile?.spotifyTrackUrl,
    });
  };

  const handleToggleDiscord = (checked: boolean) => {
    setDiscordEnabled(checked);
    updateProfileMutation.mutate({
      username: username || profile?.username || "",
      bio: bio || profile?.bio || "",
      entranceText: entranceText || profile?.entranceText || "click to enter...",
      entranceFontSize: entranceFontSize || profile?.entranceFontSize || "4xl",
      entranceFontFamily: entranceFontFamily || profile?.entranceFontFamily || "Inter",
      entranceFontColor: entranceFontColor || profile?.entranceFontColor || "#ffffff",
      profilePicture: profile?.profilePicture,
      backgroundImage: profile?.backgroundImage,
      backgroundMusic: profile?.backgroundMusic,
      musicEnabled: profile?.musicEnabled,
      discordEnabled: checked,
      discordUserId: profile?.discordUserId,
      discordApplicationId: profile?.discordApplicationId,
      spotifyEnabled: profile?.spotifyEnabled,
      spotifyTrackName: profile?.spotifyTrackName,
      spotifyArtistName: profile?.spotifyArtistName,
      spotifyAlbumArt: profile?.spotifyAlbumArt,
      spotifyTrackUrl: profile?.spotifyTrackUrl,
    });
  };

  const handleToggleSpotify = (checked: boolean) => {
    setSpotifyEnabled(checked);
    updateProfileMutation.mutate({
      username: username || profile?.username || "",
      bio: bio || profile?.bio || "",
      entranceText: entranceText || profile?.entranceText || "click to enter...",
      entranceFontSize: entranceFontSize || profile?.entranceFontSize || "4xl",
      entranceFontFamily: entranceFontFamily || profile?.entranceFontFamily || "Inter",
      entranceFontColor: entranceFontColor || profile?.entranceFontColor || "#ffffff",
      profilePicture: profile?.profilePicture,
      backgroundImage: profile?.backgroundImage,
      backgroundMusic: profile?.backgroundMusic,
      musicEnabled: profile?.musicEnabled,
      discordEnabled: profile?.discordEnabled,
      discordUserId: profile?.discordUserId,
      discordApplicationId: profile?.discordApplicationId,
      spotifyEnabled: checked,
      spotifyTrackName: profile?.spotifyTrackName,
      spotifyArtistName: profile?.spotifyArtistName,
      spotifyAlbumArt: profile?.spotifyAlbumArt,
      spotifyTrackUrl: profile?.spotifyTrackUrl,
    });
  };

  const handleUpdateDiscordSettings = () => {
    updateProfileMutation.mutate({
      username: username || profile?.username || "",
      bio: bio || profile?.bio || "",
      entranceText: entranceText || profile?.entranceText || "click to enter...",
      entranceFontSize: entranceFontSize || profile?.entranceFontSize || "4xl",
      entranceFontFamily: entranceFontFamily || profile?.entranceFontFamily || "Inter",
      entranceFontColor: entranceFontColor || profile?.entranceFontColor || "#ffffff",
      profilePicture: profile?.profilePicture,
      backgroundImage: profile?.backgroundImage,
      backgroundMusic: profile?.backgroundMusic,
      musicEnabled: profile?.musicEnabled,
      discordEnabled: profile?.discordEnabled,
      discordUserId,
      discordApplicationId,
      spotifyEnabled: profile?.spotifyEnabled,
      spotifyTrackName: profile?.spotifyTrackName,
      spotifyArtistName: profile?.spotifyArtistName,
      spotifyAlbumArt: profile?.spotifyAlbumArt,
      spotifyTrackUrl: profile?.spotifyTrackUrl,
    });
  };

  const handleUpdateSpotifySettings = () => {
    updateProfileMutation.mutate({
      username: username || profile?.username || "",
      bio: bio || profile?.bio || "",
      entranceText: entranceText || profile?.entranceText || "click to enter...",
      entranceFontSize: entranceFontSize || profile?.entranceFontSize || "4xl",
      entranceFontFamily: entranceFontFamily || profile?.entranceFontFamily || "Inter",
      entranceFontColor: entranceFontColor || profile?.entranceFontColor || "#ffffff",
      profilePicture: profile?.profilePicture,
      backgroundImage: profile?.backgroundImage,
      backgroundMusic: profile?.backgroundMusic,
      musicEnabled: profile?.musicEnabled,
      discordEnabled: profile?.discordEnabled,
      discordUserId: profile?.discordUserId,
      discordApplicationId: profile?.discordApplicationId,
      spotifyEnabled: profile?.spotifyEnabled,
      spotifyTrackName,
      spotifyArtistName,
      spotifyAlbumArt,
      spotifyTrackUrl,
    });
  };

  const handleDeleteLink = (linkId: number) => {
    deleteLinkMutation.mutate(linkId);
  };

  const handleRemoveBackground = () => {
    updateProfileMutation.mutate({
      username: username || profile?.username || "",
      bio: bio || profile?.bio || "",
      entranceText: entranceText || profile?.entranceText || "click to enter...",
      entranceFontSize: entranceFontSize || profile?.entranceFontSize || "4xl",
      entranceFontFamily: entranceFontFamily || profile?.entranceFontFamily || "Inter",
      entranceFontColor: entranceFontColor || profile?.entranceFontColor || "#ffffff",
      profilePicture: profile?.profilePicture,
      backgroundImage: "",
      backgroundMusic: profile?.backgroundMusic,
      musicEnabled: profile?.musicEnabled,
      discordEnabled: profile?.discordEnabled,
      discordUserId: profile?.discordUserId,
      discordApplicationId: profile?.discordApplicationId,
      spotifyEnabled: profile?.spotifyEnabled,
      spotifyTrackName: profile?.spotifyTrackName,
      spotifyArtistName: profile?.spotifyArtistName,
      spotifyAlbumArt: profile?.spotifyAlbumArt,
      spotifyTrackUrl: profile?.spotifyTrackUrl,
    });
  };

  const handleRemoveMusic = () => {
    updateProfileMutation.mutate({
      username: username || profile?.username || "",
      bio: bio || profile?.bio || "",
      entranceText: entranceText || profile?.entranceText || "click to enter...",
      entranceFontSize: entranceFontSize || profile?.entranceFontSize || "4xl",
      entranceFontFamily: entranceFontFamily || profile?.entranceFontFamily || "Inter",
      entranceFontColor: entranceFontColor || profile?.entranceFontColor || "#ffffff",
      profilePicture: profile?.profilePicture,
      backgroundImage: profile?.backgroundImage,
      backgroundMusic: null,
      musicEnabled: false,
      discordEnabled: profile?.discordEnabled,
      discordUserId: profile?.discordUserId,
      discordApplicationId: profile?.discordApplicationId,
      spotifyEnabled: profile?.spotifyEnabled,
      spotifyTrackName: profile?.spotifyTrackName,
      spotifyArtistName: profile?.spotifyArtistName,
      spotifyAlbumArt: profile?.spotifyAlbumArt,
      spotifyTrackUrl: profile?.spotifyTrackUrl,
    });
    setMusicEnabled(false);
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
            className="fixed top-0 right-0 h-full w-[90vw] max-w-6xl bg-dark-gray/95 backdrop-blur-md z-50 overflow-y-auto"
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

              {/* Multi-column Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Profile Settings */}
                  <Card className="bg-medium-gray/50 border-light-gray/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-gaming-purple flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Profile
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1.5">
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
                      <Input
                        placeholder="Entrance screen text"
                        value={entranceText}
                        onChange={(e) => setEntranceText(e.target.value)}
                        className="bg-medium-gray border-light-gray focus:border-gaming-purple"
                      />
                      <input
                        type="file"
                        ref={profileUploadRef}
                        accept="image/*,image/gif"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, 'profile');
                        }}
                        className="hidden"
                      />
                      <input
                        type="file"
                        ref={backgroundUploadRef}
                        accept="image/*,image/gif"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, 'background');
                        }}
                        className="hidden"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => profileUploadRef.current?.click()}
                          className="flex-1 bg-gaming-purple hover:bg-gaming-purple/80 text-sm"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Profile Picture
                        </Button>
                        <Button
                          onClick={() => backgroundUploadRef.current?.click()}
                          className="flex-1 bg-medium-gray hover:bg-light-gray text-sm"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Background
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSaveProfile}
                          className="flex-1 bg-gaming-cyan hover:bg-gaming-cyan/80 text-sm"
                          disabled={updateProfileMutation.isPending}
                        >
                          {updateProfileMutation.isPending ? "Saving..." : "Save Profile"}
                        </Button>
                        <Button
                          onClick={handleRemoveBackground}
                          variant="destructive"
                          className="flex-1 text-sm"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove BG
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Music Settings */}
                  <Card className="bg-medium-gray/50 border-light-gray/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-gaming-cyan flex items-center gap-2">
                        <Music className="h-5 w-5" />
                        Background Music
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-white text-sm">Enable Background Music</span>
                        <Switch
                          checked={musicEnabled}
                          onCheckedChange={handleToggleMusic}
                          className="data-[state=checked]:bg-gaming-cyan"
                        />
                      </div>
                      
                      <input
                        type="file"
                        ref={musicUploadRef}
                        accept="audio/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, 'music');
                        }}
                        className="hidden"
                      />
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => musicUploadRef.current?.click()}
                          className="flex-1 bg-medium-gray hover:bg-light-gray text-sm"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                        
                        {profile?.backgroundMusic && (
                          <Button
                            onClick={handleRemoveMusic}
                            variant="destructive"
                            className="flex-1 text-sm"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        )}
                      </div>
                      
                      <div className="text-xs text-gray-400">
                        MP3, WAV, OGG
                      </div>
                    </CardContent>
                  </Card>

                  {/* Entrance Screen Customization */}
                  <Card className="bg-medium-gray/50 border-light-gray/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-gaming-purple flex items-center gap-2">
                        <Image className="h-5 w-5" />
                        Entrance Screen
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1.5">
                      <Input
                        placeholder="Entrance text"
                        value={entranceText}
                        onChange={(e) => setEntranceText(e.target.value)}
                        className="bg-medium-gray border-light-gray focus:border-gaming-purple"
                      />
                      
                      <Select value={entranceFontSize} onValueChange={setEntranceFontSize}>
                        <SelectTrigger className="bg-medium-gray border-light-gray focus:border-gaming-purple">
                          <SelectValue placeholder="Font size" />
                        </SelectTrigger>
                        <SelectContent className="bg-medium-gray border-light-gray">
                          <SelectItem value="sm">Small</SelectItem>
                          <SelectItem value="base">Base</SelectItem>
                          <SelectItem value="lg">Large</SelectItem>
                          <SelectItem value="xl">Extra Large</SelectItem>
                          <SelectItem value="2xl">2XL</SelectItem>
                          <SelectItem value="3xl">3XL</SelectItem>
                          <SelectItem value="4xl">4XL</SelectItem>
                          <SelectItem value="5xl">5XL</SelectItem>
                          <SelectItem value="6xl">6XL</SelectItem>
                          <SelectItem value="7xl">7XL</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select value={entranceFontFamily} onValueChange={setEntranceFontFamily}>
                        <SelectTrigger className="bg-medium-gray border-light-gray focus:border-gaming-purple">
                          <SelectValue placeholder="Font family" />
                        </SelectTrigger>
                        <SelectContent className="bg-medium-gray border-light-gray">
                          <SelectItem value="Inter">Inter (Clean)</SelectItem>
                          <SelectItem value="Orbitron">Orbitron (Futuristic)</SelectItem>
                          <SelectItem value="Rajdhani">Rajdhani (Gaming)</SelectItem>
                          <SelectItem value="Audiowide">Audiowide (Retro)</SelectItem>
                          <SelectItem value="Bebas Neue">Bebas Neue (Bold)</SelectItem>
                          <SelectItem value="Bangers">Bangers (Comic)</SelectItem>
                          <SelectItem value="Creepster">Creepster (Horror)</SelectItem>
                          <SelectItem value="Righteous">Righteous (Strong)</SelectItem>
                          <SelectItem value="Fredoka One">Fredoka One (Friendly)</SelectItem>
                          <SelectItem value="Permanent Marker">Permanent Marker (Handwritten)</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={entranceFontColor}
                          onChange={(e) => setEntranceFontColor(e.target.value)}
                          className="w-12 h-8 bg-medium-gray border-light-gray focus:border-gaming-purple"
                        />
                        <Input
                          placeholder="Font color (hex)"
                          value={entranceFontColor}
                          onChange={(e) => setEntranceFontColor(e.target.value)}
                          className="flex-1 bg-medium-gray border-light-gray focus:border-gaming-purple"
                        />
                      </div>
                      
                      <Button
                        onClick={handleSaveProfile}
                        className="w-full bg-gaming-purple hover:bg-gaming-purple/80 text-sm"
                        disabled={updateProfileMutation.isPending}
                      >
                        {updateProfileMutation.isPending ? "Saving..." : "Save Entrance Settings"}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Middle Column */}
                <div className="space-y-4">
                  {/* Discord Rich Presence Settings */}
                  <Card className="bg-medium-gray/50 border-light-gray/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-indigo-400 flex items-center gap-2">
                        <i className="fab fa-discord text-lg"></i>
                        Discord Rich Presence
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-white text-sm">Enable Discord Widget</span>
                        <Switch
                          checked={discordEnabled}
                          onCheckedChange={handleToggleDiscord}
                          className="data-[state=checked]:bg-indigo-600"
                        />
                      </div>
                      
                      <Input
                        placeholder="Discord User ID"
                        value={discordUserId}
                        onChange={(e) => setDiscordUserId(e.target.value)}
                        className="bg-medium-gray border-light-gray focus:border-indigo-500"
                      />
                      
                      <Input
                        placeholder="Discord Application ID"
                        value={discordApplicationId}
                        onChange={(e) => setDiscordApplicationId(e.target.value)}
                        className="bg-medium-gray border-light-gray focus:border-indigo-500"
                      />
                      
                      <Button
                        onClick={handleUpdateDiscordSettings}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-sm"
                        disabled={updateProfileMutation.isPending}
                      >
                        {updateProfileMutation.isPending ? "Saving..." : "Save Discord Settings"}
                      </Button>
                      
                      <div className="text-xs text-gray-400 bg-medium-gray/30 rounded p-2">
                        <p className="font-medium mb-1">Setup:</p>
                        <p>1. discord.com/developers</p>
                        <p>2. Create application</p>
                        <p>3. Copy Application ID</p>
                        <p>4. Get User ID from Discord</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Spotify Settings */}
                  <Card className="bg-medium-gray/50 border-light-gray/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-green-400 flex items-center gap-2">
                        <i className="fab fa-spotify text-lg"></i>
                        Spotify Integration
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-white text-sm">Enable Spotify Widget</span>
                        <Switch
                          checked={spotifyEnabled}
                          onCheckedChange={handleToggleSpotify}
                          className="data-[state=checked]:bg-green-600"
                        />
                      </div>
                      
                      <Input
                        placeholder="Track Name"
                        value={spotifyTrackName}
                        onChange={(e) => setSpotifyTrackName(e.target.value)}
                        className="bg-medium-gray border-light-gray focus:border-green-500"
                      />
                      
                      <Input
                        placeholder="Artist Name"
                        value={spotifyArtistName}
                        onChange={(e) => setSpotifyArtistName(e.target.value)}
                        className="bg-medium-gray border-light-gray focus:border-green-500"
                      />
                      
                      <Input
                        placeholder="Spotify Track URL"
                        value={spotifyTrackUrl}
                        onChange={(e) => setSpotifyTrackUrl(e.target.value)}
                        className="bg-medium-gray border-light-gray focus:border-green-500"
                      />
                      
                      <input
                        type="file"
                        ref={spotifyAlbumUploadRef}
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, 'spotify-album');
                        }}
                        className="hidden"
                      />
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => spotifyAlbumUploadRef.current?.click()}
                          className="flex-1 bg-medium-gray hover:bg-light-gray text-sm"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Album Art
                        </Button>
                        <Button
                          onClick={() => setSpotifyAlbumArt("")}
                          variant="destructive"
                          className="flex-1 text-sm"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                      
                      <Button
                        onClick={handleUpdateSpotifySettings}
                        className="w-full bg-green-600 hover:bg-green-700 text-sm"
                        disabled={updateProfileMutation.isPending}
                      >
                        {updateProfileMutation.isPending ? "Saving..." : "Save Spotify Settings"}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Links Management */}
                  <Card className="bg-medium-gray/50 border-light-gray/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-gaming-purple flex items-center gap-2">
                        <ExternalLink className="h-5 w-5" />
                        Social Links
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1.5">
                      <Button
                        onClick={onNewLink}
                        className="w-full bg-gaming-purple hover:bg-gaming-purple/80 text-sm"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Link
                      </Button>
                      
                      <div className="space-y-1 max-h-64 overflow-y-auto">
                        {links.map((link) => (
                          <div
                            key={link.id}
                            className="flex items-center justify-between p-2 bg-medium-gray/30 rounded-md"
                          >
                            <div className="flex items-center gap-3">
                              <i className={`fab fa-${link.title.toLowerCase()} text-gaming-purple`}></i>
                              <span className="text-white font-medium text-sm">{link.title}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEditLink(link)}
                                className="text-gaming-cyan hover:text-gaming-cyan/80 p-1"
                              >
                                <Edit2 className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteLink(link.id)}
                                className="text-red-400 hover:text-red-300 p-1"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}