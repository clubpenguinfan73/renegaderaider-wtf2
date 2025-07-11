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
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    if (titles.length === 0) return;

    const currentTitle = titles[currentIndex];
    let timeout: NodeJS.Timeout;

    if (isWaiting) {
      // Wait before starting to delete
      timeout = setTimeout(() => {
        setIsWaiting(false);
        setIsDeleting(true);
      }, speed);
    } else if (!isDeleting) {
      // Typing phase
      if (displayText.length < currentTitle.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentTitle.slice(0, displayText.length + 1));
        }, 150);
      } else {
        // Finished typing, start waiting
        setIsWaiting(true);
      }
    } else {
      // Deleting phase
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 75);
      } else {
        // Finished deleting, move to next title
        setIsDeleting(false);
        setCurrentIndex((prev) => (prev + 1) % titles.length);
      }
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [displayText, isDeleting, isWaiting, currentIndex, titles, speed]);

  // Debug effect
  useEffect(() => {
    console.log('AnimatedTitle Debug:', {
      titles,
      currentIndex,
      displayText,
      isDeleting,
      isWaiting,
      currentTitle: titles[currentIndex]
    });
  }, [titles, currentIndex, displayText, isDeleting, isWaiting]);

  // Update document title if enabled
  useEffect(() => {
    if (updateDocumentTitle) {
      if (displayText) {
        document.title = displayText;
      } else {
        document.title = 'renegade raider.wtf';
      }
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