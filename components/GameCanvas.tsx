
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CloudflareLogo } from './CloudflareLogo';
import { GameState, Position, Velocity, Particle } from '../types';
import { 
  GRAVITY, 
  JUMP_STRENGTH, 
  TERMINAL_VELOCITY, 
  HORIZONTAL_DRIFT_RANGE, 
  LOGO_SIZE,
  GAME_OVER_MESSAGES,
  MILESTONE_MESSAGES
} from '../constants';
import { Play, RotateCcw, ServerCrash, ShieldCheck } from 'lucide-react';

export const GameCanvas: React.FC = () => {
  // Game State
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  
  // Message State
  const [milestoneToast, setMilestoneToast] = useState<string | null>(null);
  const [gameOverMsg, setGameOverMsg] = useState<string>("");

  // Physics State (Refs for performance in loop)
  const positionRef = useRef<Position>({ x: 0, y: 0 });
  const velocityRef = useRef<Velocity>({ dx: 0, dy: 0 });
  const scoreRef = useRef<number>(0); // Sync ref for physics loop access
  const requestRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const toastTimeoutRef = useRef<number>(0);

  // Visual State (for React rendering)
  const [renderTrigger, setRenderTrigger] = useState(0); // Force re-render for React UI updates based on refs

  const spawnLogo = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    positionRef.current = {
      x: clientWidth / 2 - LOGO_SIZE / 2,
      y: clientHeight * 0.3 // Start slightly below center
    };
    velocityRef.current = { dx: 0, dy: 0 };
  }, []);

  const startGame = () => {
    spawnLogo();
    setScore(0);
    scoreRef.current = 0;
    setParticles([]);
    setMilestoneToast(null);
    setGameState(GameState.PLAYING);
  };

  const gameOver = () => {
    setGameState(GameState.GAME_OVER);
    
    // Set random funny message
    const randomMsg = GAME_OVER_MESSAGES[Math.floor(Math.random() * GAME_OVER_MESSAGES.length)];
    setGameOverMsg(randomMsg);

    if (scoreRef.current > highScore) {
      setHighScore(scoreRef.current);
      localStorage.setItem('cf-keeper-highscore', scoreRef.current.toString());
    }
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
  };

  const addParticle = (x: number, y: number, text: string) => {
    const newParticle: Particle = {
      id: Date.now() + Math.random(),
      x,
      y,
      life: 1.0,
      text
    };
    setParticles(prev => [...prev, newParticle]);
  };

  const handleLogoClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (gameState !== GameState.PLAYING) return;
    
    e.stopPropagation(); // Prevent triggering background clicks if any

    // Increment Score & Update Ref
    const newScore = scoreRef.current + 1;
    scoreRef.current = newScore;
    setScore(newScore);

    // Check for milestone
    if (MILESTONE_MESSAGES[newScore]) {
      setMilestoneToast(MILESTONE_MESSAGES[newScore]);
      
      // Clear previous timeout if fast clicking
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      
      // Auto hide after 2.5 seconds
      toastTimeoutRef.current = window.setTimeout(() => {
        setMilestoneToast(null);
      }, 2500);
    }

    // Difficulty: Calculate Horizontal Chaos
    // As score increases, the drift becomes wilder (faster horizontal movement)
    // Multiplier increases by 3% per point.
    const chaosMultiplier = 1 + (newScore * 0.03);

    // Jump Logic
    velocityRef.current.dy = JUMP_STRENGTH;
    
    // Add random horizontal drift with increased chaos
    const drift = (Math.random() - 0.5) * HORIZONTAL_DRIFT_RANGE * 6 * chaosMultiplier; 
    velocityRef.current.dx = drift;
    
    // Visuals
    const { x, y } = positionRef.current;
    addParticle(x + LOGO_SIZE / 2, y, '+1');
  };

  const updateGame = useCallback(() => {
    if (gameState !== GameState.PLAYING || !containerRef.current) return;

    const { clientHeight, clientWidth } = containerRef.current;
    const pos = positionRef.current;
    const vel = velocityRef.current;

    // Difficulty: Gravity & Speed Scaling
    // Gravity increases by 5% per point (Aggressive scaling).
    const difficultyMultiplier = 1 + (scoreRef.current * 0.05);
    const currentGravity = GRAVITY * difficultyMultiplier;
    
    // Terminal velocity increases to allow falling faster as difficulty ramps up
    const currentTerminalVelocity = TERMINAL_VELOCITY + (scoreRef.current * 0.5);

    // Apply Gravity
    vel.dy += currentGravity;
    if (vel.dy > currentTerminalVelocity) vel.dy = currentTerminalVelocity;

    // Apply Velocity
    pos.y += vel.dy;
    pos.x += vel.dx;

    // Wall Bouncing (Horizontal)
    if (pos.x <= 0) {
      pos.x = 0;
      // Bounce preserves more energy as difficulty increases to keep it fast
      vel.dx = -vel.dx * 0.7; 
    } else if (pos.x + LOGO_SIZE >= clientWidth) {
      pos.x = clientWidth - LOGO_SIZE;
      vel.dx = -vel.dx * 0.7;
    }

    // Floor Check (Game Over)
    if (pos.y > clientHeight) {
      gameOver();
      return; 
    }

    // Update Particles
    setParticles(prevParticles => 
      prevParticles
        .map(p => ({ ...p, y: p.y - 2, life: p.life - 0.02 }))
        .filter(p => p.life > 0)
    );

    setRenderTrigger(prev => prev + 1);

    requestRef.current = requestAnimationFrame(updateGame);
  }, [gameState]);

  useEffect(() => {
    const saved = localStorage.getItem('cf-keeper-highscore');
    if (saved) setHighScore(parseInt(saved));
    
    return () => {
        if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    }
  }, []);

  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      requestRef.current = requestAnimationFrame(updateGame);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState, updateGame]);

  const logoElementRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (logoElementRef.current) {
      logoElementRef.current.style.transform = `translate(${positionRef.current.x}px, ${positionRef.current.y}px)`;
    }
  }, [renderTrigger]);

  // Calculate dynamic background speed (duration decreases aggressively as score increases)
  // Base: 3s. Minimum: 0.5s for warp speed effect.
  const bgAnimationDuration = Math.max(0.5, 3 - (score * 0.1));

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-gradient-to-b from-blue-500 to-blue-300 select-none"
    >
      {/* Moving Background Clouds Pattern - Speed increases with score */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 50 Q 25 35 40 50 T 70 50 T 100 50' stroke='white' fill='transparent' stroke-width='2'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
            animation: gameState === GameState.PLAYING 
              ? `scroll-down ${bgAnimationDuration}s linear infinite` 
              : 'none'
        }}
      />
      
      {/* Score Display (in-game) */}
      <div className="absolute top-8 left-0 right-0 flex flex-col items-center pointer-events-none z-10">
        <span className="text-6xl font-bold text-white drop-shadow-md font-mono">
          {score}
        </span>
      </div>

      {/* Milestone Toast Notification */}
      {milestoneToast && (
        <div className="absolute top-28 left-0 right-0 flex justify-center pointer-events-none z-30 animate-[bounce_0.5s_infinite]">
          <div className="bg-[#F6821F] text-white px-6 py-3 rounded-full shadow-xl border-2 border-white flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
            <ShieldCheck size={24} className="text-white" />
            <span className="font-bold text-lg">{milestoneToast}</span>
          </div>
        </div>
      )}

      {/* Game Area */}
      {gameState === GameState.PLAYING && (
        <>
          {/* The Logo Character */}
          <div 
            ref={logoElementRef}
            className="absolute top-0 left-0 will-change-transform"
            style={{ transform: `translate(${positionRef.current.x}px, ${positionRef.current.y}px)` }}
          >
             <CloudflareLogo 
                size={LOGO_SIZE} 
                onClick={handleLogoClick}
                className="hover:brightness-110 active:scale-95"
             />
          </div>

          {/* Floating Particles */}
          {particles.map(p => (
            <div
              key={p.id}
              className="absolute font-bold text-white text-xl pointer-events-none"
              style={{
                left: p.x,
                top: p.y,
                opacity: p.life,
                transform: `scale(${0.5 + p.life})`
              }}
            >
              {p.text}
            </div>
          ))}
        </>
      )}

      {/* Start Screen */}
      {gameState === GameState.START && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-20">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-xs w-full">
            <CloudflareLogo size={100} className="mb-6 animate-bounce" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">System Down?</h1>
            <p className="text-gray-600 text-center mb-6">Keep the network afloat!</p>
            
            <button 
              onClick={startGame}
              className="flex items-center gap-2 bg-[#F6821F] hover:bg-[#d66e15] text-white px-8 py-3 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              <Play size={24} fill="currentColor" />
              Start
            </button>
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameState === GameState.GAME_OVER && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md z-20 animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm w-full border-b-8 border-[#F6821F]">
            <div className="text-[#F6821F] mb-2 animate-pulse">
               <ServerCrash size={56} />
            </div>
            <h2 className="text-3xl font-black text-gray-800 mb-1">CONNECTION LOST</h2>
            
            {/* Funny Error Message */}
            <div className="bg-gray-100 w-full p-3 rounded mb-6 text-center border border-gray-200">
                <p className="text-gray-600 font-mono text-sm font-medium">
                   {gameOverMsg}
                </p>
            </div>
            
            <div className="w-full flex justify-between items-center px-4 mb-6">
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Score</span>
                <span className="text-4xl font-bold text-gray-800">{score}</span>
              </div>
              <div className="h-10 w-px bg-gray-200 mx-4"></div>
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Best</span>
                <span className="text-4xl font-bold text-[#F6821F]">{highScore}</span>
              </div>
            </div>

            <button 
              onClick={startGame}
              className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl w-full justify-center"
            >
              <RotateCcw size={20} />
              Reboot System
            </button>
          </div>
        </div>
      )}
      
      {/* Helper Text */}
      {gameState === GameState.PLAYING && score === 0 && (
        <div className="absolute bottom-20 w-full text-center animate-pulse pointer-events-none">
          <p className="text-white font-bold text-lg shadow-black drop-shadow-md">
            Tap the logo to jump!
          </p>
        </div>
      )}
    </div>
  );
};
