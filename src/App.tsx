import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, 
  Play, 
  Dices, 
  Trophy, 
  ChevronLeft, 
  RotateCcw, 
  Check, 
  FastForward, 
  Eye, 
  Timer as TimerIcon,
  Home,
  Flame,
  Theater,
  Clock,
  Brain
} from 'lucide-react';
import { 
  GameScreen, 
  Era, 
  Genre, 
  Difficulty, 
  Category, 
  Dialogue, 
  GameState 
} from './types';
import { DIALOGUES } from './constants';

const ERAS: Era[] = ['70s', '90s', '2000s', 'Classic Era'];
const GENRES: Genre[] = ['Comedy', 'Romance', 'Action', 'Drama'];
const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Tough AF'];
const CATEGORIES: Category[] = ['Famous AF', 'Meme Dialogues'];

export default function App() {
  const [state, setState] = useState<GameState>({
    screen: 'HOME',
    selectedEras: [],
    selectedGenres: [],
    selectedDifficulties: [],
    selectedCategories: [],
    currentRoundDialogues: [],
    currentIndex: 0,
    score: 0,
    timer: 60,
    results: [],
  });

  const [showHint, setShowHint] = useState(false);
  const [exitDirection, setExitDirection] = useState<'up' | 'left' | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setState(prev => {
        if (prev.timer <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return { ...prev, screen: 'RESULTS' };
        }
        return { ...prev, timer: prev.timer - 1 };
      });
    }, 1000);
  }, []);

  useEffect(() => {
    if (state.screen === 'GAMEPLAY') {
      startTimer();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.screen, startTimer]);

  const handleStartGame = () => {
    setState(prev => ({ ...prev, screen: 'CATEGORY' }));
  };

  const handleQuickPlay = () => {
    const shuffled = [...DIALOGUES].sort(() => 0.5 - Math.random()).slice(0, 10);
    setState(prev => ({
      ...prev,
      currentRoundDialogues: shuffled,
      currentIndex: 0,
      score: 0,
      timer: 60,
      results: [],
      screen: 'PASS_PHONE'
    }));
  };

  const toggleSelection = <T,>(list: T[], item: T): T[] => {
    return list.includes(item) ? list.filter(i => i !== item) : [...list, item];
  };

  const handleAction = () => {
    let filtered = DIALOGUES;
    
    if (state.selectedEras.length > 0) {
      filtered = filtered.filter(d => state.selectedEras.includes(d.era));
    }
    if (state.selectedGenres.length > 0) {
      filtered = filtered.filter(d => state.selectedGenres.includes(d.genre));
    }
    if (state.selectedDifficulties.length > 0) {
      filtered = filtered.filter(d => state.selectedDifficulties.includes(d.difficulty));
    }
    if (state.selectedCategories.length > 0) {
      filtered = filtered.filter(d => {
        if (state.selectedCategories.includes('Famous AF') && d.isPopular) return true;
        if (state.selectedCategories.includes('Meme Dialogues') && d.isMeme) return true;
        return false;
      });
    }

    const shuffled = [...filtered].sort(() => 0.5 - Math.random()).slice(0, 10);
    if (shuffled.length === 0) {
      alert("No dialogues found for this selection! Try broadening your criteria.");
      return;
    }

    setState(prev => ({
      ...prev,
      currentRoundDialogues: shuffled,
      currentIndex: 0,
      score: 0,
      timer: 60,
      results: [],
      screen: 'PASS_PHONE'
    }));
  };

  const handleGuess = (guessed: boolean) => {
    const currentDialogue = state.currentRoundDialogues[state.currentIndex];
    setExitDirection(guessed ? 'up' : 'left');
    
    setTimeout(() => {
      setState(prev => {
        const nextIndex = prev.currentIndex + 1;
        const isLast = nextIndex >= prev.currentRoundDialogues.length;
        
        return {
          ...prev,
          score: guessed ? prev.score + 1 : prev.score,
          currentIndex: nextIndex,
          results: [...prev.results, { dialogue: currentDialogue, guessed }],
          screen: isLast ? 'RESULTS' : prev.screen
        };
      });
      setShowHint(false);
      setExitDirection(null);
      
      if (navigator.vibrate) {
        navigator.vibrate(guessed ? 50 : [50, 30, 50]);
      }
    }, 100);
  };

  const renderHome = () => (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center h-full px-6 text-center"
    >
      <div className="absolute top-6 right-6">
        <Settings className="w-6 h-6 text-white/50" />
      </div>
      
      <div className="mb-12">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-5xl font-display leading-tight tracking-tighter text-saffron neon-glow-saffron"
        >
          🎬 BOLLYWOOD<br/>DIALOGBAAZI
        </motion.div>
      </div>

      <div className="flex flex-col w-full gap-4 max-w-xs">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleStartGame}
          className="py-4 text-xl font-display bg-saffron text-black rounded-full shadow-lg shadow-saffron/20 flex items-center justify-center gap-2"
        >
          <Play className="fill-current" /> START GAME
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleQuickPlay}
          className="py-4 text-xl font-display border-2 border-white/20 rounded-full flex items-center justify-center gap-2"
        >
          <Dices /> QUICK PLAY
        </motion.button>

        <button className="mt-4 flex items-center justify-center gap-2 text-white/60 text-sm font-medium">
          <Trophy className="w-4 h-4" /> Leaderboard
        </button>
      </div>
    </motion.div>
  );

  const renderCategory = () => (
    <motion.div 
      initial={{ x: '100%' }} 
      animate={{ x: 0 }} 
      exit={{ x: '-100%' }}
      className="flex flex-col h-full bg-[#0F0F0F]"
    >
      <div className="p-6 flex items-center justify-between">
        <button onClick={() => setState(prev => ({ ...prev, screen: 'HOME' }))} className="flex items-center gap-1 text-white/60">
          <ChevronLeft /> Back
        </button>
        <button 
          onClick={() => setState(prev => ({ ...prev, selectedEras: [], selectedGenres: [], selectedDifficulties: [], selectedCategories: [] }))}
          className="text-saffron font-medium"
        >
          Reset
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-32">
        <h1 className="text-2xl font-display mb-1 text-white">CURATE YOUR SETLIST</h1>
        <p className="text-white/40 text-sm mb-8">Select one or more</p>

        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4 text-saffron">
            <Flame className="w-5 h-5" />
            <h2 className="font-display tracking-wide">POPULAR</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setState(prev => ({ ...prev, selectedCategories: toggleSelection(prev.selectedCategories, cat) }))}
                className={`px-4 py-2 rounded-full border transition-all ${state.selectedCategories.includes(cat) ? 'bg-saffron border-saffron text-black' : 'border-white/10 text-white/60'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4 text-rani">
            <Theater className="w-5 h-5" />
            <h2 className="font-display tracking-wide">GENRE</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {GENRES.map(genre => (
              <button
                key={genre}
                onClick={() => setState(prev => ({ ...prev, selectedGenres: toggleSelection(prev.selectedGenres, genre) }))}
                className={`px-4 py-2 rounded-full border transition-all ${state.selectedGenres.includes(genre) ? 'bg-rani border-rani text-white' : 'border-white/10 text-white/60'}`}
              >
                {genre}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4 text-blue-400">
            <Clock className="w-5 h-5" />
            <h2 className="font-display tracking-wide">TIME / ERA</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {ERAS.map(era => (
              <button
                key={era}
                onClick={() => setState(prev => ({ ...prev, selectedEras: toggleSelection(prev.selectedEras, era) }))}
                className={`px-4 py-2 rounded-full border transition-all ${state.selectedEras.includes(era) ? 'bg-blue-400 border-blue-400 text-black' : 'border-white/10 text-white/60'}`}
              >
                {era}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4 text-green-400">
            <Brain className="w-5 h-5" />
            <h2 className="font-display tracking-wide">DIFFICULTY</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {DIFFICULTIES.map(diff => (
              <button
                key={diff}
                onClick={() => setState(prev => ({ ...prev, selectedDifficulties: toggleSelection(prev.selectedDifficulties, diff) }))}
                className={`px-4 py-2 rounded-full border transition-all ${state.selectedDifficulties.includes(diff) ? 'bg-green-400 border-green-400 text-black' : 'border-white/10 text-white/60'}`}
              >
                {diff}
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0F0F0F] to-transparent">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleAction}
          className="w-full py-4 text-xl font-display bg-gradient-to-r from-rani to-saffron text-white rounded-xl shadow-xl"
        >
          🎬 ACTION!
        </motion.button>
      </div>
    </motion.div>
  );

  const renderPassPhone = () => (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center h-full px-6 text-center bg-[#1A0A10]"
    >
      <div className="mb-8">
        <span className="text-6xl mb-6 block">✋</span>
        <h1 className="text-4xl font-display mb-4 tracking-tight">PASS THE PHONE</h1>
        <p className="text-white/60 text-lg">Give the device to the<br/>next "Dialogbaaz"</p>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ boxShadow: ["0 0 0px rgba(255,153,51,0)", "0 0 30px rgba(255,153,51,0.4)", "0 0 0px rgba(255,153,51,0)"] }}
        transition={{ duration: 2, repeat: Infinity }}
        onClick={() => setState(prev => ({ ...prev, screen: 'GAMEPLAY' }))}
        className="w-40 h-40 rounded-full bg-saffron flex flex-col items-center justify-center text-black gap-2"
      >
        <Eye className="w-10 h-10" />
        <span className="font-display text-sm">REVEAL CARD</span>
      </motion.button>
    </motion.div>
  );

  const renderGameplay = () => {
    const currentDialogue = state.currentRoundDialogues[state.currentIndex];
    if (!currentDialogue) return null;

    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="flex flex-col h-full p-6"
      >
        <div className="flex items-center justify-between mb-8">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${state.timer < 10 ? 'border-red-500 text-red-500 neon-glow-rani animate-pulse' : 'border-white/20 text-white/60'}`}>
            <TimerIcon className="w-4 h-4" />
            <span className="font-display text-lg">{String(Math.floor(state.timer / 60)).padStart(2, '0')}:{String(state.timer % 60).padStart(2, '0')}</span>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-full flex items-center gap-2">
            <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Score</span>
            <span className="font-display text-saffron">{String(state.score).padStart(2, '0')}</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentDialogue.id}
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={exitDirection === 'up' 
                ? { y: -500, opacity: 0, scale: 1.1, transition: { duration: 0.4 } } 
                : { x: -500, opacity: 0, rotate: -10, transition: { duration: 0.4 } }
              }
              className="glass-card w-full max-w-sm aspect-[3/4] rounded-3xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-saffron/30 to-transparent" />
              
              <span className="text-4xl mb-6 opacity-20">"</span>
              <h2 className="text-3xl md:text-4xl font-serif italic leading-relaxed text-white">
                {currentDialogue.text}
              </h2>
              <span className="text-4xl mt-6 opacity-20">"</span>

              <div className="mt-12 w-full">
                {showHint ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-saffron font-display tracking-widest text-sm uppercase"
                  >
                    🎬 {currentDialogue.movie}
                  </motion.div>
                ) : (
                  <button 
                    onClick={() => setShowHint(true)}
                    className="text-white/30 text-xs font-medium uppercase tracking-widest border-b border-white/10 pb-1"
                  >
                    Tap to see movie hint (-1 pt)
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex gap-4 mt-8">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleGuess(false)}
            className="flex-1 py-4 rounded-2xl border-2 border-white/10 text-white/60 font-display flex items-center justify-center gap-2"
          >
            <FastForward className="w-5 h-5" /> SKIP
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleGuess(true)}
            className="flex-1 py-4 rounded-2xl bg-saffron text-black font-display flex items-center justify-center gap-2 shadow-lg shadow-saffron/20"
          >
            <Check className="w-5 h-5" /> GUESSED
          </motion.button>
        </div>
      </motion.div>
    );
  };

  const renderResults = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="flex flex-col h-full p-6"
    >
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <span className="text-6xl mb-4">🎉</span>
        <h1 className="text-4xl font-display mb-2">THAT'S A WRAP!</h1>
        <div className="text-2xl text-saffron font-display mb-8">
          Your Score: {state.score}/{state.currentRoundDialogues.length}
        </div>

        <div className="w-full max-w-sm glass-card rounded-2xl p-6 text-left">
          <h3 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">The Highlights</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {state.results.map((res, i) => (
              <div key={i} className="flex items-start gap-3">
                {res.guessed ? (
                  <Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                ) : (
                  <FastForward className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="text-sm font-medium text-white/90 line-clamp-1 italic">"{res.dialogue.text}"</div>
                  <div className="text-[10px] text-white/40 uppercase tracking-wider">{res.dialogue.movie} ({res.dialogue.era})</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-8">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setState(prev => ({ ...prev, screen: 'CATEGORY' }))}
          className="w-full py-4 bg-saffron text-black font-display rounded-xl flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" /> PLAY AGAIN
        </motion.button>
        <button 
          onClick={() => setState(prev => ({ ...prev, screen: 'HOME' }))}
          className="w-full py-2 text-white/40 font-display text-sm flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" /> MAIN MENU
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="h-screen w-full max-w-md mx-auto overflow-hidden relative bg-animate">
      <AnimatePresence mode="wait">
        {state.screen === 'HOME' && renderHome()}
        {state.screen === 'CATEGORY' && renderCategory()}
        {state.screen === 'PASS_PHONE' && renderPassPhone()}
        {state.screen === 'GAMEPLAY' && renderGameplay()}
        {state.screen === 'RESULTS' && renderResults()}
      </AnimatePresence>
    </div>
  );
}
