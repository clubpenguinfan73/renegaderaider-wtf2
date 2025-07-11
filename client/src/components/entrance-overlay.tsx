import { motion } from "framer-motion";

interface EntranceOverlayProps {
  onEnter: () => void;
  isEntering: boolean;
}

export default function EntranceOverlay({ onEnter, isEntering }: EntranceOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isEntering ? 0 : 1 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center cursor-pointer"
      onClick={onEnter}
    >
      <div className="text-center">
        <motion.h1 
          initial={{ opacity: 0.9 }}
          animate={{ opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-4xl md:text-6xl font-light tracking-wide text-white"
        >
          click to enter...
        </motion.h1>
      </div>
    </motion.div>
  );
}
