import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState } from '@/types/game';

interface GameStore extends GameState {
  setPlayerName: (name: string) => void;
  setCurrentChapter: (chapter: string) => void;
  completePuzzle: (puzzleId: string) => void;
  setCurrentPuzzle: (puzzleId: string | null) => void;
  addHint: (puzzleId: string) => void;
  resetGame: () => void;
}

const initialState: GameState = {
  currentChapter: 'prologue',
  playerName: '',
  completedPuzzles: [],
  currentPuzzle: null,
  hints: {},
  startTime: Date.now(),
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setPlayerName: (name: string) => 
        set({ playerName: name }),
      
      setCurrentChapter: (chapter: string) => 
        set({ currentChapter: chapter }),
      
      completePuzzle: (puzzleId: string) => 
        set((state) => ({
          completedPuzzles: [...state.completedPuzzles, puzzleId],
          currentPuzzle: null,
        })),
      
      setCurrentPuzzle: (puzzleId: string | null) => 
        set({ currentPuzzle: puzzleId }),
      
      addHint: (puzzleId: string) => 
        set((state) => ({
          hints: {
            ...state.hints,
            [puzzleId]: (state.hints[puzzleId] || 0) + 1,
          },
        })),
      
      resetGame: () => 
        set({ ...initialState, startTime: Date.now() }),
    }),
    {
      name: 'fantasy-puzzle-game',
    }
  )
);