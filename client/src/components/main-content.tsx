import { motion } from "framer-motion";
import { Settings, ExternalLink, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useEffect, useRef, useState } from "react";
import type { Profile, Link } from "@shared/schema";
import UsernameEffects from "./username-effects";
import AnimatedTitle from "./animated-title";
import { useDiscordProfile } from "@/hooks/use-discord-profile";
import ThemeSelector from "./theme-selector";
import { Theme, getStoredTheme, applyTheme } from "@/themes/themes";

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
  const [currentTheme, setCurrentTheme] = useState<Theme>(getStoredTheme());
  const audioRef = useRef<HTMLAudioElement>(null);
  const { profile: discordProfile, activity: discordActivity, isLoading: discordLoading, error: discordError, getBadgeIcon } = useDiscordProfile();

  // Apply theme on component mount
  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

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
        <div 
          className="absolute inset-0 opacity-80"
          style={{ background: `var(--gradient-secondary)` }}
        ></div>
        <div 
          className="absolute inset-0 opacity-30"
          style={{ background: `var(--gradient-primary)` }}
        ></div>
        {backgroundImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        )}
      </div>

      {/* Admin Toggle and Theme Selector */}
      <div className="fixed top-4 right-4 z-40 flex gap-2">
        <ThemeSelector 
          currentTheme={currentTheme} 
          onThemeChange={setCurrentTheme}
        />
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
          
          {/* Animated Title - Updates Browser Tab */}
          {profile?.animatedTitleEnabled && profile?.animatedTitleTexts && (
            <AnimatedTitle 
              titles={profile.animatedTitleTexts.split(',').map(t => t.trim()).filter(t => t)} 
              speed={profile.animatedTitleSpeed || 1000}
              updateDocumentTitle={true}
            />
          )}
          
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
              className="bg-medium-gray/80 backdrop-blur-sm border border-light-gray/30 rounded-xl p-4 transition-all duration-200 hover:shadow-2xl"
              whileHover={{ scale: 1.02 }}
            >
              {discordLoading ? (
                <div className="flex items-center gap-4 animate-pulse">
                  <div className="w-16 h-16 rounded-full bg-gray-600"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                  </div>
                </div>
              ) : discordError ? (
                <div className="text-center py-4">
                  <p className="text-red-400 text-sm">Discord profile temporarily unavailable</p>
                  <p className="text-gray-500 text-xs mt-1">Retrying connection...</p>
                </div>
              ) : discordProfile ? (
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-2 border-gaming-cyan bg-gray-800 overflow-hidden">
                      <img 
                        src={discordProfile.avatar} 
                        alt={`${discordProfile.username}'s avatar`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to gradient if image fails
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center"><span class="text-white text-2xl font-bold">C</span></div>';
                        }}
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-medium-gray"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-white">{discordProfile.username}</h4>
                      <div className="flex items-center gap-1">
                        {/* Render actual Discord badges */}
                        {discordProfile.badges.map((badge, index) => (
                          <div key={index} className="w-4 h-4 flex items-center justify-center" title={badge}>
                            <div dangerouslySetInnerHTML={{ __html: getBadgeIcon(badge) }} />
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">
                      Discord ID: {discordProfile.id}
                    </p>
                    {/* Show current activity if available */}
                    {discordActivity && (
                      <div className="text-xs text-gaming-cyan mt-1">
                        <span className="font-medium">
                          {discordActivity.type === 2 ? 'Listening to:' : 
                           discordActivity.type === 0 ? 'Playing:' : 
                           discordActivity.type === 1 ? 'Streaming:' : 
                           discordActivity.type === 3 ? 'Watching:' : 'Activity:'}
                        </span> {discordActivity.name}
                        {discordActivity.details && (
                          <div className="text-gray-400">{discordActivity.details}</div>
                        )}
                        {discordActivity.state && (
                          <div className="text-gray-400">{discordActivity.state}</div>
                        )}
                        {discordActivity.timestamps?.start && (
                          <div className="text-gray-500 text-xs mt-1">
                            Started: {new Date(discordActivity.timestamps.start).toLocaleTimeString()}
                          </div>
                        )}
                      </div>
                    )}
                    <p className="text-sm text-gray-400 mb-2">this is where i belong</p>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-400">Online • Connected 24/7</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-400 text-sm">Connecting to Discord...</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Spotify Integration - Only show if enabled */}
          {profile?.spotifyEnabled && (
            <motion.div
              className="bg-medium-gray/80 backdrop-blur-sm border border-light-gray/30 rounded-xl p-4 transition-all duration-200 hover:shadow-2xl"
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
                <div className="bg-dark-gray/50 rounded-lg p-3 border border-light-gray/20 flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center overflow-hidden">
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
