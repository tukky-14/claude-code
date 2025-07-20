'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Puzzle } from '@/types/game';
import { useGameStore } from '@/store/gameStore';

interface PuzzleDisplayProps {
  puzzle: Puzzle;
  onComplete: () => void;
}

export default function PuzzleDisplay({ puzzle, onComplete }: PuzzleDisplayProps) {
  const [userInput, setUserInput] = useState('');
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [message, setMessage] = useState('');
  
  const { addHint, hints, setPlayerName } = useGameStore();
  const hintLevel = hints[puzzle.id] || 0;

  const handleSubmit = () => {
    let isCorrect = false;
    
    if (puzzle.type === 'input') {
      if (puzzle.id === 'name_input') {
        if (userInput.trim()) {
          setPlayerName(userInput.trim());
          isCorrect = true;
        } else {
          setMessage('名前を入力してください');
          return;
        }
      } else {
        isCorrect = userInput.toLowerCase().trim() === puzzle.answer?.toLowerCase();
      }
    } else if (puzzle.type === 'choice') {
      isCorrect = selectedChoice === puzzle.correctChoice;
    } else if (puzzle.type === 'special') {
      isCorrect = userInput.toLowerCase().trim() === puzzle.answer?.toLowerCase();
    }

    if (isCorrect) {
      setMessage('正解です！');
      setTimeout(() => {
        onComplete();
      }, 1500);
    } else {
      setMessage('不正解です。もう一度考えてみましょう。');
    }
  };

  const handleHint = () => {
    addHint(puzzle.id);
    setShowHint(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-lg p-6 border border-blue-500"
    >
      <h3 className="text-xl font-bold mb-4 text-blue-300">謎解き</h3>
      
      <div className="mb-6">
        <p className="text-gray-200 leading-relaxed">{puzzle.question}</p>
        
        {puzzle.id === 'library_secret' && (
          <div className="mt-4 p-4 bg-yellow-900 bg-opacity-30 rounded border border-yellow-600">
            {/* <!-- secret: knowledge --> */}
            <p className="text-yellow-300 text-sm">
              💡 ヒント: このページのHTMLソースを調べてみましょう（右クリック→「ページのソースを表示」または F12 → Elements）
            </p>
          </div>
        )}
      </div>

      {puzzle.type === 'input' && (
        <div className="mb-4">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
            placeholder="答えを入力してください"
            onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          />
        </div>
      )}

      {puzzle.type === 'choice' && puzzle.choices && (
        <div className="mb-4 space-y-2">
          {puzzle.choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => setSelectedChoice(index)}
              className={`w-full p-3 text-left rounded border transition-colors ${
                selectedChoice === index
                  ? 'bg-blue-600 border-blue-400'
                  : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
              }`}
            >
              {choice}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-3 mb-4">
        <button
          onClick={handleSubmit}
          disabled={
            (puzzle.type === 'input' && !userInput.trim()) ||
            (puzzle.type === 'choice' && selectedChoice === null)
          }
          className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded transition-colors"
        >
          答える
        </button>
        
        <button
          onClick={handleHint}
          className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 rounded transition-colors"
        >
          ヒント ({hintLevel}/3)
        </button>
      </div>

      {showHint && puzzle.hint && hintLevel > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4 p-4 bg-yellow-900 bg-opacity-30 rounded border border-yellow-600"
        >
          <p className="text-yellow-300">
            💡 {puzzle.hint[Math.min(hintLevel - 1, puzzle.hint.length - 1)]}
          </p>
        </motion.div>
      )}

      {message && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`p-3 rounded ${
            message.includes('正解') 
              ? 'bg-green-900 bg-opacity-30 border border-green-600 text-green-300'
              : 'bg-red-900 bg-opacity-30 border border-red-600 text-red-300'
          }`}
        >
          {message}
        </motion.div>
      )}
    </motion.div>
  );
}