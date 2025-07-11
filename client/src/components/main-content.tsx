import { motion } from "framer-motion";
import { Settings, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Profile, Link } from "@shared/schema";

interface MainContentProps {
  profile?: Profile;
  links: Link[];
  onToggleAdmin: () => void;
  onEditLink: (link: Link) => void;
}

export default function MainContent({ profile, links, onToggleAdmin, onEditLink }: MainContentProps) {
  const backgroundImage = profile?.backgroundImage;

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

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {/* Profile Section */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <img 
              src={profile?.profilePicture || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200"}
              alt="Profile Picture"
              className="w-32 h-32 rounded-full mx-auto border-4 border-gaming-purple shadow-2xl object-cover"
            />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white tracking-wide">
            {profile?.username || "renegade raider"}
          </h1>
          
          <p className="text-lg text-gray-300 max-w-md mx-auto leading-relaxed">
            {profile?.bio || "Professional gamer • Content creator • Streaming daily"}
          </p>
        </div>

        {/* Links Section */}
        <div className="w-full max-w-md space-y-4">
          {links.map((link) => (
            <motion.a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-medium-gray/80 hover:bg-light-gray/80 backdrop-blur-sm border border-light-gray/30 rounded-xl p-4 transition-all duration-200 hover:scale-105 hover:shadow-2xl group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 ${link.color} rounded-lg flex items-center justify-center group-hover:opacity-80 transition-opacity`}>
                  <i className={`${link.icon} text-white text-xl`}></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-lg">{link.title}</h3>
                  <p className="text-gray-400 text-sm">{link.description}</p>
                </div>
                <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
              </div>
            </motion.a>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Made with <i className="fas fa-heart text-red-500"></i> by renegade raider
          </p>
        </div>
      </div>
    </motion.div>
  );
}
