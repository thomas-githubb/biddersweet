"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface AnimatedHeartProps {
  isLiked: boolean
  onClick: () => void
  count: number
  className?: string
}

export function AnimatedHeart({ isLiked, onClick, count, className }: AnimatedHeartProps) {
  return (
    <button 
      onClick={onClick}
      className={cn("relative flex items-center hover:text-red-500 transition-colors", className)}
    >
      <motion.div
        animate={isLiked ? {
          scale: [1, 1.2, 1],
          transition: { duration: 0.35 }
        } : {}}
      >
        <Heart 
          className={cn(
            "w-4 h-4 mr-1 transition-colors duration-300",
            isLiked ? 'fill-red-500 text-red-500' : ''
          )}
        />
      </motion.div>
      
      <AnimatePresence>
        {isLiked && (
          <>
            {/* Heart burst effect */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-red-500/20 rounded-full blur-sm"
            />
            
            {/* Floating hearts */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`heart-${i}`}
                initial={{ 
                  scale: 0,
                  opacity: 1,
                  x: 0,
                  y: 0
                }}
                animate={{ 
                  scale: [0.5, 1, 0.5],
                  opacity: [1, 0],
                  x: [-10 + i * 10, -15 + i * 15],
                  y: [-20, -30],
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                  delay: i * 0.1,
                }}
                className="absolute left-0 top-0"
              >
                <Heart className="w-3 h-3 fill-red-500 text-red-500" />
              </motion.div>
            ))}
            
            {/* Sparkles */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                initial={{ 
                  opacity: 0,
                  scale: 0,
                  x: 0,
                  y: 0,
                }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: [
                    0,
                    (i % 2 ? 15 : -15) * Math.cos(i * Math.PI / 2),
                    (i % 2 ? 20 : -20) * Math.cos(i * Math.PI / 2),
                  ],
                  y: [
                    0,
                    -15 * Math.sin(i * Math.PI / 2),
                    -20 * Math.sin(i * Math.PI / 2),
                  ],
                }}
                transition={{
                  duration: 0.6,
                  ease: "easeOut",
                  delay: i * 0.1,
                }}
                className="absolute left-0 top-0 w-1 h-1 bg-red-400"
                style={{
                  borderRadius: '50%',
                  boxShadow: '0 0 4px rgba(239, 68, 68, 0.5)',
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
      
      <motion.span
        key={count}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-sm"
      >
        {count}
      </motion.span>
    </button>
  )
} 