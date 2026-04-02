export type Era = '70s' | '90s' | '2000s' | 'Classic Era';
export type Genre = 'Comedy' | 'Romance' | 'Action' | 'Drama';
export type Difficulty = 'Easy' | 'Medium' | 'Tough AF';
export type Category = 'Famous AF' | 'Meme Dialogues';

export interface Dialogue {
  id: string;
  text: string;
  movie: string;
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
  results: {
    dialogue: Dialogue;
    guessed: boolean;
  }[];
}
