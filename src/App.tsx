import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Brain, Lightbulb, Sparkles, Trophy, RotateCcw, Play, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { CATEGORY_A_TEAMS, CATEGORY_B_TEAMS, Team } from './constants';
import { analyzeDrawResult } from './services/geminiService';

type DrawState = 'IDLE' | 'COUNTDOWN' | 'DRAWING' | 'RESULT';

interface DrawResult {
  category: string;
  order: number;
  team: Team;
}

export default function App() {
  const [state, setState] = useState<DrawState>('IDLE');
  const [countdownValue, setCountdownValue] = useState(3);
  const [results, setResults] = useState<DrawResult[]>([]);
  const [currentDrawingIndex, setCurrentDrawingIndex] = useState(-1);
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const shuffle = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleStartDraw = useCallback(async () => {
    setState('COUNTDOWN');
    setCountdownValue(3);
    setResults([]);
    setCurrentDrawingIndex(-1);
    setAnalysis('');

    // Play countdown
    for (let i = 3; i > 0; i--) {
      setCountdownValue(i);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setState('DRAWING');

    // Logic for Category A
    const nonFixedA = CATEGORY_A_TEAMS.filter(t => !t.fixed);
    const fixedA = CATEGORY_A_TEAMS.find(t => t.fixed)!;
    const shuffledA = shuffle(nonFixedA);
    const finalA = shuffledA.map((t, i) => ({ category: 'A', order: i + 1, team: t }));
    finalA.push({ category: 'A', order: CATEGORY_A_TEAMS.length, team: fixedA });

    // Logic for Category B
    const shuffledB = shuffle(CATEGORY_B_TEAMS);
    const finalB = shuffledB.map((t, i) => ({ category: 'B', order: i + 1, team: t }));

    const allResults = [...finalA, ...finalB];
    
    // Animate drawing one by one
    for (let i = 0; i < allResults.length; i++) {
      setCurrentDrawingIndex(i);
      setResults(prev => [...prev, allResults[i]]);
      await new Promise(resolve => setTimeout(resolve, 4000)); // Ceremonial delay
    }

    setState('RESULT');
    setIsAnalyzing(true);
    const resultForAnalysis = allResults.map(r => ({
      category: r.category,
      order: r.order,
      id: r.team.id,
      name: r.team.name
    }));
    const aiAnalysis = await analyzeDrawResult(resultForAnalysis);
    setAnalysis(aiAnalysis);
    setIsAnalyzing(false);
  }, []);

  const resetDraw = () => {
    setState('IDLE');
    setResults([]);
    setCurrentDrawingIndex(-1);
    setAnalysis('');
  };

  return (
    <div className="min-h-screen text-tech-text p-4 md:p-8 relative overflow-hidden">
      <div className="scanline" />
      
      {/* Background Grid Accent */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20" 
           style={{ backgroundImage: 'radial-gradient(circle, rgba(0, 242, 255, 0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <main className="max-w-[1600px] mx-auto relative z-10 flex flex-col items-center justify-center min-h-[90vh] py-8">
        {/* Header */}
        <header className="mb-10 text-center shrink-0">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-tech-border bg-tech-card/50 backdrop-blur-sm mb-6"
          >
            <Cpu className="w-5 h-5 text-tech-accent" />
            <span className="text-sm font-mono tracking-widest uppercase text-tech-muted">Network Mgmt AI Cup 2024</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[60px] font-bold tracking-tighter mb-6 tech-glow leading-tight"
          >
            網管處 AI 推動競賽 <br className="hidden md:block" />
            <span className="text-tech-accent">決賽抽籤系統</span>
          </motion.h1>
          <div className="h-2 w-48 bg-tech-accent mx-auto rounded-full blur-[2px]" />
        </header>

        <AnimatePresence mode="wait">
          {state === 'IDLE' && (
            <motion.section
              key="idle"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-10 w-full"
            >
              <div className="grid md:grid-cols-2 gap-10">
                {/* Category A Display */}
                <div className="border-2 border-tech-accent/20 bg-tech-card/30 rounded-3xl p-10 backdrop-blur-md shadow-[0_0_30px_rgba(0,242,255,0.05)]">
                  <div className="flex items-center gap-4 mb-8 border-b border-tech-border pb-6">
                    <Brain className="w-10 h-10 text-tech-accent" />
                    <h2 className="text-4xl font-mono uppercase tracking-wider font-bold">A 類：自行研發 ({CATEGORY_A_TEAMS.length}件)</h2>
                  </div>
                  <ul className="space-y-3">
                    {CATEGORY_A_TEAMS.map((team) => (
                      <li key={team.id} className="flex gap-4 items-center group">
                        <span className="font-mono text-tech-accent bg-tech-accent/10 px-3 py-1.5 rounded-lg text-lg w-[80px] shrink-0 flex items-center justify-center border border-tech-accent/30">{team.id}</span>
                        <span className="text-xl font-bold group-hover:text-tech-accent transition-colors leading-tight">{team.name}</span>
                        {team.fixed && <span className="text-[10px] font-bold font-mono text-tech-accent border border-tech-accent/50 bg-tech-accent/20 px-2 py-0.5 rounded-md shrink-0 ml-2">A類最後一組報告</span>}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Category B Display */}
                <div className="border-2 border-tech-secondary/20 bg-tech-card/30 rounded-3xl p-10 backdrop-blur-md shadow-[0_0_30px_rgba(208,0,255,0.05)]">
                  <div className="flex items-center gap-4 mb-8 border-b border-tech-border pb-6">
                    <Lightbulb className="w-10 h-10 text-tech-secondary" />
                    <h2 className="text-4xl font-mono uppercase tracking-wider font-bold">B 類：創新構想 ({CATEGORY_B_TEAMS.length}件)</h2>
                  </div>
                  <ul className="space-y-3">
                    {CATEGORY_B_TEAMS.map((team) => (
                      <li key={team.id} className="flex gap-4 items-center group">
                        <span className="font-mono text-tech-secondary bg-tech-secondary/10 px-3 py-1.5 rounded-lg text-lg w-[80px] shrink-0 flex items-center justify-center border border-tech-secondary/30">{team.id}</span>
                        <span className="text-xl font-bold group-hover:text-tech-secondary transition-colors leading-tight">{team.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-center pt-8">
                <button
                  onClick={handleStartDraw}
                  className="group relative px-16 py-6 bg-tech-accent text-black font-black text-3xl rounded-none skew-x-[-12deg] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(0,242,255,0.3)]"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-in-out" />
                  <span className="flex items-center gap-4 skew-x-[12deg] text-[29px] leading-[35px]">
                    <Play className="w-8 h-8 fill-current" />
                    正式啟動抽籤程序
                  </span>
                </button>
              </div>
            </motion.section>
          )}

          {state === 'COUNTDOWN' && (
            <motion.section
              key="countdown"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 w-full"
            >
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute inset-0 bg-tech-accent/20 blur-[100px] rounded-full"
                />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={countdownValue}
                    initial={{ scale: 2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "backOut" }}
                    className="text-[200px] font-black font-mono text-tech-accent tech-glow relative z-10"
                  >
                    {countdownValue}
                  </motion.div>
                </AnimatePresence>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 text-2xl font-mono tracking-[1em] text-tech-muted uppercase"
              >
                Initializing Draw Sequence
              </motion.div>
            </motion.section>
          )}

          {state === 'DRAWING' && (
            <motion.section
              key="drawing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 w-full"
            >
              <div className="relative w-full max-w-4xl text-center">
                <div className="absolute -inset-10 bg-tech-accent/10 blur-3xl rounded-full" />
                <motion.div
                  animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mb-10 font-mono text-tech-accent tracking-[1.5em] text-xl uppercase"
                >
                  SYSTEM ANALYZING DATA
                </motion.div>
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentDrawingIndex}
                    initial={{ scale: 0.8, opacity: 0, y: 40 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 1.1, opacity: 0, y: -40 }}
                    className="bg-tech-card/90 border-2 border-tech-accent p-20 rounded-[2.5rem] backdrop-blur-2xl relative overflow-hidden shadow-[0_0_50px_rgba(0,242,255,0.2)]"
                  >
                    <div className="absolute top-0 left-0 w-full h-2 bg-tech-accent overflow-hidden">
                      <motion.div 
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 1.5, ease: "linear" }}
                        className="bg-white w-40 h-full shadow-[0_0_15px_white]"
                      />
                    </div>
                    <div className="flex flex-col items-center gap-10">
                      <div className="text-tech-muted font-mono text-3xl mb-2">
                        {results[currentDrawingIndex]?.category} 類 決賽第 <span className="text-tech-accent font-bold">{results[currentDrawingIndex]?.order}</span> 順位
                      </div>
                      <div className="text-9xl font-mono text-tech-accent font-black tracking-tighter">
                        {results[currentDrawingIndex]?.team.id}
                      </div>
                      <div className="text-4xl font-bold max-w-3xl leading-tight text-white underline underline-offset-8 decoration-tech-accent/30 decoration-4">
                        {results[currentDrawingIndex]?.team.name}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-16 flex justify-center gap-3 font-mono">
                  {Array.from({ length: CATEGORY_A_TEAMS.length + CATEGORY_B_TEAMS.length }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-3 w-16 rounded-full transition-all duration-500 ${i <= currentDrawingIndex ? 'bg-tech-accent shadow-[0_0_20px_rgba(0,242,255,0.8)]' : 'bg-tech-card border border-tech-border'}`}
                    />
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          {state === 'RESULT' && (
            <motion.section
              key="result"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full pb-10"
            >
              <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-stretch">
                {/* Final Order List */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b-2 border-tech-border pb-4 mb-4">
                    <div className="flex items-center gap-4">
                      <Trophy className="w-8 h-8 text-yellow-400" />
                      <h2 className="text-4xl font-bold tracking-tight">最終出場順序</h2>
                    </div>
                    <button
                      onClick={resetDraw}
                      className="p-3 hover:bg-tech-accent hover:text-black rounded-xl transition-all text-tech-muted"
                    >
                      <RotateCcw className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {/* A Category Results */}
                    <div className="space-y-3">
                      {results.filter(r => r.category === 'A').map((res) => (
                        <motion.div
                          key={res.team.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * res.order }}
                          className="flex items-center gap-6 bg-tech-card/50 p-6 border-2 border-tech-accent/20 rounded-2xl hover:border-tech-accent/50 transition-all group"
                        >
                          <div className="flex flex-col items-center justify-center w-24 shrink-0">
                            <span className="text-[14px] font-mono text-tech-muted leading-none mb-2">ORDER</span>
                            <span className="text-6xl font-mono font-black text-tech-accent group-hover:scale-110 transition-transform">{res.order}</span>
                          </div>
                          <div className="w-px h-20 bg-tech-border" />
                          <div className="flex-grow">
                            <div className="text-base font-mono text-tech-accent mb-2 px-3 py-1 bg-tech-accent/10 border border-tech-accent/20 rounded-lg inline-block">{res.team.id}</div>
                            <div className="font-bold text-xl leading-tight">{res.team.name}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* B Category Results */}
                    <div className="space-y-3">
                      {results.filter(r => r.category === 'B').map((res) => (
                          <motion.div
                            key={res.team.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + 0.1 * res.order }}
                            className="flex items-center gap-6 bg-tech-card/50 p-6 border-2 border-tech-secondary/20 rounded-2xl hover:border-tech-secondary/50 transition-all group"
                          >
                            <div className="flex flex-col items-center justify-center w-24 shrink-0">
                              <span className="text-[14px] font-mono text-tech-muted leading-none mb-2">ORDER</span>
                              <span className="text-6xl font-mono font-black text-tech-secondary group-hover:scale-110 transition-transform">{res.order}</span>
                            </div>
                            <div className="w-px h-20 bg-tech-border" />
                            <div className="flex-grow">
                              <div className="text-base font-mono text-tech-secondary mb-2 px-3 py-1 bg-tech-secondary/10 border border-tech-secondary/20 rounded-lg inline-block">{res.team.id}</div>
                              <div className="font-bold text-xl leading-tight">{res.team.name}</div>
                            </div>
                          </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Analysis Section */}
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-4 border-b-2 border-tech-border pb-4 mb-8">
                    <Sparkles className="w-8 h-8 text-tech-accent" />
                    <h2 className="text-4xl font-bold tracking-tight">AI 戰情分析</h2>
                  </div>
                  
                  <div className="bg-tech-card/40 border-2 border-tech-accent/30 p-10 rounded-[2rem] relative overflow-hidden backdrop-blur-xl flex-grow flex flex-col shadow-[0_0_30px_rgba(0,242,255,0.1)] text-[14px]">
                    <div className="absolute top-0 right-0 p-6">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/50 animate-pulse" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50 animate-pulse delay-75" />
                        <div className="w-3 h-3 rounded-full bg-green-500/50 animate-pulse delay-150" />
                      </div>
                    </div>

                    {isAnalyzing ? (
                      <div className="flex flex-col items-center justify-center flex-grow gap-6">
                        <Loader2 className="w-16 h-16 text-tech-accent animate-spin" />
                        <div className="text-xl font-mono text-tech-muted animate-pulse">GENERATING STRATEGIC INSIGHTS...</div>
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex-grow overflow-y-auto custom-scrollbar"
                      >
                        <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-strong:text-tech-accent prose-strong:bg-tech-accent/10 prose-strong:px-1 prose-strong:rounded prose-h2:text-center prose-h2:text-tech-accent prose-h2:mb-8 prose-h2:text-4xl">
                          <ReactMarkdown>
                            {analysis}
                          </ReactMarkdown>
                        </div>
                      </motion.div>
                    )}
                    
                    <div className="mt-10 pt-6 border-t border-tech-border/30 flex items-center justify-between text-xs font-mono text-tech-muted uppercase">
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-tech-accent animate-ping" />
                        SYSTEM: GEMINI FLASH 3.0
                      </span>
                      <span>SECURE CHANNEL ALPHA-7</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Design Element */}
      <footer className="fixed bottom-0 left-0 w-full p-4 flex justify-between items-center text-[10px] font-mono text-tech-muted uppercase pointer-events-none opacity-50">
        <div className="flex gap-4">
          <span>LAT: 25.0330° N</span>
          <span>LNG: 121.5654° E</span>
        </div>
        <div>System: ONLINE</div>
      </footer>
    </div>
  );
}
