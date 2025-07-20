'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { chapters } from '@/data/chapters';
import GameLayout from '@/components/GameLayout';
import StoryDisplay from '@/components/StoryDisplay';
import PuzzleDisplay from '@/components/PuzzleDisplay';
import { motion } from 'framer-motion';

export default function Home() {
  const { 
    currentChapter, 
    completedPuzzles, 
    currentPuzzle,
    setCurrentChapter,
    setCurrentPuzzle,
    completePuzzle 
  } = useGameStore();
  
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  
  const chapter = chapters[currentChapter];
  const puzzle = chapter?.puzzles[currentPuzzleIndex];

  useEffect(() => {
    if (!currentPuzzle && puzzle) {
      setCurrentPuzzle(puzzle.id);
    }
  }, [puzzle, currentPuzzle, setCurrentPuzzle]);

  const handlePuzzleComplete = () => {
    if (puzzle) {
      completePuzzle(puzzle.id);
      
      if (puzzle.nextChapter) {
        setTimeout(() => {
          setCurrentChapter(puzzle.nextChapter!);
          setCurrentPuzzleIndex(0);
        }, 2000);
      } else if (currentPuzzleIndex < chapter.puzzles.length - 1) {
        setTimeout(() => {
          setCurrentPuzzleIndex(currentPuzzleIndex + 1);
        }, 2000);
      }
    }
  };

  if (!chapter) {
    return (
      <GameLayout>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400">チャプターが見つかりません</h2>
        </div>
      </GameLayout>
    );
  }

  const isCompleted = completedPuzzles.includes(puzzle?.id || '');

  return (
    <GameLayout>
      <div className="space-y-8">
        <StoryDisplay story={chapter.story} title={chapter.title} />
        
        {puzzle && !isCompleted && (
          <PuzzleDisplay
            puzzle={puzzle}
            onComplete={handlePuzzleComplete}
          />
        )}
        
        {isCompleted && currentPuzzleIndex < chapter.puzzles.length - 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <p className="text-green-400 text-lg">謎を解きました！次の謎に進んでいます...</p>
          </motion.div>
        )}
        
        {currentChapter === 'chapter1' && currentPuzzleIndex >= chapter.puzzles.length - 1 && isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-800 to-blue-800 p-8 rounded-lg text-center"
          >
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">チャプター1 完了！</h3>
            <p className="text-gray-200 mb-4">
              素晴らしい！魔法の図書館の謎を全て解き明かしました。
            </p>
            <p className="text-gray-300 text-sm">
              次のチャプターは開発中です。現在のプロトタイプはここまでとなります。
            </p>
          </motion.div>
        )}
      </div>
    </GameLayout>
  );
}