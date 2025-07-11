import { motion } from "framer-motion";
import { Settings, ExternalLink, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useEffect, useRef, useState } from "react";
import type { Profile, Link } from "@shared/schema";
import UsernameEffects from "./username-effects";

interface MainContentProps {
  profile?: Profile;
  links: Link[];
  onToggleAdmin: () => void;
  onEditLink: (link: Link) => void;
}

export default function MainContent({ profile, links, onToggleAdmin, onEditLink }: MainContentProps) {
  const backgroundImage = profile?.backgroundImage;
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [volume, setVolume] = useState(30);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Handle background music - Auto-play by default
  useEffect(() => {
    if (profile?.backgroundMusic && profile.musicEnabled && audioRef.current) {
      // Set the audio source and properties
      audioRef.current.src = profile.backgroundMusic;
      audioRef.current.loop = true;
      audioRef.current.volume = volume / 100;
      
      const playMusic = async () => {
        try {
          await audioRef.current?.play();
          setIsMusicPlaying(true);
          console.log("Background music playing");
        } catch (error) {
          console.log("Auto-play was prevented by the browser:", error);
          // Set as playing but it won't actually play until user interaction
          setIsMusicPlaying(true);
        }
      };
      
      // Auto-play music immediately when enabled
      playMusic();
    } else if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsMusicPlaying(false);
    }
  }, [profile?.backgroundMusic, profile?.musicEnabled]);

  // Update volume when slider changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    // Auto-play music when volume is changed (if music is enabled)
    if (newVolume > 0 && profile?.backgroundMusic && profile.musicEnabled && audioRef.current) {
      if (!isMusicPlaying) {
        audioRef.current.play().then(() => {
          setIsMusicPlaying(true);
        }).catch((error) => {
          console.log("Failed to play music:", error);
        });
      }
    } else if (newVolume === 0 && audioRef.current) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    }
  };

  // Add a click handler to ensure music plays on user interaction
  const handleMusicToggle = () => {
    if (audioRef.current && profile?.backgroundMusic && profile.musicEnabled) {
      if (isMusicPlaying) {
        audioRef.current.pause();
        setIsMusicPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsMusicPlaying(true);
        }).catch((error) => {
          console.log("Failed to play music:", error);
        });
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen"
    >
      {/* Custom Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gaming-purple/20 via-black to-gaming-cyan/20"></div>
        {backgroundImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        )}
      </div>

      {/* Admin Toggle */}
      <div className="fixed top-4 right-4 z-40">
        <Button
          onClick={onToggleAdmin}
          variant="ghost"
          size="icon"
          className="bg-medium-gray/80 hover:bg-light-gray/80 backdrop-blur-sm rounded-full"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {/* Music Volume Slider */}
      {profile?.backgroundMusic && profile.musicEnabled && (
        <div className="fixed top-4 left-4 z-40">
          <div className="bg-black/30 hover:bg-black/40 backdrop-blur-sm rounded-xl p-2 flex items-center gap-2 shadow-lg transition-all duration-200">
            <div className="text-white">
              {volume > 0 ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </div>
            <Slider
              value={[volume]}
              onValueChange={handleVolumeChange}
              max={100}
              min={0}
              step={1}
              className="w-16"
            />
          </div>
        </div>
      )}

      {/* Hidden Audio Element */}
      <audio ref={audioRef} />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {/* Profile Section */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <div className="w-32 h-32 rounded-full mx-auto shadow-2xl overflow-hidden bg-transparent relative">
              <img 
                src={profile?.profilePicture || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200"}
                alt="Profile Picture"
                className="w-full h-full object-cover object-center"
                style={{ 
                  imageRendering: 'pixelated'
                }}
              />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white tracking-wide">
            <UsernameEffects 
              username={profile?.username || "renegade raider"}
              effect={profile?.usernameEffect || "none"}
            />
          </h1>
          
          <p className="text-lg text-gray-300 max-w-md mx-auto leading-relaxed">
            {profile?.bio || "Professional gamer • Content creator • Streaming daily"}
          </p>
        </div>

        {/* Social Links - iOS Control Center Style - Only show if there are links */}
        {links.length > 0 && (
          <div className="bg-medium-gray/80 backdrop-blur-sm border border-light-gray/30 rounded-2xl p-4 mb-8 shadow-2xl">
            <div className="grid grid-cols-5 gap-3 w-full max-w-sm mx-auto">
              {links.map((link) => (
                <motion.a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center group relative"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title={link.title}
                >
                  <div className={`w-12 h-12 rounded-2xl shadow-lg flex items-center justify-center ${link.color} hover:shadow-xl transition-all duration-200 group-hover:brightness-110`}>
                    <i className={`${link.icon} text-lg text-white`}></i>
                  </div>
                  {/* Tooltip on hover */}
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    {link.title}
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        )}

        {/* Feature Cards */}
        <div className="w-full max-w-2xl space-y-4">
          {/* Discord Profile Integration - Only show if enabled */}
          {profile?.discordEnabled && (
            <motion.div
              className="bg-medium-gray/80 backdrop-blur-sm border border-light-gray/30 rounded-xl p-6 transition-all duration-200 hover:shadow-2xl"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <i className="fab fa-discord text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">Discord Profile</h3>
                    <p className="text-gray-400 text-sm">Show your Discord profile information</p>
                  </div>
                </div>
                <div className="bg-dark-gray/50 rounded-lg p-3 border border-light-gray/20">
                  <div className="text-white text-sm font-medium">
                    {profile?.discordUserId ? (
                      <div className="flex flex-col items-end">
                        <span className="text-green-400 mb-1">Connected</span>
                        <span className="text-xs text-gray-400">ID: {profile.discordUserId}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">Not Connected</span>
                    )}
                  </div>
                </div>
              </div>
              {profile?.discordUserId && (
                <div className="mt-4 p-4 bg-dark-gray/30 rounded-lg border border-light-gray/20">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img 
                        src={`https://cdn.discordapp.com/avatars/${profile.discordUserId}/a_01.png?size=128`}
                        alt="Discord Avatar"
                        className="w-16 h-16 rounded-full border-2 border-gaming-purple"
                        onError={(e) => {
                          e.currentTarget.src = `https://cdn.discordapp.com/embed/avatars/${parseInt(profile.discordUserId) % 5}.png`;
                        }}
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-dark-gray"></div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-lg">Discord User</h4>
                      <p className="text-gray-400 text-sm">ID: {profile.discordUserId}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="px-2 py-1 bg-gaming-purple rounded-full text-xs text-white">
                          Discord Member
                        </span>
                        <span className="text-green-400 text-xs">● Online</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-400">
                    Note: This shows your Discord profile information. For real-time status updates, you'll need additional Discord API permissions.
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Spotify Integration - Only show if enabled */}
          {profile?.spotifyEnabled && (
            <motion.div
              className="bg-medium-gray/80 backdrop-blur-sm border border-light-gray/30 rounded-xl p-6 transition-all duration-200 hover:shadow-2xl"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <i className="fab fa-spotify text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">Spotify</h3>
                    <p className="text-gray-400 text-sm">Showcase your favorite song or playlist</p>
                  </div>
                </div>
                <div className="bg-dark-gray/50 rounded-lg p-4 border border-light-gray/20 flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center overflow-hidden">
                    {profile?.spotifyAlbumArt ? (
                      <img 
                        src={profile.spotifyAlbumArt} 
                        alt="Album Art" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <i className="fas fa-music text-white text-sm"></i>
                    )}
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">
                      {profile?.spotifyTrackName || 'No Track Set'}
                    </div>
                    <div className="text-gray-400 text-xs">
                      Playing • {profile?.spotifyArtistName || 'Unknown Artist'}
                    </div>
                  </div>
                  {profile?.spotifyTrackUrl ? (
                    <a 
                      href={profile.spotifyTrackUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <i className="fas fa-play text-black text-xs"></i>
                    </a>
                  ) : (
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <i className="fas fa-play text-black text-xs"></i>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>


      </div>
    </motion.div>
  );
}
