
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [text, setText] = useState('');
  const fullText = 'Amigos-E-Learning Hub...';
  
  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 1000);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-dotnet-800 via-dotnet-600 to-dotnet-400">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-6xl font-bold text-white"
      >
        {text}
        <span className="animate-blink">|</span>
      </motion.div>
    </div>
  );
}
