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
  Brain,
  User,
  Film,
  Star
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

const ERAS: Era[] = ['70s', '90s', '1990s', '2000s', '2010s', '2020s', 'Classic Era'];
const GENRES: Genre[] = ['Comedy', 'Romance', 'Action', 'Drama', 'Sports'];
const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard', 'Tough AF'];
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
    timerDuration: 60,
    isTimerEnabled: true,
    results: [],
  });

  const [isFlipped, setIsFlipped] = useState(false);
  const [exitDirection, setExitDirection] = useState<'up' | 'left' | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = useCallback(() => {
    if (!state.isTimerEnabled) return;
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
      timer: prev.timerDuration,
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
      timer: prev.timerDuration,
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
      setIsFlipped(false);
      setExitDirection(null);
      
      if (navigator.vibrate) {
        navigator.vibrate(guessed ? 50 : [50, 30, 50]);
      }
    }, 100);
  };

  const getFontSize = (text: string) => {
    const length = text.length;
    if (length > 200) return 'text-xs';
    if (length > 150) return 'text-sm';
    if (length > 120) return 'text-base';
    if (length > 100) return 'text-lg';
    if (length > 80) return 'text-xl';
    if (length > 60) return 'text-2xl';
    return 'text-3xl md:text-4xl';
  };

  const Branding = ({ className = "" }: { className?: string }) => (
    <div className={`text-[10px] font-bold uppercase tracking-wider text-white/60 ${className}`}>
      Developed by <span className="text-neon-cyan">Satwik Talegaonkar</span>
    </div>
  );

  const HomeButton = () => (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => setState(prev => ({ ...prev, screen: 'HOME' }))}
      className="absolute top-6 left-6 z-50 p-2 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all"
    >
      <Home className="w-5 h-5" />
    </motion.button>
  );

  const renderHome = () => (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center h-full px-6 text-center relative"
    >
      <div className="absolute top-6 right-6">
        <Settings className="w-6 h-6 text-white/50" />
      </div>
      
      <div className="mb-12">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-5xl font-display leading-tight tracking-tighter text-neon-purple neon-glow-purple"
        >
          🎬 BOLLYWOOD<br/>DIALOGBAAZI
        </motion.div>
        <Branding className="mt-4" />
      </div>

      <div className="flex flex-col w-full gap-4 max-w-xs">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleStartGame}
          className="pop-button py-4 text-xl font-display bg-neon-purple text-white rounded-2xl shadow-lg shadow-neon-purple/40 flex items-center justify-center gap-2"
        >
          <Play className="fill-current" /> START GAME
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleQuickPlay}
          className="pop-button py-4 text-xl font-display border-2 border-neon-cyan text-neon-cyan rounded-2xl flex items-center justify-center gap-2"
        >
          <Dices /> QUICK PLAY
        </motion.button>

        <button className="mt-4 flex items-center justify-center gap-2 text-white/60 text-sm font-medium hover:text-neon-yellow transition-colors">
          <Trophy className="w-4 h-4" /> Leaderboard
        </button>

        <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/10 w-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-white/60 text-xs font-bold uppercase tracking-widest">
              <TimerIcon className="w-3 h-3" /> Timer
            </div>
            <button 
              onClick={() => setState(prev => ({ ...prev, isTimerEnabled: !prev.isTimerEnabled }))}
              className={`w-10 h-5 rounded-full transition-colors relative ${state.isTimerEnabled ? 'bg-neon-cyan' : 'bg-white/10'}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${state.isTimerEnabled ? 'left-5.5' : 'left-0.5'}`} />
            </button>
          </div>
          {state.isTimerEnabled && (
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] text-white/40 uppercase tracking-widest">
                <span>Duration</span>
                <span className="text-neon-cyan">{state.timerDuration}s</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="120" 
                step="5"
                value={state.timerDuration}
                onChange={(e) => setState(prev => ({ ...prev, timerDuration: parseInt(e.target.value) }))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-neon-cyan"
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  const renderCategory = () => (
    <motion.div 
      initial={{ x: '100%' }} 
      animate={{ x: 0 }} 
      exit={{ x: '-100%' }}
      className="flex flex-col h-full bg-dark-bg relative"
    >
      <HomeButton />
      <div className="p-6 flex items-center justify-end">
        <button 
          onClick={() => setState(prev => ({ ...prev, selectedEras: [], selectedGenres: [], selectedDifficulties: [], selectedCategories: [] }))}
          className="text-neon-yellow font-medium"
        >
          Reset
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-32">
        <h1 className="text-2xl font-display mb-1 text-white neon-glow-cyan">Dialogbaazi Chalu Karo!</h1>
        <p className="text-white/40 text-sm mb-8">Choose your Poison</p>

        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4 text-neon-cyan">
            <TimerIcon className="w-5 h-5" />
            <h2 className="font-display tracking-wide uppercase">Timer Settings</h2>
          </div>
          <div className="space-y-4 bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm">Enable Timer</span>
              <button 
                onClick={() => setState(prev => ({ ...prev, isTimerEnabled: !prev.isTimerEnabled }))}
                className={`w-12 h-6 rounded-full transition-colors relative ${state.isTimerEnabled ? 'bg-neon-cyan' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${state.isTimerEnabled ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
            
            {state.isTimerEnabled && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-white/40">
                  <span>Duration</span>
                  <span className="text-neon-cyan font-bold">{state.timerDuration}s</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="120" 
                  step="5"
                  value={state.timerDuration}
                  onChange={(e) => setState(prev => ({ ...prev, timerDuration: parseInt(e.target.value) }))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-neon-cyan"
                />
              </div>
            )}
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4 text-neon-yellow">
            <Flame className="w-5 h-5" />
            <h2 className="font-display tracking-wide">POPULAR</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setState(prev => ({ ...prev, selectedCategories: toggleSelection(prev.selectedCategories, cat) }))}
                className={`px-4 py-2 rounded-xl border transition-all pop-button ${state.selectedCategories.includes(cat) ? 'bg-neon-yellow border-neon-yellow text-black' : 'border-white/10 text-white/60'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4 text-neon-pink">
            <Theater className="w-5 h-5" />
            <h2 className="font-display tracking-wide">GENRE</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {GENRES.map(genre => (
              <button
                key={genre}
                onClick={() => setState(prev => ({ ...prev, selectedGenres: toggleSelection(prev.selectedGenres, genre) }))}
                className={`px-4 py-2 rounded-xl border transition-all pop-button ${state.selectedGenres.includes(genre) ? 'bg-neon-pink border-neon-pink text-white' : 'border-white/10 text-white/60'}`}
              >
                {genre}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4 text-neon-cyan">
            <Clock className="w-5 h-5" />
            <h2 className="font-display tracking-wide">TIME / ERA</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {ERAS.map(era => (
              <button
                key={era}
                onClick={() => setState(prev => ({ ...prev, selectedEras: toggleSelection(prev.selectedEras, era) }))}
                className={`px-4 py-2 rounded-xl border transition-all pop-button ${state.selectedEras.includes(era) ? 'bg-neon-cyan border-neon-cyan text-black' : 'border-white/10 text-white/60'}`}
              >
                {era}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4 text-neon-purple">
            <Brain className="w-5 h-5" />
            <h2 className="font-display tracking-wide">DIFFICULTY</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {DIFFICULTIES.map(diff => (
              <button
                key={diff}
                onClick={() => setState(prev => ({ ...prev, selectedDifficulties: toggleSelection(prev.selectedDifficulties, diff) }))}
                className={`px-4 py-2 rounded-xl border transition-all pop-button ${state.selectedDifficulties.includes(diff) ? 'bg-neon-purple border-neon-purple text-white' : 'border-white/10 text-white/60'}`}
              >
                {diff}
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-dark-bg to-transparent flex flex-col items-center gap-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleAction}
          className="pop-button w-full py-4 text-xl font-display bg-gradient-to-r from-neon-purple to-neon-cyan text-white rounded-2xl shadow-xl shadow-neon-purple/20"
        >
          🎬 ACTION!
        </motion.button>
        <Branding />
      </div>
    </motion.div>
  );

  const renderPassPhone = () => (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center h-full px-6 text-center bg-[#1A0033] relative"
    >
      <HomeButton />
      <div className="mb-8">
        <span className="text-6xl mb-6 block">✋</span>
        <h1 className="text-4xl font-display mb-4 tracking-tight neon-glow-purple">PASS THE PHONE</h1>
        <p className="text-white/60 text-lg">Give the device to the<br/>next "Dialogbaaz"</p>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        animate={{ boxShadow: ["0 0 0px rgba(176,38,255,0)", "0 0 40px rgba(176,38,255,0.6)", "0 0 0px rgba(176,38,255,0)"] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        onClick={() => setState(prev => ({ ...prev, screen: 'GAMEPLAY' }))}
        className="pop-button w-44 h-44 rounded-full bg-neon-purple flex flex-col items-center justify-center text-white gap-2"
      >
        <Eye className="w-10 h-10" />
        <span className="font-display text-sm uppercase tracking-widest">Start Round</span>
      </motion.button>
      <Branding className="absolute bottom-8" />
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
        className="flex flex-col h-full p-6 relative"
      >
        <HomeButton />
        <div className="flex items-center justify-between mb-8 pl-14">
          {state.isTimerEnabled ? (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${state.timer < 10 ? 'border-neon-pink text-neon-pink neon-glow-pink animate-pulse' : 'border-white/20 text-white/60'}`}>
              <TimerIcon className="w-4 h-4" />
              <span className="font-display text-lg">{String(Math.floor(state.timer / 60)).padStart(2, '0')}:{String(state.timer % 60).padStart(2, '0')}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-white/40">
              <Clock className="w-4 h-4" />
              <span className="font-display text-sm uppercase tracking-widest">Zen Mode</span>
            </div>
          )}
          <div className="bg-white/10 px-4 py-2 rounded-full flex items-center gap-2 border border-white/10">
            <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Score</span>
            <span className="font-display text-neon-cyan">{String(state.score).padStart(2, '0')}</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center perspective-1000">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentDialogue.id}
              initial={{ scale: 0.8, opacity: 0, rotateY: 0 }}
              animate={{ scale: 1, opacity: 1, rotateY: isFlipped ? 180 : 0 }}
              exit={exitDirection === 'up' 
                ? { y: -500, opacity: 0, scale: 1.1, transition: { duration: 0.4 } } 
                : { x: -500, opacity: 0, rotate: -10, transition: { duration: 0.4 } }
              }
              transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
              className="w-full max-w-sm aspect-[3/4] relative preserve-3d"
            >
              {/* Front Side (Hidden State) */}
              <div className="absolute inset-0 glass-card rounded-3xl p-8 flex flex-col items-center justify-center text-center backface-hidden shadow-2xl border-2 border-white/5">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink" />
                
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                  <Eye className="w-10 h-10 text-neon-purple animate-pulse" />
                </div>
                
                <h2 className="text-2xl font-display text-white mb-2 tracking-tight">READY TO REVEAL?</h2>
                <p className="text-white/40 text-sm mb-12">Tap the button below to see the dialogue and details.</p>

                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsFlipped(true)}
                  className="pop-button px-8 py-4 bg-neon-purple text-white rounded-2xl font-display tracking-widest shadow-lg shadow-neon-purple/40"
                >
                  REVEAL CARD
                </motion.button>
              </div>

              {/* Back Side (The Full Reveal) */}
              <div className="absolute inset-0 glass-card rounded-3xl p-6 flex flex-col items-center justify-center text-center backface-hidden rotate-y-180 shadow-2xl border-2 border-neon-cyan/30 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-cyan" />
                
                <div className="flex-1 flex flex-col items-center justify-center w-full space-y-4">
                  <div className="grid grid-cols-3 gap-2 w-full">
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1 text-neon-cyan">
                        <Film className="w-3 h-3" />
                        <span className="text-[8px] font-bold uppercase tracking-wider opacity-60">Movie</span>
                      </div>
                      <h3 className="text-[11px] font-display text-white">{currentDialogue.movieFull}</h3>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1 text-neon-purple">
                        <User className="w-3 h-3" />
                        <span className="text-[8px] font-bold uppercase tracking-wider opacity-60">Character</span>
                      </div>
                      <h3 className="text-[11px] font-display text-white/90">{currentDialogue.characterFull}</h3>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1 text-neon-yellow">
                        <Star className="w-3 h-3" />
                        <span className="text-[8px] font-bold uppercase tracking-wider opacity-60">Actor</span>
                      </div>
                      <h3 className="text-[11px] font-display text-white/80">{currentDialogue.actor}</h3>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 w-full flex-1 flex flex-col justify-center overflow-hidden">
                    <div className="text-[9px] font-bold uppercase tracking-wider text-neon-pink mb-2 opacity-60">The Dialogue</div>
                    <div className="flex-1 flex items-center justify-center overflow-hidden">
                      <h2 className={`${getFontSize(currentDialogue.dialogue)} font-serif italic leading-relaxed text-white neon-glow-purple px-2 max-h-full overflow-hidden`}>
                        "{currentDialogue.dialogue}"
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex gap-4 mt-8">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => handleGuess(false)}
            className="pop-button flex-1 py-4 rounded-2xl border-2 border-white/5 bg-white/5 text-white/40 font-display flex items-center justify-center gap-2"
          >
            <FastForward className="w-5 h-5" /> SKIP
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => handleGuess(true)}
            className="pop-button flex-1 py-4 rounded-2xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-display flex items-center justify-center gap-2 shadow-lg shadow-neon-cyan/20"
          >
            <Check className="w-5 h-5" /> GUESSED
          </motion.button>
        </div>
        <Branding className="mt-6 text-center" />
      </motion.div>
    );
  };

  const renderResults = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="flex flex-col h-full p-6 relative"
    >
      <HomeButton />
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <span className="text-6xl mb-4">🏆</span>
        <h1 className="text-4xl font-display mb-2 neon-glow-purple">THAT'S A WRAP!</h1>
        <div className="text-2xl text-neon-cyan font-display mb-8">
          Your Score: {state.score}/{state.currentRoundDialogues.length}
        </div>

        <div className="w-full max-w-sm glass-card rounded-3xl p-6 text-left border border-white/10">
          <h3 className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">The Highlights</h3>
          <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {state.results.map((res, i) => (
              <div key={i} className="flex items-start gap-3 group">
                {res.guessed ? (
                  <div className="w-6 h-6 rounded-full bg-neon-cyan/20 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-neon-cyan" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-neon-pink/20 flex items-center justify-center shrink-0">
                    <FastForward className="w-3 h-3 text-neon-pink" />
                  </div>
                )}
                <div>
                  <div className="text-sm font-medium text-white/90 line-clamp-1 italic group-hover:text-neon-cyan transition-colors">"{res.dialogue.dialogue}"</div>
                  <div className="text-[10px] text-white/30 uppercase tracking-wider">{res.dialogue.movieFull}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-8">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setState(prev => ({ ...prev, screen: 'CATEGORY' }))}
          className="pop-button w-full py-4 bg-neon-purple text-white font-display rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-neon-purple/30"
        >
          <RotateCcw className="w-5 h-5" /> PLAY AGAIN
        </motion.button>
        <Branding className="text-center" />
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
