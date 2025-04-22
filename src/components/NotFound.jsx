import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaRocket, FaStar, FaAsterisk, FaArrowLeft, FaArrowRight, FaCrosshairs, FaMeteor, FaRegCompass, FaArrowDown, FaArrowUp } from 'react-icons/fa';
import AnimatedBackground from './helperComponents/AnimatedBackground';
import SectionObserver from './helperComponents/SectionObserver';
import SpaceMazeGame from './games/SpaceMazeGame';
import AsteroidDodgeGame from './games/AsteroidDodgeGame';

// Game 1: Catch the Astronaut
const AstronautGame = ({ onGameOver, onBackToMenu }) => {
  const [score, setScore] = useState(0);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [timeLeft, setTimeLeft] = useState(30);
  const [difficulty, setDifficulty] = useState(1);
  const [powerUps, setPowerUps] = useState([]);
  const [combo, setCombo] = useState(0);
  const [lastCatchTime, setLastCatchTime] = useState(0);
  const [particles, setParticles] = useState([]);
  const [gameStats, setGameStats] = useState({ catches: 0, powerUpsCollected: 0, highestCombo: 0 });
  const [obstacles, setObstacles] = useState([]);
  const gameAreaRef = useRef(null);
  const comboTimeoutRef = useRef(null);
  
  // Increase difficulty every 5 points
  useEffect(() => {
    if (score > 0 && score % 5 === 0) {
      setDifficulty(prev => Math.min(prev + 1, 10));
      
      // Add celebration particles
      createParticles(50, position.x, position.y, ['#FFD700', '#FF6347', '#4169E1', '#32CD32']);
    }
  }, [score]);
  
  // Generate random power-up
  useEffect(() => {
    if (score > 0 && score % 6 === 0) {
      const powerUpTypes = ['time', 'score', 'slowMotion', 'magnet', 'shield'];
      const newPowerUp = {
        id: Date.now(),
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        type: powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)]
      };
      setPowerUps(prev => [...prev, newPowerUp]);
      
      // Remove power-up after 5 seconds
      setTimeout(() => {
        setPowerUps(prev => prev.filter(p => p.id !== newPowerUp.id));
      }, 5000);
    }
  }, [score]);

  // Generate obstacles based on difficulty
  useEffect(() => {
    if (difficulty >= 3 && obstacles.length < difficulty - 2) {
      const newObstacle = {
        id: Date.now(),
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        size: Math.random() * 10 + 10,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 4
      };
      setObstacles(prev => [...prev, newObstacle]);
    }
  }, [difficulty, obstacles.length]);

  // Move obstacles
  useEffect(() => {
    if (obstacles.length === 0) return;
    
    const moveObstaclesInterval = setInterval(() => {
      setObstacles(prev => prev.map(obstacle => ({
        ...obstacle,
        x: obstacle.x + (Math.random() - 0.5) * 5,
        y: obstacle.y + (Math.random() - 0.5) * 5,
        rotation: (obstacle.rotation + obstacle.rotationSpeed) % 360
      })).filter(obs => 
        obs.x >= 0 && obs.x <= 100 && 
        obs.y >= 0 && obs.y <= 100
      ));
    }, 1000);
    
    return () => clearInterval(moveObstaclesInterval);
  }, [obstacles]);

  // Move astronaut randomly based on difficulty
  useEffect(() => {
    if (!gameAreaRef.current) return;

    const moveAstronaut = () => {
      if (gameAreaRef.current) {
        const rect = gameAreaRef.current.getBoundingClientRect();
        const padding = 50;
        const maxX = 100 - padding/rect.width*100;
        const maxY = 100 - padding/rect.height*100;
        const minX = padding/rect.width*100;
        const minY = padding/rect.height*100;
        
        // More complex movement with increasing difficulty
        let newX, newY;
        
        if (difficulty >= 7) {
          // Teleporting movement at highest difficulties
          newX = Math.max(minX, Math.min(maxX, Math.random() * 100));
          newY = Math.max(minY, Math.min(maxY, Math.random() * 100));
          createParticles(10, position.x, position.y, ['#8A2BE2', '#9400D3']);
        } else if (difficulty >= 5) {
          // Erratic zig-zag movements
          newX = Math.max(minX, Math.min(maxX, position.x + (Math.random() * 60 - 30)));
          newY = Math.max(minY, Math.min(maxY, position.y + (Math.random() * 60 - 30)));
        } else if (difficulty >= 3) {
          // More erratic movements at higher difficulties
          newX = Math.max(minX, Math.min(maxX, position.x + (Math.random() * 40 - 20)));
          newY = Math.max(minY, Math.min(maxY, position.y + (Math.random() * 40 - 20)));
        } else {
          // Random position at lower difficulties
          newX = Math.random() * (maxX - minX) + minX;
          newY = Math.random() * (maxY - minY) + minY;
        }
        
        setPosition({ x: newX, y: newY });
      }
    };

    // Speed increases with difficulty
    const moveSpeed = Math.max(1200 - (difficulty * 120), 300);
    const interval = setInterval(moveAstronaut, moveSpeed);
    return () => clearInterval(interval);
  }, [difficulty, position]);

  // Manage particles
  useEffect(() => {
    if (particles.length === 0) return;
    
    const particleLifetime = 1000; // 1 second
    const updateParticles = () => {
      setParticles(prev => prev
        .map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          opacity: particle.opacity - 0.02,
          size: particle.size * 0.98
        }))
        .filter(particle => particle.opacity > 0)
      );
    };
    
    const interval = setInterval(updateParticles, 50);
    return () => clearInterval(interval);
  }, [particles]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      onGameOver(score);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, score, onGameOver]);

  // Create visual particles effect
  const createParticles = (count, x, y, colors) => {
    const newParticles = Array.from({ length: count }, () => ({
      id: Math.random().toString(36).substring(2, 9),
      x,
      y,
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3,
      size: Math.random() * 6 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 1
    }));
    
    setParticles(prev => [...prev, ...newParticles]);
  };

  // Manage combo system
  const updateCombo = () => {
    const now = Date.now();
    // If catch within 1.5 seconds of last catch, increase combo
    if (now - lastCatchTime < 1500) {
      setCombo(prev => prev + 1);
    } else {
      setCombo(1);
    }
    setLastCatchTime(now);
    
    // Reset combo after 1.5 seconds of inactivity
    if (comboTimeoutRef.current) {
      clearTimeout(comboTimeoutRef.current);
    }
    
    comboTimeoutRef.current = setTimeout(() => {
      setGameStats(prev => ({
        ...prev,
        highestCombo: Math.max(prev.highestCombo, combo)
      }));
      setCombo(0);
    }, 1500);
  };

  const catchAstronaut = () => {
    // Update combo
    updateCombo();
    
    // Calculate score based on combo
    const comboMultiplier = combo > 0 ? combo : 1;
    const pointsToAdd = comboMultiplier * (difficulty > 5 ? 2 : 1);
    
    setScore(prevScore => prevScore + pointsToAdd);
    setGameStats(prev => ({
      ...prev,
      catches: prev.catches + 1
    }));
    
    // Create particle effect at catch location
    createParticles(20, position.x, position.y, ['#1E90FF', '#00BFFF', '#87CEFA']);
    
    // Play catch sound with pitch based on combo
    const audio = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//uQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAASAAAeMwAUFBQUFCIiIiIiIjAwMDAwMD4+Pj4+PkxMTExMTFpaWlpaWmhoaGhoaHZ2dnZ2doSEhISEhJKSkpKSkqCgoKCgoK6urq6urry8vLy8vMrKysrKytjY2NjY2Obm5ubm5vT09PT09P////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAYEAAAAAAAAHjOZuuUkAAAAAAAAAAAAAAAAAAAA//vQZAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAASAAAeMwAUFBQUFCIiIiIiIjAwMDAwMD4+Pj4+PkxMTExMTFpaWlpaWmhoaGhoaHZ2dnZ2doSEhISEhJKSkpKSkqCgoKCgoK6urq6urry8vLy8vMrKysrKytjY2NjY2Obm5ubm5vT09PT09P////8AAAAMQXBwbGVTY3JpcHQAAABUaGlzIHNvdW5kIHdhcyBjcmVhdGVkIGJ5IFB1cmUgRGF0YSBDZW50ZXIgb2YgQ3JlYXRpdml0eS4AAAAAAAAAAAAAAAAAAAAA//uwZAAAAAAAf8AAAAAAAAAAlgAAAAAJ2iDAAAAAAACAAC4AA8gAKs7QKAGNmJVHKzLdGVM3hyJYyYlgszYVExBTUUzLjEwMKqqqqqqqqqqqqqsxMTEFNRTMuMTAwqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');
    audio.playbackRate = 0.8 + (comboMultiplier * 0.1);
    audio.play();
  };

  const collectPowerUp = (powerUp) => {
    setGameStats(prev => ({
      ...prev,
      powerUpsCollected: prev.powerUpsCollected + 1
    }));
    
    // Apply power-up effect based on type
    switch(powerUp.type) {
      case 'time':
        setTimeLeft(prev => prev + 5);
        createParticles(15, powerUp.x, powerUp.y, ['#00FF00', '#32CD32']);
        break;
      case 'score':
        setScore(prev => prev + 3);
        createParticles(15, powerUp.x, powerUp.y, ['#FFD700', '#FFA500']);
        break;
      case 'slowMotion':
        // Temporarily decrease difficulty
        setDifficulty(prev => Math.max(1, prev - 2));
        setTimeout(() => {
          setDifficulty(prev => Math.min(10, prev + 2));
        }, 5000);
        createParticles(15, powerUp.x, powerUp.y, ['#9932CC', '#8A2BE2']);
        break;
      case 'magnet':
        // Move astronaut closer to cursor on next few moves
        // (This effect would be implemented in the movement logic if we had cursor tracking)
        createParticles(15, powerUp.x, powerUp.y, ['#FF6347', '#DC143C']);
        break;
      case 'shield':
        // Remove obstacles temporarily
        setObstacles([]);
        setTimeout(() => {
          // Obstacles will be regenerated by the useEffect
        }, 5000);
        createParticles(15, powerUp.x, powerUp.y, ['#1E90FF', '#4169E1']);
        break;
      default:
        break;
    }
    
    setPowerUps(prev => prev.filter(p => p.id !== powerUp.id));
    
    // Play power-up sound
    const audio = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//uQZAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAADAAAGhgBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2k5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk/////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAUAAAAAAAAGhpNRCFYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//vAZAAAAtoKRAgPSuAAAAA/wAAABHDDXJgJMhqpEAKsASZDVSAsViVRBP+LCYL/z5iWI6YlNkUVY9nTPEP9Q1nCwajSRMLBoZgZyTUybjmRmZOYnZuMzEzJzMzOzEbFYGDCY8WICJFWEpmRmZkeGfkyMzEzIzMjQzMzIzMzEzEREiRERGZmQnZmZmZ+ZmZmZmZmZmZmZmZmf/lZmZmZmZmZmZmZmZmR4ZmZmZmZkRE//lZmZmZmZmZmZmZmZmZmZmZmZmZ//kZmZmZMf/+TCdmQnZOZkZ2TmZGdmZyRVhKZkZmRCZQAUKBQoFCgUKBQoFCgUKBQoFCgUKBQoFCg');
    audio.play();
  };

  return (
    <div className="game-container space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="text-xl font-medium premium-gradient-text">Score: {score}</div>
          <div className="text-sm text-gray-400">Difficulty: {difficulty}/10</div>
        </div>
        <div className="text-center">
          {combo > 1 && (
            <div className="text-lg font-bold premium-gradient-text animate-pulse">
              Combo x{combo}!
            </div>
          )}
        </div>
        <div className="text-xl font-medium premium-gradient-text">Time: {timeLeft}s</div>
      </div>
      
      <div 
        ref={gameAreaRef} 
        className="bg-gray-900/50 rounded-xl w-full h-64 sm:h-80 relative overflow-hidden border border-gray-800/50"
      >
        {/* Astronaut */}
        <button
          className={`absolute w-12 h-12 transform -translate-x-1/2 -translate-y-1/2 bg-transparent border-0 cursor-pointer transition-transform hover:scale-110 focus:outline-none active:scale-90 ${difficulty >= 7 ? 'animate-ping' : difficulty >= 5 ? 'animate-pulse' : ''}`}
          style={{ 
            left: `${position.x}%`, 
            top: `${position.y}%`,
            filter: `brightness(${difficulty >= 4 ? '0.8' : '1'}) hue-rotate(${difficulty * 15}deg)`
          }}
          onClick={catchAstronaut}
          aria-label="Catch the astronaut"
        >
          <div className={`astronaut animate-float ${difficulty >= 5 ? 'astronaut-hard' : ''}`}>
            <div className="relative">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
              </div>
              <div className="absolute -top-2 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </button>
        
        {/* Obstacles */}
        {obstacles.map(obstacle => (
          <div
            key={obstacle.id}
            className="absolute bg-red-500/30 border border-red-500/50 rounded-full flex items-center justify-center"
            style={{
              width: `${obstacle.size}%`,
              height: `${obstacle.size}%`,
              left: `${obstacle.x}%`,
              top: `${obstacle.y}%`,
              transform: `translate(-50%, -50%) rotate(${obstacle.rotation}deg)`,
              boxShadow: '0 0 15px rgba(255, 0, 0, 0.5)'
            }}
          >
            <FaAsterisk className="text-red-500 text-xl" />
          </div>
        ))}
        
        {/* Power-ups */}
        {powerUps.map(powerUp => (
          <button
            key={powerUp.id}
            className="absolute w-8 h-8 transform -translate-x-1/2 -translate-y-1/2 bg-transparent border-0 cursor-pointer"
            style={{ left: `${powerUp.x}%`, top: `${powerUp.y}%` }}
            onClick={() => collectPowerUp(powerUp)}
            aria-label={`Collect ${powerUp.type} power-up`}
          >
            <div className={`power-up ${powerUp.type === 'time' ? 'power-time' : 
                               powerUp.type === 'score' ? 'power-score' : 
                               powerUp.type === 'slowMotion' ? 'power-slow' : 
                               powerUp.type === 'magnet' ? 'power-magnet' : 'power-shield'}`}>
              {powerUp.type === 'time' ? '+5s' : 
               powerUp.type === 'score' ? '+3' :
               powerUp.type === 'slowMotion' ? '⏱️' :
               powerUp.type === 'magnet' ? '🧲' : '🛡️'}
            </div>
          </button>
        ))}
        
        {/* Particles */}
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              opacity: particle.opacity,
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}
        
        {/* Floating space debris based on difficulty */}
        {Array.from({ length: difficulty * 3 }).map((_, i) => (
          <FaStar 
            key={`star-${i}`} 
            className="absolute text-yellow-300 animate-spin-slow" 
            style={{ 
              left: `${Math.random() * 100}%`, 
              top: `${Math.random() * 100}%`, 
              fontSize: `${0.8 + Math.random() * 0.6}rem`,
              animationDuration: `${5 + Math.random() * 5}s`,
              opacity: 0.5 + Math.random() * 0.5
            }} 
          />
        ))}
        
        {Array.from({ length: difficulty * 2 }).map((_, i) => (
          <FaAsterisk 
            key={`asteroid-${i}`} 
            className="absolute text-gray-400 animate-float" 
            style={{ 
              left: `${Math.random() * 100}%`, 
              top: `${Math.random() * 100}%`, 
              fontSize: `${1 + Math.random() * 0.5}rem`,
              animationDuration: `${3 + Math.random() * 2}s`,
              opacity: 0.3 + Math.random() * 0.4
            }} 
          />
        ))}
      </div>
      
      <div className="flex justify-between">
        <p className="text-sm text-gray-400">
          {combo > 2 ? `${combo}x combo! Keep it going!` : 
           difficulty >= 7 ? "Teleporting astronaut! Be super quick!" :
           difficulty >= 5 ? "Expert level! Can you keep up?" :
           difficulty >= 3 ? "It's getting harder! Keep clicking!" : 
           "Click on the astronaut to score points!"}
        </p>
        <button onClick={onBackToMenu} className="text-sm text-blue-400 hover:text-blue-300">
          <FaArrowLeft className="inline mr-1" /> Back to Menu
        </button>
      </div>
    </div>
  );
};

// Game 3: Space Maze
const SpaceMazeGameLocal = ({ onGameOver, onBackToMenu }) => {
  const [position, setPosition] = useState({ x: 1, y: 1 });
  const [goal, setGoal] = useState({ x: 8, y: 8 });
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [maze, setMaze] = useState([]);
  const [powerUps, setPowerUps] = useState([]);
  const [mazeLevel, setMazeLevel] = useState(1);
  const [particles, setParticles] = useState([]);
  const [treasures, setTreasures] = useState([]);
  const [playerTrail, setPlayerTrail] = useState([]);
  const [fogOfWar, setFogOfWar] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const maxLevel = 5; // 5 total levels
  
  // Calculate maze size based on the level to ensure proper difficulty scaling
  const mazeSize = screenWidth < 768 
    ? 8 + Math.floor(mazeLevel / 2) // Smoother size increase for mobile
    : 10 + Math.floor(mazeLevel / 2); // Smoother size increase for desktop
  
  const visibility = 3;
  
  // Track screen size
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Generate maze on component mount and level change
  useEffect(() => {
    console.log(`Generating maze for level ${mazeLevel}`);
    generateMaze(mazeSize);
  }, [mazeLevel, mazeSize]);
  
  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      onGameOver(0);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onGameOver]);
  
  // Check win condition
  useEffect(() => {
    if (position.x === goal.x && position.y === goal.y) {
      // Create celebration particles
      createParticles(30, position.x, position.y, ['#FFD700', '#32CD32', '#1E90FF', '#FF6347']);
      
      const nextLevel = mazeLevel + 1;
      console.log(`Advancing to level ${nextLevel}`);
      
      // Level up or finish
      if (nextLevel <= maxLevel) {
        // Level up and create a new maze
        setMazeLevel(nextLevel);
        // Add more time for higher levels
        const bonusTime = 30 + (nextLevel * 5);
        setTimeLeft(prev => prev + bonusTime);
        // Show level up message
        const levelUpMsg = document.createElement('div');
        levelUpMsg.className = 'level-up-message';
        levelUpMsg.innerText = `Level ${nextLevel}!`;
        document.body.appendChild(levelUpMsg);
        setTimeout(() => {
          document.body.removeChild(levelUpMsg);
        }, 2000);
      } else {
        // Final score calculation - better score for fewer moves and more time left
        const score = Math.max(0, 100 + (treasures.length * 10) - Math.floor(moves/5) + (timeLeft));
        onGameOver(score);
      }
    }
  }, [position, goal, moves, timeLeft, mazeLevel, treasures.length, onGameOver, maxLevel]);
  
  // Add player trail
  useEffect(() => {
    if (position.x === 1 && position.y === 1) return; // Skip starting position
    
    setPlayerTrail(prev => {
      // Limit trail length
      const maxTrailLength = 10;
      const newTrail = [...prev, {...position, time: Date.now()}];
      return newTrail.slice(-maxTrailLength);
    });
  }, [position]);
  
  // Fade out trail over time
  useEffect(() => {
    if (playerTrail.length === 0) return;
    
    const trailTimeout = setTimeout(() => {
      const now = Date.now();
      setPlayerTrail(prev => prev.filter(pos => now - pos.time < 5000));
    }, 1000);
    
    return () => clearTimeout(trailTimeout);
  }, [playerTrail]);

  // Manage particles
  useEffect(() => {
    if (particles.length === 0) return;
    
    const updateParticles = () => {
      setParticles(prev => prev
        .map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          opacity: particle.opacity - 0.02,
          size: particle.size * 0.98
        }))
        .filter(particle => particle.opacity > 0)
      );
    };
    
    const interval = setInterval(updateParticles, 50);
    return () => clearInterval(interval);
  }, [particles]);
  
  // Create visual particles effect
  const createParticles = (count, x, y, colors) => {
    const cellSize = 100 / mazeSize;
    const screenX = x * cellSize + cellSize / 2;
    const screenY = y * cellSize + cellSize / 2;
    
    const newParticles = Array.from({ length: count }, () => ({
      id: Math.random().toString(36).substring(2, 9),
      x: screenX,
      y: screenY,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 6 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 1
    }));
    
    setParticles(prev => [...prev, ...newParticles]);
  };
  
  // Handle keyboard input with preventDefault
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          movePlayer(0, -1);
          e.preventDefault(); // Prevent scrolling
          break;
        case 'ArrowDown':
          movePlayer(0, 1);
          e.preventDefault(); // Prevent scrolling
          break;
        case 'ArrowLeft':
          movePlayer(-1, 0);
          e.preventDefault(); // Prevent scrolling
          break;
        case 'ArrowRight':
          movePlayer(1, 0);
          e.preventDefault(); // Prevent scrolling
          break;
        case 'm':
        case 'M':
          setShowMap(prev => !prev);
          e.preventDefault(); // Prevent any default behavior
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [position, maze]);
  
  // Move player function
  const movePlayer = (dx, dy) => {
    const newX = position.x + dx;
    const newY = position.y + dy;
    
    // Check if new position is within bounds and not a wall
    if (
      newX >= 0 && newX < mazeSize &&
      newY >= 0 && newY < mazeSize &&
      maze[newY] && maze[newY][newX] === 0
    ) {
      setPosition({ x: newX, y: newY });
      setMoves(prev => prev + 1);
      
      // Collect treasure if there is one
      const treasureIndex = treasures.findIndex(t => t.x === newX && t.y === newY);
      if (treasureIndex !== -1) {
        // Remove collected treasure
        setTreasures(prev => prev.filter((_, i) => i !== treasureIndex));
        
        // Create celebration particles
        createParticles(10, newX, newY, ['#FFD700', '#FFA500']);
      }
      
      // Collect power-up if there is one
      const powerUpIndex = powerUps.findIndex(p => p.x === newX && p.y === newY);
      if (powerUpIndex !== -1) {
        const powerUp = powerUps[powerUpIndex];
        
        // Apply power-up effect based on type
        switch (powerUp.type) {
          case 'map':
            setShowMap(true);
            setTimeout(() => setShowMap(false), 5000);
            break;
          case 'time':
            setTimeLeft(prev => prev + 10);
            break;
          default:
            break;
        }
        
        // Remove collected power-up
        setPowerUps(prev => prev.filter((_, i) => i !== powerUpIndex));
        
        // Create celebration particles
        createParticles(10, newX, newY, ['#1E90FF', '#00BFFF']);
      }
    }
  };
  
  // Generate maze with increasing complexity
  const generateMaze = (size) => {
    // Initialize maze with all walls
    const newMaze = Array(size).fill().map(() => Array(size).fill(1));
    
    // Create passages
    const carve = (x, y) => {
      newMaze[y][x] = 0;
      
      // Randomize directions
      const directions = [
        [0, -2], // North
        [2, 0],  // East
        [0, 2],  // South
        [-2, 0]  // West
      ].sort(() => Math.random() - 0.5);
      
      // Try each direction
      for (const [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;
        
        if (
          nx >= 0 && nx < size &&
          ny >= 0 && ny < size &&
          newMaze[ny][nx] === 1
        ) {
          // Carve passage
          newMaze[y + dy/2][x + dx/2] = 0;
          carve(nx, ny);
        }
      }
    };
    
    // Start position varies based on level
    const startX = 1;
    const startY = 1;
    carve(startX, startY);
    
    // Reset position to start
    setPosition({ x: startX, y: startY });
    setMoves(0); // Reset moves for each new level
    
    // Ensure goal is accessible and distant
    const potentialGoals = [];
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (
          newMaze[y][x] === 0 &&
          (x-startX)*(x-startX) + (y-startY)*(y-startY) > size*size/4
        ) {
          potentialGoals.push({ x, y });
        }
      }
    }
    
    if (potentialGoals.length > 0) {
      // Choose the farthest goal
      const goalPos = potentialGoals.reduce((farthest, current) => {
        const currentDist = (current.x-startX)*(current.x-startX) + (current.y-startY)*(current.y-startY);
        const farthestDist = (farthest.x-startX)*(farthest.x-startX) + (farthest.y-startY)*(farthest.y-startY);
        return currentDist > farthestDist ? current : farthest;
      });
      
      setGoal(goalPos);
    } else {
      // Fallback if no good goal found
      setGoal({ x: size-2, y: size-2 });
    }
    
    // Place treasures - more treasures at higher levels
    const newTreasures = [];
    const treasureCount = Math.floor(size/3) + (mazeLevel - 1);
    
    for (let i = 0; i < treasureCount; i++) {
      // Find random empty cell
      let treasureX, treasureY;
      do {
        treasureX = Math.floor(Math.random() * (size-2)) + 1;
        treasureY = Math.floor(Math.random() * (size-2)) + 1;
      } while (
        newMaze[treasureY][treasureX] !== 0 ||
        (treasureX === startX && treasureY === startY) ||
        (treasureX === goal.x && treasureY === goal.y) ||
        newTreasures.some(t => t.x === treasureX && t.y === treasureY)
      );
      
      newTreasures.push({ x: treasureX, y: treasureY });
    }
    
    setTreasures(newTreasures);
    
    // Place power-ups - more power-ups at higher levels
    const newPowerUps = [];
    const powerUpCount = Math.max(1, Math.floor(size/6)) + Math.floor(mazeLevel/2);
    
    for (let i = 0; i < powerUpCount; i++) {
      // Find random empty cell
      let powerUpX, powerUpY;
      do {
        powerUpX = Math.floor(Math.random() * (size-2)) + 1;
        powerUpY = Math.floor(Math.random() * (size-2)) + 1;
      } while (
        newMaze[powerUpY][powerUpX] !== 0 ||
        (powerUpX === startX && powerUpY === startY) ||
        (powerUpX === goal.x && powerUpY === goal.y) ||
        newTreasures.some(t => t.x === powerUpX && t.y === powerUpY) ||
        newPowerUps.some(p => p.x === powerUpX && p.y === powerUpY)
      );
      
      newPowerUps.push({ 
        x: powerUpX, 
        y: powerUpY, 
        type: Math.random() > 0.5 ? 'map' : 'time'
      });
    }
    
    setPowerUps(newPowerUps);
    
    // Enable fog of war for level 2 and up
    setFogOfWar(mazeLevel > 1);
    
    // Set initial fog visibility
    setMaze(newMaze);
    setPlayerTrail([]);
  };
  
  // Check if cell is visible with fog of war
  const isCellVisible = (x, y) => {
    if (!fogOfWar) return true;
    
    const distance = Math.sqrt(
      Math.pow(position.x - x, 2) + 
      Math.pow(position.y - y, 2)
    );
    
    return distance <= visibility;
  };
  
  // Use a different layout for desktop
  const isDesktop = screenWidth >= 768;
  
  const gameContent = (
    <div className="game-container space-y-4">
      <div className="flex flex-wrap justify-between items-center mb-2">
        <div>
          <div className="text-xl font-medium premium-gradient-text">Level: {mazeLevel}/{maxLevel}</div>
          <div className="text-sm text-gray-400">Moves: {moves}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-purple-400">
            {treasures.length} treasures remaining
          </div>
        </div>
        <div className="text-xl font-medium premium-gradient-text">Time: {timeLeft}s</div>
      </div>
      
      <div 
        className="bg-gray-900/70 rounded-xl relative overflow-hidden border border-indigo-800 p-4 mx-auto flex flex-col items-center justify-center"
        style={{ 
          width: "100%",
          maxWidth: isDesktop ? "500px" : "320px",
          height: isDesktop ? "360px" : "300px",
          boxShadow: '0 0 15px rgba(75, 0, 130, 0.5) inset'
        }}
      >
        {/* Maze */}
        <div className="relative w-full h-full flex items-center justify-center">
          <div 
            className="relative"
            style={{ 
              display: 'grid',
              gridTemplateColumns: `repeat(${mazeSize}, 1fr)`,
              gap: '1px',
              width: '90%',
              height: '80%',
              maxHeight: '80%'
            }}
          >
            {maze.map((row, y) => (
              row.map((cell, x) => {
                const isVisible = isCellVisible(x, y) || showMap;
                const isOnTrail = playerTrail.some(pos => pos.x === x && pos.y === y);
                const trailIndex = playerTrail.findIndex(pos => pos.x === x && pos.y === y);
                const trailOpacity = trailIndex !== -1 ? 
                  0.2 + ((trailIndex / playerTrail.length) * 0.8) : 0;
                
                return (
                  <div
                    key={`${x}-${y}`}
                    className={`
                      flex items-center justify-center transition-all duration-300
                      ${!isVisible ? 'bg-gray-900' : 
                        cell === 0 ? 'bg-gray-800 border border-indigo-900' : 
                        isOnTrail ? 'bg-blue-900' : 'bg-indigo-900/80'}
                      ${position.x === x && position.y === y ? 'bg-blue-500 z-10' : ''}
                      ${goal.x === x && goal.y === y ? 'bg-green-500' : ''}
                      ${isOnTrail ? `opacity-${Math.round(trailOpacity * 100)}` : ''}
                    `}
                    style={{
                      minWidth: '0',
                      minHeight: '0',
                      boxShadow: cell === 0 ? '0 0 5px rgba(79, 70, 229, 0.4) inset' : 
                                position.x === x && position.y === y ? '0 0 8px rgba(59, 130, 246, 0.8)' : 
                                goal.x === x && goal.y === y ? '0 0 8px rgba(34, 197, 94, 0.8)' : 
                                '0 0 3px rgba(0, 0, 0, 0.5)'
                    }}
                  >
                    {position.x === x && position.y === y && (
                      <FaRegCompass className="text-white animate-pulse text-xs" />
                    )}
                    {goal.x === x && goal.y === y && isVisible && (
                      <FaRocket className="text-white text-xs animate-pulse" />
                    )}
                    {treasures.some(t => t.x === x && t.y === y) && isVisible && (
                      <div className="text-yellow-300 animate-pulse text-xs" style={{
                        filter: 'drop-shadow(0 0 3px gold)'
                      }}>💎</div>
                    )}
                    {powerUps.some(p => p.x === x && p.y === y) && isVisible && (
                      <div className="text-blue-300 animate-pulse text-xs" style={{
                        filter: 'drop-shadow(0 0 3px cyan)'
                      }}>⚡</div>
                    )}
                  </div>
                );
              })
            ))}
            
            {/* Particles rendered over the maze */}
            {particles.map(particle => (
              <div
                key={particle.id}
                className="absolute rounded-full"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  backgroundColor: particle.color,
                  opacity: particle.opacity,
                  transform: 'translate(-50%, -50%)',
                  boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
                  zIndex: 20
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Controls for mobile and small screens only */}
        {!isDesktop && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="grid grid-cols-3 gap-1 md:gap-2">
              <div></div>
              <button 
                onClick={() => movePlayer(0, -1)}
                className="bg-indigo-700 hover:bg-indigo-600 w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center touch-manipulation shadow-lg"
              >
                <FaArrowUp className="text-white text-xs" />
              </button>
              <div></div>
              <button 
                onClick={() => movePlayer(-1, 0)}
                className="bg-indigo-700 hover:bg-indigo-600 w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center touch-manipulation shadow-lg"
              >
                <FaArrowLeft className="text-white text-xs" />
              </button>
              <button 
                onClick={() => setShowMap(prev => !prev)}
                className={`${showMap ? 'bg-blue-600' : 'bg-blue-700'} hover:bg-blue-600 w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center touch-manipulation shadow-lg transition-colors duration-300`}
                style={{ boxShadow: showMap ? '0 0 10px rgba(37, 99, 235, 0.8)' : 'none' }}
              >
                <span className="text-white text-xs">M</span>
              </button>
              <button 
                onClick={() => movePlayer(1, 0)}
                className="bg-indigo-700 hover:bg-indigo-600 w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center touch-manipulation shadow-lg"
              >
                <FaArrowRight className="text-white text-xs" />
              </button>
              <div></div>
              <button 
                onClick={() => movePlayer(0, 1)}
                className="bg-indigo-700 hover:bg-indigo-600 w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center touch-manipulation shadow-lg"
              >
                <FaArrowDown className="text-white text-xs" />
              </button>
              <div></div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-between text-xs md:text-sm">
        <p className="text-gray-400">
          {fogOfWar ? "Limited visibility! Press M for map" : "Navigate the maze to find your way back!"}
        </p>
        <button onClick={onBackToMenu} className="text-blue-400 hover:text-blue-300">
          <FaArrowLeft className="inline mr-1" /> Back to Menu
        </button>
      </div>
    </div>
  );

  // Desktop layout with side controls
  if (isDesktop) {
    return (
      <div className="flex space-x-4 items-start">
        {gameContent}
        <div className="mt-20">
          <div className="flex flex-col gap-3 items-center">
            <button 
              onClick={() => movePlayer(0, -1)}
              className="bg-indigo-700 hover:bg-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center shadow-lg"
            >
              <FaArrowUp className="text-white" />
            </button>
            <div className="flex gap-3">
              <button 
                onClick={() => movePlayer(-1, 0)}
                className="bg-indigo-700 hover:bg-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center shadow-lg"
              >
                <FaArrowLeft className="text-white" />
              </button>
              <button 
                onClick={() => setShowMap(prev => !prev)}
                className={`${showMap ? 'bg-blue-600' : 'bg-blue-700'} hover:bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center shadow-lg transition-colors duration-300`}
                style={{ boxShadow: showMap ? '0 0 10px rgba(37, 99, 235, 0.8)' : 'none' }}
              >
                <span className="text-white">M</span>
              </button>
              <button 
                onClick={() => movePlayer(1, 0)}
                className="bg-indigo-700 hover:bg-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center shadow-lg"
              >
                <FaArrowRight className="text-white" />
              </button>
            </div>
            <button 
              onClick={() => movePlayer(0, 1)}
              className="bg-indigo-700 hover:bg-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center shadow-lg"
            >
              <FaArrowDown className="text-white" />
            </button>
          </div>
          
          {/* Help text for controls */}
          <div className="mt-4 bg-gray-900/70 rounded-lg p-3 text-xs text-center">
            <p className="text-gray-300 mb-1">Keyboard Controls:</p>
            <p className="text-gray-400">Arrow Keys to move</p>
            <p className="text-gray-400 mt-1">M to toggle map</p>
          </div>
        </div>
      </div>
    );
  }

  // Return mobile layout
  return gameContent;
};

// Game 2: Spider Attack Game (modified from Asteroid Dodge)
const SpiderAttackGame = ({ onGameOver, onBackToMenu }) => {
  const [score, setScore] = useState(0);
  const [shipPosition, setShipPosition] = useState(50);
  const [gameOver, setGameOver] = useState(false);
  const [spiders, setSpiders] = useState([]);
  const [powerUps, setPowerUps] = useState([]);
  const [lives, setLives] = useState(5); // Increased starting lives
  const [shield, setShield] = useState(0);
  const [speedBoost, setSpeedBoost] = useState(0);
  const [level, setLevel] = useState(1);
  const [bullets, setBullets] = useState([]);
  const [canShoot, setCanShoot] = useState(true);
  const [particles, setParticles] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [movingLeft, setMovingLeft] = useState(false);
  const [movingRight, setMovingRight] = useState(false);
  const [gameActive, setGameActive] = useState(true);
  const gameAreaRef = useRef(null);
  const frameRef = useRef(0);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  
  // Track screen size
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      setScreenHeight(window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Game loop
  useEffect(() => {
    if (gameOver || isPaused) return;
    
    let lastTime = 0;
    const gameLoop = (timestamp) => {
      if (gameOver || isPaused) return;
      
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      
      frameRef.current++;
      
      // Create spiders - extremely reduced frequency
      if (frameRef.current % Math.max(800 - level * 15, 600) === 0) {
        // Only create a spider if there are fewer than 3 + level spiders
        if (spiders.length < 3 + Math.floor(level/2)) {
          createSpider();
        }
      }
      
      // Create power-ups (higher chance)
      if (Math.random() < 0.0001 * level) {
        createPowerUp();
      }
      
      // Move bullets
      setBullets(prev => 
        prev.filter(bullet => bullet.y > 0)
           .map(bullet => ({
             ...bullet,
             y: bullet.y - bullet.speed
           }))
      );
      
      // Move spiders - extremely slowed down movement
      setSpiders(prev => 
        prev.filter(spider => spider.y < 110)
           .map(spider => {
             // Spider movement pattern: zigzag toward player
             const moveTowardsPlayer = Math.random() < 0.2;
             let newX = spider.x;
             
             if (moveTowardsPlayer) {
               newX = spider.x + (shipPosition > spider.x ? 1 : -1) * spider.speed * 0.1;
             } else {
               newX = spider.x + Math.sin(timestamp * 0.0002 + spider.id) * spider.speed * 0.1;
             }
             
             return {
               ...spider,
               x: Math.max(0, Math.min(100, newX)),
               y: spider.y + spider.speed * 0.2, // Very slow vertical movement
               rotation: spider.rotation + spider.rotationSpeed * 0.2
             };
           })
      );
      
      // Move power-ups - very slowed down
      setPowerUps(prev => 
        prev.filter(powerUp => powerUp.y < 110)
           .map(powerUp => ({
             ...powerUp,
             y: powerUp.y + powerUp.speed * 0.2
           }))
      );
      
      // Decrease power-up durations
      if (frameRef.current % 60 === 0) {
        if (shield > 0) setShield(prev => prev - 1);
        if (speedBoost > 0) setSpeedBoost(prev => prev - 1);
      }
      
      // Increase level every 1000 points (much slower progression)
      if (score > 0 && score % 1000 === 0 && frameRef.current % 60 === 0) {
        setLevel(prev => Math.min(prev + 1, 10));
        
        // Create level-up effect
        createParticles(30, shipPosition, 90, ['#FFD700', '#FFA500', '#FF4500']);
      }
      
      requestAnimationFrame(gameLoop);
    };
    
    requestAnimationFrame(gameLoop);
    
    return () => {
      cancelAnimationFrame(gameLoop);
    };
  }, [gameOver, isPaused, shipPosition, level, score, spiders.length]);
  
  // Collision detection - make collisions more forgiving
  useEffect(() => {
    // Bullet-spider collisions - make bullets destroy on contact
    bullets.forEach((bullet, bulletIndex) => {
      spiders.forEach((spider, spiderIndex) => {
        const distance = Math.sqrt(
          Math.pow(bullet.x - spider.x, 2) + 
          Math.pow(bullet.y - spider.y, 2)
        );
        
        // Increased hit detection radius for more reliable hits
        if (distance < spider.size / 2 + 6) {
          // Remove bullet
          setBullets(prev => prev.filter((_, i) => i !== bulletIndex));
          
          // Create explosion effect
          createParticles(20, spider.x, spider.y, ['#FF4500', '#A52A2A', '#CD5C5C', '#FFD700']);
          
          // Award points
          setScore(prev => prev + spider.points);
          
          // 20% chance to spawn a power-up when spider is destroyed
          if (Math.random() < 0.2) {
            createPowerUp(spider.x, spider.y);
          }
          
          // Remove the spider immediately
          setSpiders(prev => prev.filter((_, i) => i !== spiderIndex));
          
          // Play destruction sound
          try {
            const audio = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//uQZAAP8AAAf4AAAAgAAA/wAAABAAAB/gAAACAAAD/AAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=');
            audio.volume = 0.3;
            audio.play();
          } catch (e) {
            // Ignore audio errors
          }
        }
      });
    });
    
    // Ship-spider collisions - make collision detection smaller
    if (!gameOver) {
      spiders.forEach((spider, spiderIndex) => {
        const distance = Math.sqrt(
          Math.pow(shipPosition - spider.x, 2) + 
          Math.pow(90 - spider.y, 2)
        );
        
        // Reduced collision radius (more forgiving)
        if (distance < spider.size / 2 + 3) {
          // Create explosion
          createParticles(20, spider.x, spider.y, ['#FF0000', '#FF4500', '#FFA500']);
          
          // Remove spider
          setSpiders(prev => prev.filter((_, i) => i !== spiderIndex));
          
          if (shield > 0) {
            // Shield absorbs the hit
            setShield(prev => prev - 1);
          } else {
            // Take damage
            setLives(prev => prev - 1);
            
            if (lives <= 1) {
              // Game over
              setGameOver(true);
              onGameOver(score);
            }
          }
        }
      });
    }
    
    // Ship-powerup collisions
    powerUps.forEach((powerUp, powerUpIndex) => {
      const distance = Math.sqrt(
        Math.pow(shipPosition - powerUp.x, 2) + 
        Math.pow(90 - powerUp.y, 2)
      );
      
      if (distance < 10) {
        // Collect power-up
        setPowerUps(prev => prev.filter((_, i) => i !== powerUpIndex));
        collectPowerUp(powerUp.type);
      }
    });
  }, [bullets, spiders, shipPosition, powerUps, shield, lives, gameOver, score, onGameOver]);
  
  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver || isPaused) return;
      
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setMovingLeft(true);
      }
      if (e.key === 'ArrowRight' || e.key === 'd') {
        setMovingRight(true);
      }
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') {
        shootBullet();
      }
      if (e.key === 'p') {
        setIsPaused(prev => !prev);
      }
    };
    
    const handleKeyUp = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setMovingLeft(false);
      }
      if (e.key === 'ArrowRight' || e.key === 'd') {
        setMovingRight(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameOver, isPaused]);
  
  // Process movement
  useEffect(() => {
    if (gameOver || isPaused) return;
    
    const processMovement = () => {
      if (movingLeft) {
        setShipPosition(prev => Math.max(prev - (speedBoost > 0 ? 2 : 1), 0));
      }
      if (movingRight) {
        setShipPosition(prev => Math.min(prev + (speedBoost > 0 ? 2 : 1), 100));
      }
      
      requestAnimationFrame(processMovement);
    };
    
    const movementFrame = requestAnimationFrame(processMovement);
    
    return () => {
      cancelAnimationFrame(movementFrame);
    };
  }, [movingLeft, movingRight, gameOver, isPaused, speedBoost]);
  
  // Create spider function - make spiders smaller and weaker
  const createSpider = () => {
    const size = 18 + Math.random() * (4 * Math.min(level, 2)); // Smaller spiders
    const speed = 0.03 + (level * 0.01) + Math.random() * 0.02; // Even slower speed
    const health = 1; // One-hit kill regardless of level
    const points = Math.ceil(size * 2);
    
    setSpiders(prev => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        x: Math.random() * 100,
        y: -10,
        size,
        speed,
        health,
        points,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 0.5, // Very slow rotation
        isHit: false
      }
    ]);
  };
  
  // Create power-up function
  const createPowerUp = (x = null, y = null) => {
    const types = ['shield', 'extraLife', 'speedBoost', 'rapidFire'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    setPowerUps(prev => [
      ...prev,
      {
        id: Date.now(),
        x: x !== null ? x : Math.random() * 100,
        y: y !== null ? y : -10,
        type,
        speed: 1
      }
    ]);
  };
  
  // Collect power-up function
  const collectPowerUp = (type) => {
    // Create effect particles based on power-up type
    const colorMap = {
      shield: ['#00FFFF', '#1E90FF'],
      extraLife: ['#FF69B4', '#FF1493'],
      speedBoost: ['#FFFF00', '#FFD700'],
      rapidFire: ['#7CFC00', '#32CD32']
    };
    
    createParticles(15, shipPosition, 90, colorMap[type] || ['#FFFFFF']);
    
    // Apply power-up effect
    switch (type) {
      case 'shield':
        setShield(prev => Math.min(prev + 3, 5));
        break;
      case 'extraLife':
        setLives(prev => Math.min(prev + 1, 5));
        break;
      case 'speedBoost':
        setSpeedBoost(5);
        break;
      case 'rapidFire':
        // Rapid fire for 5 seconds
        const interval = setInterval(() => {
          shootBullet(true);
        }, 200);
        
        setTimeout(() => {
          clearInterval(interval);
        }, 5000);
        break;
      default:
        break;
    }
    
    // Play power-up sound
    const audio = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//uQZAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAADAAAGhgBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2k5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk/////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAUAAAAAAAAGhpNRCFYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//vAZAAAAtoKRAgPSuAAAAA/wAAABHDDXJgJMhqpEAKsASZDVSAsViVRBP+LCYL/z5iWI6YlNkUVY9nTPEP9Q1nCwajSRMLBoZgZyTUybjmRmZOYnZuMzEzJzMzOzEbFYGDCY8WICJFWEpmRmZkeGfkyMzEzIzMjQzMzIzMzEzEREiRERGZmQnZmZmZ+ZmZmZmZmZmZmZmZmf/lZmZmZmZmZmZmZmZmR4ZmZmZmZkRE//lZmZmZmZmZmZmZmZmZmZmZmZmZ//kZmZmZMf/+TCdmQnZOZkZ2TmZGdmZyRVhKZkZmRCZQAUKBQoFCgUKBQoFCgUKBQoFCgUKBQoFCg');
    audio.volume = 0.3;
    audio.play();
  };
  
  // Shoot bullet function - make bullets faster and more powerful
  const shootBullet = (isRapidFire = false) => {
    if (!canShoot && !isRapidFire) return;
    
    setBullets(prev => [
      ...prev,
      {
        id: Date.now(),
        x: shipPosition,
        y: 90,
        speed: 5, // Much faster bullets
        size: 3 // Bigger bullets
      }
    ]);
    
    if (!isRapidFire) {
      setCanShoot(false);
      setTimeout(() => {
        setCanShoot(true);
      }, 200); // Faster fire rate
    }
    
    // Play shooting sound
    const audio = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//uQZAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAACzQCZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZ///////////////////////////////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAzbjyYDkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sQZAAP8AAAf4AAAAgAAA/wAAABAAAB/gAAACAAAD/AAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=');
    audio.volume = 0.2;
    audio.play();
  };
  
  // Create particles function
  const createParticles = (count, x, y, colors) => {
    const newParticles = [];
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2 + 0.5;
      newParticles.push({
        id: `particle-${Date.now()}-${i}`,
        x,
        y,
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 3 + 1,
        life: 30 + Math.random() * 20
      });
    }
    
    setParticles(prev => [...prev, ...newParticles]);
  };
  
  // Process particles
  useEffect(() => {
    if (particles.length === 0) return;
    
    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          x: particle.x + particle.velocityX,
          y: particle.y + particle.velocityY,
          life: particle.life - 1
        })).filter(particle => particle.life > 0)
      );
    }, 16);
    
    return () => clearInterval(interval);
  }, [particles]);
  
  // Handle mouse/touch movement
  const handleMouseMove = (e) => {
    if (gameAreaRef.current && !gameOver && !isPaused) {
      const rect = gameAreaRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      setShipPosition((x / rect.width) * 100);
    }
  };
  
  const handleTouchMove = (e) => {
    if (gameAreaRef.current && !gameOver && !isPaused) {
      const rect = gameAreaRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      setShipPosition((x / rect.width) * 100);
      
      // Prevent default to avoid scrolling
      e.preventDefault();
    }
  };
  
  // Handle click to shoot
  const handleClick = () => {
    if (!gameOver && !isPaused) {
      shootBullet();
    }
  };
  
  return (
    <div className="game-container space-y-4">
      <div className="flex justify-between items-center mb-2">
        <div>
          <div className="text-xl font-medium premium-gradient-text">Score: {score}</div>
          <div className="text-sm text-gray-400">Level: {level}</div>
        </div>
        <div className="flex">
          {Array.from({ length: lives }).map((_, i) => (
            <div key={i} className="text-red-500 mx-1">❤</div>
          ))}
        </div>
      </div>
      
      <div 
        ref={gameAreaRef}
        className="bg-gray-900/70 rounded-xl relative overflow-hidden border border-indigo-800 h-96 md:h-[420px] mx-auto"
        style={{ width: '100%', maxWidth: '600px' }}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onClick={handleClick}
      >
        {/* Background stars */}
        {Array.from({ length: 50 }).map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: `${Math.random() * 2 + 0.5}px`,
              height: `${Math.random() * 2 + 0.5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3
            }}
          />
        ))}
        
        {/* Player ship */}
        <div 
          className="absolute w-12 h-12 transform -translate-x-1/2"
          style={{ 
            left: `${shipPosition}%`, 
            bottom: '10%',
            transition: 'left 0.1s ease-out'
          }}
        >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 4L14 44H34L24 4Z" fill="#3B82F6" />
            <path d="M24 12L16 44H32L24 12Z" fill="#60A5FA" />
            <circle cx="24" cy="20" r="4" fill="#93C5FD" />
          </svg>
          
          {/* Shield effect */}
          {shield > 0 && (
            <div 
              className="absolute w-16 h-16 rounded-full border-2 border-cyan-400 -left-2 -top-2"
              style={{ 
                opacity: 0.5,
                boxShadow: '0 0 10px rgba(34, 211, 238, 0.7) inset, 0 0 15px rgba(34, 211, 238, 0.5)'
              }}
            />
          )}
        </div>
        
        {/* Spiders - enhanced visibility */}
        {spiders.map(spider => (
          <div 
            key={spider.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-colors duration-100 ${spider.isHit ? 'opacity-60' : ''}`}
            style={{ 
              left: `${spider.x}%`, 
              top: `${spider.y}%`,
              width: `${spider.size}px`,
              height: `${spider.size}px`,
              transform: `translate(-50%, -50%) rotate(${spider.rotation}deg)`,
              boxShadow: `0 0 ${spider.size/3}px rgba(165, 42, 42, 0.6)` // Add glow effect
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
              {/* Spider body */}
              <path d="M12 4C8.7 4 6 6.7 6 10C6 13.3 8.7 16 12 16C15.3 16 18 13.3 18 10C18 6.7 15.3 4 12 4Z" fill={spider.isHit ? "#FF6B6B" : "#A52A2A"} />
              {/* Highlighted outer glow */}
              <circle cx="12" cy="10" r="7" fill="none" stroke="#FF9800" strokeWidth="0.5" strokeOpacity="0.6" />
              {/* Spider legs - thicker and more visible */}
              <path d="M2 8L6 10M6 2L8 6M16 6L18 2M18 10L22 8M6 14L2 16M8 18L6 22M18 22L16 18M22 16L18 14" stroke="#8B4513" strokeWidth="2" strokeLinecap="round" />
              {/* Eyes - larger and more visible */}
              <circle cx="10" cy="8" r="1.2" fill="white" />
              <circle cx="14" cy="8" r="1.2" fill="white" />
              <circle cx="10" cy="8" r="0.5" fill="black" />
              <circle cx="14" cy="8" r="0.5" fill="black" />
            </svg>
          </div>
        ))}
        
        {/* Bullets - enhanced visibility */}
        {bullets.map(bullet => (
          <div 
            key={bullet.id}
            className="absolute bg-yellow-300 rounded-full transform -translate-x-1/2"
            style={{ 
              left: `${bullet.x}%`, 
              top: `${bullet.y}%`,
              width: `${bullet.size || 3}px`,
              height: `${(bullet.size || 3) * 2}px`,
              boxShadow: '0 0 8px #FCD34D'
            }}
          />
        ))}
        
        {/* Power-ups */}
        {powerUps.map(powerUp => (
          <div 
            key={powerUp.id}
            className="absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2"
            style={{ 
              left: `${powerUp.x}%`, 
              top: `${powerUp.y}%`,
              animation: 'pulse 1s infinite'
            }}
          >
            <div className={`w-full h-full rounded-full flex items-center justify-center
              ${powerUp.type === 'shield' ? 'bg-cyan-500' : 
                powerUp.type === 'extraLife' ? 'bg-pink-500' : 
                powerUp.type === 'speedBoost' ? 'bg-yellow-500' : 'bg-green-500'}`}
            >
              {powerUp.type === 'shield' && <span>🛡️</span>}
              {powerUp.type === 'extraLife' && <span>❤️</span>}
              {powerUp.type === 'speedBoost' && <span>⚡</span>}
              {powerUp.type === 'rapidFire' && <span>🔥</span>}
            </div>
          </div>
        ))}
        
        {/* Particles */}
        {particles.map(particle => (
          <div 
            key={particle.id}
            className="absolute rounded-full"
            style={{ 
              left: `${particle.x}%`, 
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              opacity: particle.life / 30
            }}
          />
        ))}
        
        {/* Game over overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-white mb-4">Game Over</div>
            <div className="text-xl text-gray-300 mb-6">Score: {score}</div>
            <button 
              onClick={onBackToMenu}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full"
            >
              Back to Menu
            </button>
          </div>
        )}
        
        {/* Pause overlay */}
        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-3xl font-bold text-white">PAUSED</div>
          </div>
        )}
      </div>
      
      <div className="flex justify-between text-xs md:text-sm">
        <p className="text-gray-400">
          Left/Right or mouse to move, Space or click to shoot
        </p>
        <button onClick={onBackToMenu} className="text-blue-400 hover:text-blue-300">
          <FaArrowLeft className="inline mr-1" /> Back to Menu
        </button>
      </div>
      
      {/* Mobile controls */}
      <div className="flex md:hidden justify-center gap-8 mt-2">
        <button 
          className="bg-gray-700 hover:bg-gray-600 w-16 h-16 rounded-full flex items-center justify-center touch-manipulation"
          onTouchStart={() => setMovingLeft(true)}
          onTouchEnd={() => setMovingLeft(false)}
        >
          <FaArrowLeft className="text-white text-2xl" />
        </button>
        
        <button 
          className="bg-blue-600 hover:bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center touch-manipulation"
          onTouchStart={shootBullet}
        >
          <span className="text-white text-2xl">🔥</span>
        </button>
        
        <button 
          className="bg-gray-700 hover:bg-gray-600 w-16 h-16 rounded-full flex items-center justify-center touch-manipulation"
          onTouchStart={() => setMovingRight(true)}
          onTouchEnd={() => setMovingRight(false)}
        >
          <FaArrowRight className="text-white text-2xl" />
        </button>
      </div>
      
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1) translate(-50%, -50%); }
          50% { transform: scale(1.1) translate(-45%, -45%); }
          100% { transform: scale(1) translate(-50%, -50%); }
        }
      `}</style>
    </div>
  );
};

const NotFound = () => {
  const [gameSelected, setGameSelected] = useState(null);
  const [gameScore, setGameScore] = useState(0);
  const [showGameOver, setShowGameOver] = useState(false);
  const [stars, setStars] = useState([]);

  // Generate random stars
  useEffect(() => {
    const newStars = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      blinking: Math.random() > 0.5,
    }));
    setStars(newStars);
  }, []);

  const handleGameOver = (score) => {
    setGameScore(score);
    setShowGameOver(true);
  };

  const backToMenu = () => {
    setGameSelected(null);
    setShowGameOver(false);
  };

  const startGame = (game) => {
    setGameSelected(game);
    setShowGameOver(false);
  };

  return (
    <SectionObserver>
      <section className="section-container relative overflow-hidden px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col justify-center">
        <AnimatedBackground color1="#ff386b" color2="#8b5cf6" density={0.00007} />
        
        {/* Stars background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {stars.map((star) => (
            <div 
              key={star.id}
              className={`absolute rounded-full bg-white ${star.blinking ? 'animate-pulse' : ''}`}
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: star.opacity,
              }}
            />
          ))}
        </div>
        
        <div className="z-10 relative mx-auto w-full max-w-7xl">
          <div className="premium-glass p-6 md:p-8 rounded-2xl backdrop-blur-xl">
            {/* Side-by-side layout for desktop */}
            <div className={`${gameSelected ? 'md:flex' : ''} gap-8`}>
              {/* Left Column - 404 and Description */}
              <div className={`${gameSelected ? 'md:w-1/3' : ''} text-center md:text-left space-y-4`}>
                <h1 className="text-6xl md:text-8xl font-bold mb-4 premium-gradient-text">404</h1>
                <h2 className="text-2xl md:text-3xl font-medium mb-2 md:mb-6 text-white">Page Lost in Space</h2>
                
                {!gameSelected && !showGameOver && (
                  <p className="text-gray-300 mb-6">
                    Looks like you've ventured into uncharted territory! The page you were looking for has drifted off into space.
                  </p>
                )}
                
                {gameSelected && !showGameOver && (
                  <div className="hidden md:block space-y-4">
                    <p className="text-gray-300">
                      {gameSelected === 'maze' ? "Navigate the maze to find your way back!" : 
                       gameSelected === 'astronaut' ? "Click on the astronaut to score points!" :
                       "Dodge asteroids and survive as long as possible!"}
                    </p>
                    
                    <div className="flex flex-col gap-3 mt-6">
                      <button onClick={backToMenu} className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
                        <FaArrowLeft className="inline" /> Back to Menu
                      </button>
                      <Link 
                        to="/" 
                        className="premium-button secondary flex items-center gap-2 md:mx-0"
                      >
                        <FaHome />
                        <span>Back to Home</span>
                      </Link>
                    </div>
                  </div>
                )}
                
                {!gameSelected && !showGameOver && (
                  <div className="text-xl font-medium text-white mb-4 mt-8 md:mt-6">Choose a Game</div>
                )}
                
                {/* Game options on desktop or when no game is selected */}
                {(!gameSelected || !showGameOver) && (
                  <div className={`grid grid-cols-1 ${!gameSelected ? 'sm:grid-cols-3' : 'md:grid-cols-1'} gap-4 mb-6`}>
                    {!gameSelected && (
                      <>
                        <div 
                          className="game-option p-4 rounded-xl border border-blue-500/20 hover:border-blue-500/50 hover:bg-blue-900/20 hover:scale-105 transition-all cursor-pointer"
                          onClick={() => startGame('astronaut')}
                        >
                          <div className="text-blue-400 text-3xl mb-3"><FaRocket /></div>
                          <h3 className="font-medium text-lg mb-2">Catch the Astronaut</h3>
                          <p className="text-sm text-gray-400">Click on the moving astronaut to score points!</p>
                        </div>
                        
                        <div 
                          className="game-option p-4 rounded-xl border border-orange-500/20 hover:border-orange-500/50 hover:bg-orange-900/20 hover:scale-105 transition-all cursor-pointer"
                          onClick={() => startGame('asteroid')}
                        >
                          <div className="text-orange-400 text-3xl mb-3"><FaMeteor /></div>
                          <h3 className="font-medium text-lg mb-2">Asteroid Dodge</h3>
                          <p className="text-sm text-gray-400">Avoid incoming asteroids with your spaceship!</p>
                        </div>
                        
                        <div 
                          className="game-option p-4 rounded-xl border border-green-500/20 hover:border-green-500/50 hover:bg-green-900/20 hover:scale-105 transition-all cursor-pointer"
                          onClick={() => startGame('maze')}
                        >
                          <div className="text-green-400 text-3xl mb-3"><FaRegCompass /></div>
                          <h3 className="font-medium text-lg mb-2">Space Maze</h3>
                          <p className="text-sm text-gray-400">Navigate through a space maze to find your way back!</p>
                        </div>
                      </>
                    )}
                  </div>
                )}
                
                {!gameSelected && !showGameOver && (
                  <div className="pt-4">
                    <Link 
                      to="/" 
                      className="premium-button secondary flex items-center gap-2 mx-auto md:mx-0"
                    >
                      <FaHome />
                      <span>Back to Home</span>
                    </Link>
                  </div>
                )}
              </div>
              
              {/* Right Column - Game Area */}
              {gameSelected && !showGameOver && (
                <div className="md:w-2/3">
                  {gameSelected === 'astronaut' && (
                    <AstronautGame 
                      onGameOver={handleGameOver}
                      onBackToMenu={backToMenu}
                    />
                  )}
                  
                  {gameSelected === 'asteroid' && (
                    <SpiderAttackGame 
                      onGameOver={handleGameOver}
                      onBackToMenu={backToMenu}
                    />
                  )}
                  
                  {gameSelected === 'maze' && (
                    <SpaceMazeGameLocal 
                      onGameOver={handleGameOver}
                      onBackToMenu={backToMenu}
                    />
                  )}
                  
                  {/* Mobile only back button */}
                  <div className="flex md:hidden justify-between mt-4">
                    <button onClick={backToMenu} className="text-sm text-blue-400 hover:text-blue-300">
                      <FaArrowLeft className="inline mr-1" /> Back to Menu
                    </button>
                  </div>
                </div>
              )}
              
              {/* Game Over Screen */}
              {showGameOver && (
                <div className="space-y-6 w-full">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-medium text-white">Game Over</h3>
                    <p className="text-xl premium-gradient-text">Your Score: {gameScore}</p>
                    <div className="mt-2 rating">
                      {Array.from({ length: Math.min(5, Math.ceil(gameScore / 20)) }).map((_, i) => (
                        <FaStar key={i} className="text-yellow-400 inline-block mx-1" />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-center gap-4 my-6">
                    <button 
                      onClick={() => {
                        setShowGameOver(false);
                      }}
                      className="premium-button primary flex items-center gap-2 hover:scale-105 transition-transform"
                    >
                      <FaRocket />
                      <span>Play Again</span>
                    </button>
                    
                    <button 
                      onClick={backToMenu}
                      className="premium-button secondary flex items-center gap-2 hover:scale-105 transition-transform"
                    >
                      <FaCrosshairs />
                      <span>Change Game</span>
                    </button>
                    
                    <Link 
                      to="/" 
                      className="premium-button secondary flex items-center gap-2 hover:scale-105 transition-transform"
                    >
                      <FaHome />
                      <span>Back to Home</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Game-specific CSS classes */}
        <style jsx>{`
          .astronaut {
            animation: float 2s ease-in-out infinite;
          }
          
          .astronaut-hard {
            animation: float-hard 1.2s ease-in-out infinite;
          }
          
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
          
          @keyframes float-hard {
            0% { transform: translateY(0px) translateX(0px) rotate(0deg); }
            25% { transform: translateY(-8px) translateX(5px) rotate(5deg); }
            50% { transform: translateY(0px) translateX(10px) rotate(0deg); }
            75% { transform: translateY(8px) translateX(5px) rotate(-5deg); }
            100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          }
          
          .power-up {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            animation: pulse 1s ease-in-out infinite;
          }
          
          .power-time {
            background: linear-gradient(45deg, #00ff00, #32cd32);
            box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
          }
          
          .power-score {
            background: linear-gradient(45deg, #ffd700, #ffa500);
            box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
          }
          
          .power-slow {
            background: linear-gradient(45deg, #9932cc, #8a2be2);
            box-shadow: 0 0 10px rgba(153, 50, 204, 0.5);
          }
          
          .power-magnet {
            background: linear-gradient(45deg, #ff6347, #dc143c);
            box-shadow: 0 0 10px rgba(255, 99, 71, 0.5);
          }
          
          .power-shield {
            background: linear-gradient(45deg, #1e90ff, #4169e1);
            box-shadow: 0 0 10px rgba(30, 144, 255, 0.5);
          }
          
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          
          .ship {
            transition: left 0.2s ease-out;
          }
          
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          
          .animate-spin-slow {
            animation: spin 10s linear infinite;
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .premium-button {
            transition: all 0.3s ease;
          }
          
          .premium-button:hover {
            box-shadow: 0 0 15px rgba(138, 43, 226, 0.5);
          }
          
          .rating {
            animation: rating-appear 1s ease-out;
          }
          
          @keyframes rating-appear {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
          }

          /* Make sure the game controls are visible in the side layout */
          @media (min-width: 768px) {
            .game-container {
              display: flex;
              flex-direction: column;
            }

            .maze-side-controls {
              padding-left: 20px;
            }
          }
          
          /* Level up message animation */
          .level-up-message {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #4f46e5, #8b5cf6);
            color: white;
            font-size: 2rem;
            font-weight: bold;
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            z-index: 100;
            animation: levelUp 2s ease-in-out;
            pointer-events: none;
          }
          
          @keyframes levelUp {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
            20% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
            80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
          }
        `}</style>
      </section>
    </SectionObserver>
  );
};

export default NotFound; 