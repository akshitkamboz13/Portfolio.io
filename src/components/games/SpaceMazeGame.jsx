import React, { useState, useEffect } from 'react';
import { FaRocket, FaRegCompass, FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const SpaceMazeGame = ({ onGameOver, onBackToMenu }) => {
  const [position, setPosition] = useState({ x: 1, y: 1 });
  const [goal, setGoal] = useState({ x: 8, y: 8 });
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [maze, setMaze] = useState([]);
  const mazeSize = 10;
  
  // Generate maze on component mount
  useEffect(() => {
    generateMaze(mazeSize);
  }, []);
  
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
      const score = Math.max(0, 100 - moves - (60 - timeLeft));
      onGameOver(score);
    }
  }, [position, goal, moves, timeLeft, onGameOver]);
  
  // Generate random maze
  const generateMaze = (size) => {
    // Simple maze generation - 1 is path, 0 is wall
    let newMaze = Array(size).fill().map(() => Array(size).fill(0));
    
    // Create outer walls
    for (let i = 0; i < size; i++) {
      newMaze[0][i] = 0;
      newMaze[size-1][i] = 0;
      newMaze[i][0] = 0;
      newMaze[i][size-1] = 0;
    }
    
    // Start with a grid full of walls
    for (let y = 1; y < size-1; y++) {
      for (let x = 1; x < size-1; x++) {
        newMaze[y][x] = Math.random() > 0.3 ? 1 : 0;
      }
    }
    
    // Ensure start and goal are open
    newMaze[1][1] = 1;
    newMaze[size-2][size-2] = 1;
    
    // Ensure there's a path from start to goal (simple version)
    for (let i = 1; i < size-2; i++) {
      newMaze[i][1] = 1;
      newMaze[size-2][i] = 1;
    }
    
    setMaze(newMaze);
    setPosition({ x: 1, y: 1 });
    setGoal({ x: size-2, y: size-2 });
  };
  
  const movePlayer = (dx, dy) => {
    const newX = position.x + dx;
    const newY = position.y + dy;
    
    // Check if the new position is valid (within bounds and not a wall)
    if (
      newX >= 0 && newX < mazeSize && 
      newY >= 0 && newY < mazeSize && 
      maze[newY][newX] === 1
    ) {
      setPosition({ x: newX, y: newY });
      setMoves(prev => prev + 1);
    }
  };
  
  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          movePlayer(0, -1);
          break;
        case 'ArrowDown':
          movePlayer(0, 1);
          break;
        case 'ArrowLeft':
          movePlayer(-1, 0);
          break;
        case 'ArrowRight':
          movePlayer(1, 0);
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [position, maze]);
  
  return (
    <div className="game-container space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="text-xl font-medium premium-gradient-text">Moves: {moves}</div>
        </div>
        <div className="text-xl font-medium premium-gradient-text">Time: {timeLeft}s</div>
      </div>
      
      <div className="bg-gray-900/50 rounded-xl w-full relative overflow-hidden border border-gray-800/50 p-4">
        {/* Maze */}
        <div className="grid place-items-center">
          <div 
            className="grid gap-0 mx-auto"
            style={{ 
              gridTemplateColumns: `repeat(${mazeSize}, 1fr)`,
              maxWidth: '350px'
            }}
          >
            {maze.map((row, y) => (
              row.map((cell, x) => (
                <div
                  key={`${x}-${y}`}
                  className={`
                    w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center
                    ${cell === 0 ? 'bg-gray-800' : 'bg-gray-700/50'}
                    ${position.x === x && position.y === y ? 'bg-blue-500' : ''}
                    ${goal.x === x && goal.y === y ? 'bg-green-500' : ''}
                  `}
                >
                  {position.x === x && position.y === y && (
                    <FaRegCompass className="text-white animate-pulse" />
                  )}
                  {goal.x === x && goal.y === y && (
                    <FaRocket className="text-white" />
                  )}
                </div>
              ))
            ))}
          </div>
        </div>
        
        {/* Controls for mobile */}
        <div className="mt-6 flex justify-center gap-2">
          <div className="grid grid-cols-3 gap-2">
            <div></div>
            <button 
              onClick={() => movePlayer(0, -1)}
              className="bg-gray-700 hover:bg-gray-600 w-10 h-10 rounded-lg flex items-center justify-center"
            >
              <FaArrowUp />
            </button>
            <div></div>
            <button 
              onClick={() => movePlayer(-1, 0)}
              className="bg-gray-700 hover:bg-gray-600 w-10 h-10 rounded-lg flex items-center justify-center"
            >
              <FaArrowLeft />
            </button>
            <div></div>
            <button 
              onClick={() => movePlayer(1, 0)}
              className="bg-gray-700 hover:bg-gray-600 w-10 h-10 rounded-lg flex items-center justify-center"
            >
              <FaArrowRight />
            </button>
            <div></div>
            <button 
              onClick={() => movePlayer(0, 1)}
              className="bg-gray-700 hover:bg-gray-600 w-10 h-10 rounded-lg flex items-center justify-center"
            >
              <FaArrowDown />
            </button>
            <div></div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <p className="text-sm text-gray-400">Navigate the maze to find your way back!</p>
        <button onClick={onBackToMenu} className="text-sm text-blue-400 hover:text-blue-300">
          <FaArrowLeft className="inline mr-1" /> Back to Menu
        </button>
      </div>
    </div>
  );
};

export default SpaceMazeGame; 