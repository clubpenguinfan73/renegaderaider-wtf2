import { useState, useEffect } from 'react';

interface AnimatedTitleProps {
  titles: string[];
  speed?: number;
  className?: string;
  updateDocumentTitle?: boolean;
}

export default function AnimatedTitle({ titles, speed = 2000, className = "", updateDocumentTitle = false }: AnimatedTitleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (titles.length === 0) return;

    const currentTitle = titles[currentIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      // Typing phase
      if (displayText.length < currentTitle.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentTitle.slice(0, displayText.length + 1));
        }, 100);
      } else {
        // Finished typing, wait then start deleting
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, speed);
      }
    } else {
      // Deleting phase
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 50);
      } else {
        // Finished deleting, move to next title
        setIsDeleting(false);
        setCurrentIndex((prev) => (prev + 1) % titles.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentIndex, titles, speed]);

  // Update document title if enabled - default to blank instead of domain
  useEffect(() => {
    if (updateDocumentTitle) {
      document.title = displayText || '';
    }
  }, [displayText, updateDocumentTitle]);

  return null; // Component is invisible but still updates document title
}