export interface GameState {
  currentChapter: string;
  playerName: string;
  completedPuzzles: string[];
  currentPuzzle: string | null;
  hints: Record<string, number>;
  startTime: number;
}

export interface Puzzle {
  id: string;
  type: 'text' | 'choice' | 'input' | 'special';
  question: string;
  answer?: string;
  choices?: string[];
  correctChoice?: number;
  hint?: string[];
  nextChapter?: string;
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  puzzles: Puzzle[];
  story: string[];
}