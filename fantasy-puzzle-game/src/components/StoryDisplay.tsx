'use client';

import { motion } from 'framer-motion';

interface StoryDisplayProps {
  story: string[];
  title: string;
}

export default function StoryDisplay({ story, title }: StoryDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-black bg-opacity-30 backdrop-blur-sm rounded-lg p-6 mb-8 border border-purple-500"
    >
      <h2 className="text-2xl font-bold mb-4 text-yellow-400">{title}</h2>
      <div className="space-y-3">
        {story.map((paragraph, index) => (
          <motion.p
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.5, duration: 0.5 }}
            className="text-gray-200 leading-relaxed"
          >
            {paragraph}
          </motion.p>
        ))}
      </div>
    </motion.div>
  );
}