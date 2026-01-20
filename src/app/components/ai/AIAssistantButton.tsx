import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import AIAssistant from './AIAssistant';
import { motion } from 'motion/react';

export default function AIAssistantButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="h-14 w-14 rounded-full bg-gradient-to-r from-[var(--primary)] to-blue-600 hover:shadow-2xl shadow-lg transition-all duration-300 hover:scale-110"
        >
          <Sparkles className="h-6 w-6" />
        </Button>
        
        {/* Pulse animation */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0, 0.5]
          }}
          transition={{
            repeat: Infinity,
            duration: 2
          }}
          className="absolute inset-0 rounded-full bg-blue-500 -z-10"
        />
      </motion.div>

      <AIAssistant isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
