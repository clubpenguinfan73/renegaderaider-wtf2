import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { themes, Theme, applyTheme, getStoredTheme } from '@/themes/themes';

interface ThemeSelectorProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export default function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeSelect = (theme: Theme) => {
    onThemeChange(theme);
    applyTheme(theme);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-medium-gray/80 border-light-gray/30 hover:bg-light-gray/80 text-white"
      >
        <Palette className="w-4 h-4 mr-2" />
        Themes
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Theme Selector Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute top-full mt-2 right-0 w-80 bg-medium-gray/95 backdrop-blur-md border border-light-gray/30 rounded-xl p-4 shadow-2xl z-50"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Choose Theme</h3>
              
              <div className="grid grid-cols-2 gap-3">
                {themes.map((theme) => (
                  <motion.div
                    key={theme.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleThemeSelect(theme)}
                    className={`relative p-3 rounded-lg cursor-pointer border-2 transition-all duration-200 ${
                      currentTheme.id === theme.id
                        ? 'border-gaming-cyan shadow-lg'
                        : 'border-light-gray/30 hover:border-light-gray/50'
                    }`}
                  >
                    {/* Theme Preview */}
                    <div
                      className="w-full h-16 rounded-md mb-2 relative overflow-hidden"
                      style={{ background: theme.preview }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20" />
                      {currentTheme.id === theme.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center"
                        >
                          <Check className="w-3 h-3 text-green-600" />
                        </motion.div>
                      )}
                    </div>

                    {/* Theme Info */}
                    <div className="text-left">
                      <h4 className="font-medium text-white text-sm mb-1">{theme.name}</h4>
                      <p className="text-xs text-gray-400 line-clamp-2">{theme.description}</p>
                    </div>

                    {/* Hover Effect */}
                    <motion.div
                      className="absolute inset-0 bg-white/5 rounded-lg opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Current Theme Info */}
              <div className="mt-4 p-3 bg-dark-gray/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{ background: currentTheme.preview }}
                  />
                  <div>
                    <p className="font-medium text-white text-sm">{currentTheme.name}</p>
                    <p className="text-xs text-gray-400">{currentTheme.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}