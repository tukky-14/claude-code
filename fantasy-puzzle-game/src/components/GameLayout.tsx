'use client';

import { ReactNode } from 'react';
import { useGameStore } from '@/store/gameStore';

interface GameLayoutProps {
  children: ReactNode;
}

export default function GameLayout({ children }: GameLayoutProps) {
  const { playerName, currentChapter, completedPuzzles } = useGameStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
            剣と魔法の謎解きアドベンチャー
          </h1>
          {playerName && (
            <div className="text-lg text-gray-300">
              <span>冒険者: {playerName}</span>
              <span className="ml-4">進行度: {completedPuzzles.length}問クリア</span>
            </div>
          )}
        </header>
        
        <main className="max-w-4xl mx-auto">
          {children}
        </main>
        
        <footer className="mt-12 text-center text-gray-400 text-sm">
          <p>Webならではのギミックを楽しみながら謎を解き明かそう！</p>
        </footer>
      </div>
    </div>
  );
}