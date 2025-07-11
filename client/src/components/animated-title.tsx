import { useState, useEffect } from 'react';

interface AnimatedTitleProps {
  titles: string[];
  speed?: number;
  className?: string;
  updateDocumentTitle?: boolean;
}

export default function AnimatedTitle({ titles, speed = 3000, className = "", updateDocumentTitle = false }: AnimatedTitleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (titles.length === 0) return;

    const currentTitle = titles[currentIndex];
    let timeout: NodeJS.Timeout;

    if (isTyping) {
      if (displayText.length < currentTitle.length) {
        // Still typing
        timeout = setTimeout(() => {
          setDisplayText(currentTitle.slice(0, displayText.length + 1));
        }, 100);
      } else {
        // Finished typing, wait then move to next
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, speed);
      }
    } else {
      // Move to next title
      setDisplayText('');
      setCurrentIndex((prev) => (prev + 1) % titles.length);
      setIsTyping(true);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isTyping, currentIndex, titles, speed]);

  // Update document title
  useEffect(() => {
    if (updateDocumentTitle) {
      document.title = displayText || titles[0] || '';
    }
  }, [displayText, updateDocumentTitle, titles]);

  return null; // Invisible component, only updates document title
}