import { motion } from "framer-motion";
import type { Profile } from "@shared/schema";

interface EntranceOverlayProps {
  onEnter: () => void;
  isEntering: boolean;
  profile?: Profile;
}

export default function EntranceOverlay({ onEnter, isEntering, profile }: EntranceOverlayProps) {
  const backgroundImage = profile?.backgroundImage;
  const entranceText = profile?.entranceText || "click to enter...";

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isEntering ? 0 : 1 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer"
      onClick={onEnter}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Blur overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Content */}
      <div className="relative text-center z-10">
        <motion.h1 
          initial={{ opacity: 0.9 }}
          animate={{ opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-4xl md:text-6xl font-light tracking-wide text-white"
        >
          {entranceText}
        </motion.h1>
      </div>
    </motion.div>
  );
}
