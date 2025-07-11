import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AnimatedTitleProps {
  titles: string[];
  speed?: number;
  className?: string;
  updateDocumentTitle?: boolean;
}

export default function AnimatedTitle({ titles, speed = 1000, className = "", updateDocumentTitle = false }: AnimatedTitleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typeSpeed, setTypeSpeed] = useState(speed / 10);

  useEffect(() => {
    if (titles.length === 0) return;

    const currentTitle = titles[currentIndex];
    
    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (displayText.length < currentTitle.length) {
          setDisplayText(currentTitle.slice(0, displayText.length + 1));
          setTypeSpeed(speed / 10);
        } else {
          // Finished typing, wait then start deleting
          setTypeSpeed(speed * 2);
          setIsDeleting(true);
        }
      } else {
        // Deleting
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
          setTypeSpeed(speed / 20);
        } else {
          // Finished deleting, move to next title
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % titles.length);
          setTypeSpeed(speed / 10);
        }
      }
    }, typeSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentIndex, titles, speed, typeSpeed]);

  // Update document title if enabled
  useEffect(() => {
    if (updateDocumentTitle && displayText) {
      document.title = displayText;
    } else if (updateDocumentTitle && !displayText) {
      document.title = 'renegade raider.wtf';
    }
  }, [displayText, updateDocumentTitle]);

  if (titles.length === 0) return null;

  return (
    <div className={`inline-block ${className}`}>
      <motion.span
        key={displayText}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-transparent bg-clip-text bg-gradient-to-r from-gaming-purple to-gaming-cyan"
      >
        {displayText}
      </motion.span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="text-gaming-cyan ml-1"
      >
        |
      </motion.span>
    </div>
  );
}