export type Era = '70s' | '90s' | '1990s' | '2000s' | '2010s' | '2020s' | '1900s' | 'Classic Era';
export type Genre = 'Comedy' | 'Romance' | 'Action' | 'Drama' | 'Sports';
export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Tough AF';
export type Category = 'Famous AF' | 'Meme Dialogues';

export interface Dialogue {
  id: string;
  dialogue: string;
  movieFull: string;
  characterFull: string;
  actor: string;
  era: Era;
  genre: Genre;
  difficulty: Difficulty;
  isPopular?: boolean;
  isMeme?: boolean;
}

export type GameScreen = 'HOME' | 'CATEGORY' | 'PASS_PHONE' | 'GAMEPLAY' | 'RESULTS';

export interface GameState {
  screen: GameScreen;
  selectedEras: Era[];
  selectedGenres: Genre[];
  selectedDifficulties: Difficulty[];
  selectedCategories: Category[];
  currentRoundDialogues: Dialogue[];
  currentIndex: number;
  score: number;
  timer: number;
  timerDuration: number;
  isTimerEnabled: boolean;
  results: {
    dialogue: Dialogue;
    guessed: boolean;
  }[];
}
