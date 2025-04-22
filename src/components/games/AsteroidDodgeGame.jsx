import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaRocket, FaMeteor, FaArrowLeft, FaShieldAlt, FaBolt, FaClock, FaHeart } from 'react-icons/fa';

const AsteroidDodgeGame = ({ onGameOver, onBackToMenu }) => {
  const [score, setScore] = useState(0);
  const [shipPosition, setShipPosition] = useState(50);
  const [gameOver, setGameOver] = useState(false);
  const [asteroids, setAsteroids] = useState([]);
  const [powerUps, setPowerUps] = useState([]);
  const [lives, setLives] = useState(3);
  const [shield, setShield] = useState(0);
  const [speedBoost, setSpeedBoost] = useState(0);
  const [slowMotion, setSlowMotion] = useState(0);
  const [difficulty, setDifficulty] = useState(1);
  const [bullets, setBullets] = useState([]);
  const [canShoot, setCanShoot] = useState(true);
  const [particles, setParticles] = useState([]);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [isPaused, setIsPaused] = useState(false);
  const [invincible, setInvincible] = useState(false);
  const [shieldFlash, setShieldFlash] = useState(false);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [comboTimer, setComboTimer] = useState(0);
  const [movingLeft, setMovingLeft] = useState(false);
  const [movingRight, setMovingRight] = useState(false);
  const [shieldFlashTimer, setShieldFlashTimer] = useState(0);
  const [gameActive, setGameActive] = useState(true);
  const [level, setLevel] = useState(1);
  const [invincibilityTimer, setInvincibilityTimer] = useState(0);
  
  const gameAreaRef = useRef(null);
  const requestRef = useRef();
  const lastAsteroidTimeRef = useRef(0);
  const lastPowerUpTimeRef = useRef(0);
  const frameCountRef = useRef(0);
  const bulletTimeoutRef = useRef(null);
  const invincibilityTimeoutRef = useRef(null);
  const shieldFlashTimeoutRef = useRef(null);
  
  // Track screen size
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Increase difficulty over time
  useEffect(() => {
    if (gameOver) return;
    
    const difficultyInterval = setInterval(() => {
      setDifficulty(prev => Math.min(prev + 0.5, 10));
    }, 10000); // Increase difficulty every 10 seconds
    
    return () => clearInterval(difficultyInterval);
  }, [gameOver]);
  
  // Set up game loop
  useEffect(() => {
    if (gameOver || isPaused) return;
    
    const gameLoop = () => {
      // Move ship based on keyboard state
      if (movingLeft) {
        setShipPosition(prev => Math.max(prev - (speedBoost > 0 ? 2.5 : 1.5), 0));
      }
      if (movingRight) {
        setShipPosition(prev => Math.min(prev + (speedBoost > 0 ? 2.5 : 1.5), 100));
      }
      
      // Update bullets
      setBullets(prevBullets => {
        return prevBullets.map(bullet => ({
          ...bullet,
          y: bullet.y - (speedBoost > 0 ? 2.5 : 1.5)
        })).filter(bullet => bullet.y > 0);
      });
      
      // Spawn asteroids
      if (frameCountRef.current % (difficulty === 'hard' ? 30 : difficulty === 'medium' ? 45 : 60) === 0) {
        const newAsteroid = createAsteroid();
        
        // Smart placement - avoid spawning directly above the player at higher difficulties
        if (difficulty === 'hard' || difficulty === 'medium') {
          const playerZone = { min: shipPosition - 15, max: shipPosition + 15 };
          if (newAsteroid.x > playerZone.min && newAsteroid.x < playerZone.max) {
            newAsteroid.x = Math.random() > 0.5 ? 
              playerZone.min - Math.random() * 10 : 
              playerZone.max + Math.random() * 10;
          }
        }
        
        setAsteroids(prev => [...prev, newAsteroid]);
      }
      
      // Create power-ups
      if (frameCountRef.current % 300 === 0) {
        // Increase chance based on difficulty
        const powerUpChance = difficulty === 'easy' ? 0.5 : difficulty === 'medium' ? 0.65 : 0.8;
        if (Math.random() < powerUpChance) {
          const powerUpType = getRandomPowerUpType();
          setPowerUps(prev => [...prev, createPowerUp(powerUpType)]);
        }
      }
      
      // Update combo timer
      if (comboTimer > 0) {
        setComboTimer(prev => prev - 1);
      } else if (comboMultiplier > 1) {
        setComboMultiplier(1); // Reset combo when timer expires
      }
      
      // Update particles
      setParticles(prevParticles => {
        // Update particle positions and lifetimes
        return prevParticles
          .map(particle => ({
            ...particle,
            x: particle.x + particle.velocityX,
            y: particle.y + particle.velocityY,
            lifetime: particle.lifetime - 1,
            opacity: particle.lifetime / particle.initialLifetime
          }))
          .filter(particle => particle.lifetime > 0);
      });
      
      // Update power-up timers
      if (frameCountRef.current % 60 === 0) {
        if (shield > 0) setShield(prev => prev - 1);
        if (speedBoost > 0) setSpeedBoost(prev => prev - 1);
        if (slowMotion > 0) setSlowMotion(prev => prev - 1);
        if (shieldFlash) setShieldFlash(false);
      }
      
      frameCountRef.current++;
      requestRef.current = requestAnimationFrame(gameLoop);
    };
    
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameOver, isPaused, movingLeft, movingRight, speedBoost, difficulty, shipPosition, shieldFlash]);
  
  // Add keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Game animation loop
    let animationId;
    let frameCount = 0;
    
    const animate = () => {
      if (gameOver || isPaused) {
        cancelAnimationFrame(animationId);
        return;
      }
      
      frameCount++;
      
      // Move ship based on input
      if (movingLeft) {
        setShipPosition(prev => Math.max(prev - 4, 15));
      }
      if (movingRight) {
        setShipPosition(prev => Math.min(prev + 4, screenWidth - 15));
      }
      
      // Update bullets
      setBullets(prev => 
        prev.filter(bullet => bullet.y > 0)
           .map(bullet => ({
             ...bullet,
             y: bullet.y - 1
           }))
      );
      
      // Spawn asteroids randomly
      if (frameCount % Math.floor(60 / difficulty) === 0) {
        const newAsteroid = {
          id: Date.now(),
          x: Math.random() * (screenWidth - 20) + 10,
          y: -10,
          size: Math.random() * 5 + 5,
          speed: Math.random() * 1 + difficulty * 0.5
        };
        setAsteroids(prev => [...prev, newAsteroid]);
      }
      
      // Move asteroids
      setAsteroids(prev => 
        prev.filter(asteroid => asteroid.y < 110)
           .map(asteroid => ({
             ...asteroid,
             y: asteroid.y + asteroid.speed
           }))
      );
      
      // Random power-up spawn (1% chance per second at 60fps)
      if (Math.random() < 0.00016 * difficulty) {
        const powerUpTypes = ['shield', 'extraLife', 'rapidFire'];
        const newPowerUp = {
          id: Date.now(),
          type: powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)],
          x: Math.random() * (screenWidth - 20) + 10,
          y: -10,
          speed: 1
        };
        setPowerUps(prev => [...prev, newPowerUp]);
      }
      
      // Move power-ups
      setPowerUps(prev => 
        prev.filter(powerUp => powerUp.y < 110)
           .map(powerUp => ({
             ...powerUp,
             y: powerUp.y + powerUp.speed
           }))
      );
      
      // Update combo timer
      if (comboTimer > 0) {
        setComboTimer(prev => prev - 1);
      } else if (comboMultiplier > 1) {
        setComboMultiplier(1);
      }
      
      // Shield flash effect
      if (shieldFlash) {
        setTimeout(() => {
          setShieldFlash(false);
        }, 300);
      }
      
      // Update particles
      setParticles(prev => 
        prev.filter(particle => particle.lifetime > 0)
           .map(particle => ({
             ...particle,
             x: particle.x + particle.velocityX,
             y: particle.y + particle.velocityY,
             lifetime: particle.lifetime - 1,
             velocityY: particle.velocityY + 0.03 // Add gravity to particles
           }))
      );
      
      // Slowly increase difficulty over time
      if (frameCount % 600 === 0) { // Every 10 seconds
        setDifficulty(prev => Math.min(prev + 0.1, 4));
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationId);
    };
  }, [gameOver, isPaused, movingLeft, movingRight, screenWidth, difficulty]);
  
  // Collect power-up effect
  const collectPowerUp = (type) => {
    switch (type) {
      case 'shield':
        setShield(prev => Math.min(prev + 1, 3)); // Max 3 shields
        break;
      case 'extraLife':
        setLives(prev => Math.min(prev + 1, 5)); // Max 5 lives
        break;
      case 'rapidFire':
        setCanShoot(true);
        // Give rapid fire for 5 seconds
        const originalShootCooldown = 300;
        const rapidFireInterval = setInterval(() => {
          const newBullet = {
            id: Date.now() + Math.random(),
            x: shipPosition,
            y: 90,
            speed: 3
          };
          setBullets(prev => [...prev, newBullet]);
        }, 150);
        
        setTimeout(() => {
          clearInterval(rapidFireInterval);
        }, 5000);
        break;
      default:
        break;
    }
    
    // Reset combo timer and boost combo
    setComboTimer(120);
    setComboMultiplier(prev => Math.min(prev + 0.2, 5));
    
    // Play power-up sound
    const audio = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//uQZAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAADAAAGhgBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2k5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk/////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAUAAAAAAAAGhpNRCFYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    audio.play();
  };
  
  // Fire a bullet
  const shootBullet = () => {
    if (!canShoot || gameOver || isPaused) return;
    
    setBullets(prev => [
      ...prev,
      {
        id: Date.now(),
        x: shipPosition,
        y: 80,
        speed: 4
      }
    ]);
    
    setCanShoot(false);
    
    // Reload time (faster if speed boost is active)
    const reloadTime = speedBoost > 0 ? 150 : 350; // Faster reload time (was 200/400)
    bulletTimeoutRef.current = setTimeout(() => {
      setCanShoot(true);
    }, reloadTime);
    
    // Play shooting sound
    const audio = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//uQZAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAACzQCZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZ///////////////////////////////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAzbjyYDkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//sQZAAP8AAAf4AAAAgAAA/wAAABAAAB/gAAACAAAD/AAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=');
    audio.volume = 0.3;
    audio.play();
  };
  
  // Handle ship movement
  const moveShip = (e) => {
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
      
      // Prevent default touch behavior to avoid scrolling
      e.preventDefault();
    }
  };
  
  // Handle keyboard input
  const handleKeyDown = (e) => {
    if (gameOver || isPaused) return;
    
    // Prevent default behavior for game keys
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
      e.preventDefault();
    }
    
    if (e.key === 'ArrowLeft') {
      setMovingLeft(true);
    }
    if (e.key === 'ArrowRight') {
      setMovingRight(true);
    }
    if (e.key === ' ' && canShoot) {
      // Fire bullet
      const newBullet = {
        id: Date.now(),
        x: shipPosition,
        y: 90,
        speed: 2.5
      };
      setBullets(prev => [...prev, newBullet]);
      setCanShoot(false);
      
      // Reset shoot cooldown
      setTimeout(() => {
        setCanShoot(true);
      }, 300);
    }
    if (e.key === 'p') {
      setIsPaused(prev => !prev);
    }
  };
  
  const handleKeyUp = (e) => {
    if (e.key === 'ArrowLeft') {
      setMovingLeft(false);
    }
    if (e.key === 'ArrowRight') {
      setMovingRight(false);
    }
  };
  
  // Calculate game area dimensions based on screen size
  const gameHeight = screenWidth < 768 ? '300px' : screenWidth < 1024 ? '350px' : '400px';
  const gameWidth = screenWidth < 768 ? '100%' : '100%';

  // Collision detection effect
  useEffect(() => {
    // Check bullet-asteroid collisions
    bullets.forEach(bullet => {
      asteroids.forEach(asteroid => {
        const dx = bullet.x - asteroid.x;
        const dy = bullet.y - asteroid.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < asteroid.size + 2) { // Bullet radius is 2
          // Remove this bullet and asteroid
          setBullets(prev => prev.filter(b => b.id !== bullet.id));
          setAsteroids(prev => prev.filter(a => a.id !== asteroid.id));
          
          // Create explosion particles
          const particleCount = Math.floor(asteroid.size * 2);
          const newParticles = [];
          
          for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 2 + 0.5;
            newParticles.push({
              id: `particle-${Date.now()}-${i}`,
              x: asteroid.x,
              y: asteroid.y,
              velocityX: Math.cos(angle) * speed,
              velocityY: Math.sin(angle) * speed,
              color: '#FFD700',
              size: Math.random() * 2 + 0.5,
              lifetime: Math.floor(Math.random() * 20) + 10
            });
          }
          
          setParticles(prev => [...prev, ...newParticles]);
          
          // Update score
          setScore(prev => prev + Math.floor(10 * asteroid.size * comboMultiplier));
          
          // Update combo
          setComboMultiplier(prev => Math.min(prev + 0.1, 3.0));
          setComboTimer(120); // 2 seconds at 60fps
        }
      });
    });
    
    // Check ship-asteroid collisions
    asteroids.forEach((asteroid, asteroidIndex) => {
      const distance = Math.sqrt(
        Math.pow(shipPosition - asteroid.x, 2) + 
        Math.pow(90 - asteroid.y, 2)
      );
      
      if (distance < 15 && !invincible) { // Ship radius + asteroid radius
        setAsteroids(prev => prev.filter((_, i) => i !== asteroidIndex));
        
        // Create explosion
        createExplosionParticles(asteroid.x, asteroid.y);
        
        if (shield > 0) {
          // Shield absorbs the hit
          setShield(prev => prev - 1);
          setShieldFlash(true);
          // Short invincibility after shield hit
          setInvincible(true);
          setTimeout(() => setInvincible(false), 500);
        } else {
          // Ship takes damage
          setLives(prev => prev - 1);
          setInvincible(true);
          setTimeout(() => setInvincible(false), 2000);
          
          // Reset combo when player gets hit
          setComboMultiplier(1);
        }
      }
    });
    
    // Check ship-powerup collisions
    powerUps.forEach(powerUp => {
      const dx = shipPosition - powerUp.x;
      const dy = 90 - powerUp.y; // Ship is at y=90
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 10) { // PowerUp + ship radius
        // Remove this powerup
        setPowerUps(prev => prev.filter(p => p.id !== powerUp.id));
        
        // Apply power-up effect
        collectPowerUp(powerUp.type);
        
        // Create collection particles
        const particleCount = 15;
        const newParticles = [];
        
        for (let i = 0; i < particleCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 1.5 + 0.5;
          newParticles.push({
            id: `particle-${Date.now()}-${i}`,
            x: powerUp.x,
            y: powerUp.y,
            velocityX: Math.cos(angle) * speed,
            velocityY: Math.sin(angle) * speed,
            color: powerUp.type === 'shield' ? '#00FFFF' : 
                   powerUp.type === 'extraLife' ? '#FF00FF' :
                   '#00FF00', // rapidFire
            size: Math.random() * 2 + 1,
            lifetime: Math.floor(Math.random() * 20) + 10
          });
        }
        
        setParticles(prev => [...prev, ...newParticles]);
      }
    });
  }, [bullets, asteroids, shipPosition, invincible, shield, lives, powerUps, comboMultiplier]);

  // Update shield flash effect
  useEffect(() => {
    if (shieldFlash) {
      setShieldFlashTimer(20); // Flash for 20 frames
      setShieldFlash(false);
    }
    
    if (shieldFlashTimer > 0) {
      const timer = setTimeout(() => {
        setShieldFlashTimer(prev => prev - 1);
      }, 16); // ~60fps
      
      return () => clearTimeout(timer);
    }
  }, [shieldFlash, shieldFlashTimer]);

  // Add this function near the other utility functions
  const getAsteroidColor = (size) => {
    // Different colors based on asteroid size
    if (size > 50) return '#a17c65'; // Large brown
    if (size > 30) return '#8c7b72'; // Medium gray-brown
    return '#6d6d6d';  // Small gray
  };

  // Update the createAsteroid function
  const createAsteroid = (position = null) => {
    const size = 20 + Math.random() * 40;
    const speed = 1 + Math.random() * (3 - size/25);
    
    let x, y;
    if (position) {
      x = position.x;
      y = position.y;
    } else {
      // Spawn from a random edge
      const side = Math.floor(Math.random() * 4);
      if (side === 0) { // Top
        x = Math.random() * gameWidth;
        y = -size;
      } else if (side === 1) { // Right
        x = gameWidth + size;
        y = Math.random() * gameHeight;
      } else if (side === 2) { // Bottom
        x = Math.random() * gameWidth;
        y = gameHeight + size;
      } else { // Left
        x = -size;
        y = Math.random() * gameHeight;
      }
    }
    
    // Calculate direction toward a random point near the center
    const targetX = gameWidth/2 + (Math.random() - 0.5) * gameWidth/2;
    const targetY = gameHeight/2 + (Math.random() - 0.5) * gameHeight/2;
    
    const dx = targetX - x;
    const dy = targetY - y;
    const mag = Math.sqrt(dx * dx + dy * dy);
    
    return {
      id: Date.now() + Math.random(),
      x,
      y,
      size,
      speed,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 5,
      vx: (dx / mag) * speed,
      vy: (dy / mag) * speed,
      health: Math.random() < 0.2 ? 2 : 1, // 20% chance for stronger asteroid
      color: getAsteroidColor(size),
    };
  };

  const update = useCallback(() => {
    if (!gameActive) return;
    
    // Move ship based on input
    if (movingLeft) {
      setShipPosition(prev => Math.max(prev - (speedBoost > 0 ? 2.5 : 1.5), 0));
    }
    if (movingRight) {
      setShipPosition(prev => Math.min(prev + (speedBoost > 0 ? 2.5 : 1.5), 100));
    }
    
    // Invincibility effect
    if (invincible) {
      setInvincibilityTimer(prev => Math.max(prev - 1, 0));
      if (invincibilityTimer <= 0) {
        setInvincible(false);
      }
    }
    
    // Shield flash effect
    if (shieldFlash) {
      setShieldFlashTimer(prev => prev - 1);
      if (shieldFlashTimer <= 0) {
        setShieldFlash(false);
      }
    }
    
    // Update ship position
    setShipPosition({ x: shipPosition, y: 90 });
    
    // Move asteroids
    const updatedAsteroids = asteroids.map(asteroid => {
      // Apply rotation
      const newRotation = (asteroid.rotation + asteroid.rotationSpeed) % 360;
      
      return {
        ...asteroid,
        x: asteroid.x + asteroid.vx,
        y: asteroid.y + asteroid.vy,
        rotation: newRotation
      };
    }).filter(asteroid => {
      // Remove asteroids that are off-screen with a buffer
      const buffer = asteroid.size * 2;
      return asteroid.x > -buffer && 
             asteroid.x < gameWidth + buffer && 
             asteroid.y > -buffer && 
             asteroid.y < gameHeight + buffer;
    });
    
    // Handle collisions
    let newLives = lives;
    let playerHit = false;
    
    if (!invincible) {
      const shipCenterX = shipPosition + 5; // Assuming ship size is 10
      const shipCenterY = 90; // Assuming ship is at y=90
      const hitRadius = 5; // Assuming hit radius is 5
      
      updatedAsteroids.forEach(asteroid => {
        const dx = asteroid.x - shipCenterX;
        const dy = asteroid.y - shipCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < hitRadius + asteroid.size / 2) {
          // Collision detected
          playerHit = true;
          
          // Create explosion particles
          for (let i = 0; i < 15; i++) {
            particles.push({
              x: shipCenterX + (Math.random() - 0.5) * 20,
              y: shipCenterY + (Math.random() - 0.5) * 20,
              vx: (Math.random() - 0.5) * 5,
              vy: (Math.random() - 0.5) * 5,
              life: 30 + Math.random() * 20,
              color: shield > 0 ? '#64b5f6' : '#ff6b6b',
              size: 2 + Math.random() * 3,
            });
          }
          
          // Handle shield or life loss
          if (shield > 0) {
            setShield(prev => prev - 1);
            setShieldFlash(true);
            setShieldFlashTimer(10);
          } else {
            newLives -= 1;
            if (newLives <= 0) {
              setGameOver(true);
              setGameActive(false);
            } else {
              // Set invincibility after being hit
              setInvincible(true);
              setInvincibilityTimer(90); // 1.5 seconds at 60fps
            }
          }
          
          // Only process one collision per frame for better gameplay
          return;
        }
      });
    }
    
    // Update particles
    const updatedParticles = particles
      .map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        life: particle.life - 1,
      }))
      .filter(particle => particle.life > 0);
    
    // Spawn new asteroid if needed
    if (updatedAsteroids.length < difficulty + 2 && Math.random() < 0.03) {
      updatedAsteroids.push(createAsteroid());
    }
    
    // Power-up spawning logic
    if (Math.random() < 0.001 && powerUps.length < 2) {
      // Random position with buffer from edges
      const buffer = 40;
      const x = buffer + Math.random() * (gameWidth - 2 * buffer);
      const y = buffer + Math.random() * (gameHeight - 2 * buffer);
      
      powerUps.push({
        id: Date.now(),
        x,
        y,
        type: Math.random() < 0.7 ? 'shield' : 'life', // 70% shields, 30% lives
        size: 20,
        rotation: 0,
        rotationSpeed: 1,
      });
    }
    
    // Update power-ups
    const updatedPowerUps = powerUps.map(powerUp => ({
      ...powerUp,
      rotation: (powerUp.rotation + powerUp.rotationSpeed) % 360
    }));
    
    // Check for power-up collection
    const collidedPowerUps = updatedPowerUps.filter(powerUp => {
      const dx = (powerUp.x + powerUp.size / 2) - (shipPosition + 5);
      const dy = (powerUp.y + powerUp.size / 2) - 90;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < (powerUp.size / 2 + 5);
    });
    
    collidedPowerUps.forEach(powerUp => {
      if (powerUp.type === 'shield') {
        setShield(prev => Math.min(prev + 1, 3));
      } else if (powerUp.type === 'life') {
        newLives = Math.min(5, lives + 1);
      }
      
      // Create collection effect particles
      for (let i = 0; i < 10; i++) {
        particles.push({
          x: powerUp.x,
          y: powerUp.y,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
          life: 20 + Math.random() * 15,
          color: powerUp.type === 'shield' ? '#64b5f6' : '#ff6b6b',
          size: 2 + Math.random() * 2,
        });
      }
    });
    
    // Filter out collected power-ups
    const remainingPowerUps = updatedPowerUps.filter(
      powerUp => !collidedPowerUps.some(p => p.id === powerUp.id)
    );
    
    // Update score based on time
    const newScore = score + 1;
    if (newScore % 500 === 0) {
      setLevel(prev => prev + 1);
    }
    
    // Update state with all new values
    setAsteroids(updatedAsteroids);
    setParticles(updatedParticles);
    setPowerUps(remainingPowerUps);
    setLives(newLives);
    setScore(newScore);
  }, [gameActive, movingLeft, movingRight, speedBoost, difficulty, shipPosition, shield, lives, score, powerUps, particles]);

  return (
    <div className="game-container space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="text-xl font-medium premium-gradient-text">Score: {score}</div>
          <div className="text-sm text-gray-400">Level: {level}</div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            {Array.from({ length: lives }).map((_, i) => (
              <FaHeart key={i} className="text-red-500" />
            ))}
          </div>
          {comboMultiplier > 1 && (
            <div className="text-sm text-yellow-400 font-medium mt-1">
              {comboMultiplier.toFixed(1)}x Combo!
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-end">
          {shield > 0 && (
            <div className="flex items-center text-blue-400">
              <FaShieldAlt className="mr-1" />
              <span className="text-sm">{shield}s</span>
            </div>
          )}
          {speedBoost > 0 && (
            <div className="flex items-center text-red-400">
              <FaBolt className="mr-1" />
              <span className="text-sm">{speedBoost}s</span>
            </div>
          )}
          {slowMotion > 0 && (
            <div className="flex items-center text-purple-400">
              <FaClock className="mr-1" />
              <span className="text-sm">{slowMotion}s</span>
            </div>
          )}
        </div>
      </div>
      
      <div 
        ref={gameAreaRef} 
        className="bg-gray-900/50 rounded-xl relative overflow-hidden border border-gray-800/50 mx-auto"
        style={{ 
          width: gameWidth, 
          height: gameHeight
        }}
        onMouseMove={moveShip}
        onTouchMove={handleTouchMove}
        onClick={shootBullet}
      >
        {isPaused && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-50">
            <div className="text-white text-2xl font-bold">PAUSED</div>
            <div className="text-gray-300 text-sm mt-2">Press P to continue</div>
          </div>
        )}
      
        {/* Background stars */}
        {Array.from({ length: 50 }).map((_, i) => (
          <div 
            key={`star-${i}`} 
            className="absolute bg-white rounded-full"
            style={{ 
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.8 + 0.2,
            }}
          />
        ))}
        
        {/* Ship */}
        <div
          className={`absolute w-10 h-10 transform -translate-x-1/2 ${
            invincible ? 'animate-pulse opacity-70' : ''
          }`}
          style={{
            left: `${shipPosition}%`,
            bottom: '10%',
          }}
        >
          <img
            src="/assets/images/spaceship.png"
            alt="Spaceship"
            className="w-full h-full"
          />
          
          {/* Shield effect */}
          {(shield > 0 || shieldFlashTimer > 0) && (
            <div
              className={`absolute rounded-full w-12 h-12 -left-1 -top-1 border-2 ${
                shieldFlashTimer > 0 ? 'border-blue-400 bg-blue-400 opacity-50' : 'border-blue-500 opacity-30'
              }`}
              style={{
                boxShadow: `0 0 10px ${shieldFlashTimer > 0 ? '#60a5fa' : '#3b82f6'}`
              }}
            />
          )}
        </div>
        
        {/* Bullets */}
        {bullets.map(bullet => (
          <div 
            key={bullet.id}
            className="absolute w-1 h-4 bg-yellow-400"
            style={{ 
              left: `calc(${bullet.x}% - 0.5px)`, 
              top: `${bullet.y}%`,
              boxShadow: '0 0 5px #FFD700'
            }}
          />
        ))}
        
        {/* Asteroids */}
        {asteroids.map((asteroid, index) => (
          <div
            key={index}
            className="absolute rounded-full"
            style={{
              left: `${asteroid.x}px`,
              top: `${asteroid.y}px`,
              width: `${asteroid.size}px`,
              height: `${asteroid.size}px`,
              backgroundColor: asteroid.color || getAsteroidColor(asteroid.size),
              transform: `rotate(${asteroid.rotation}deg)`,
              boxShadow: `inset -2px -2px 3px rgba(0,0,0,0.5), 0 0 2px rgba(255,255,255,0.5)`,
            }}
          />
        ))}
        
        {/* Power-ups */}
        {powerUps.map(powerUp => (
          <div 
            key={powerUp.id}
            className="absolute w-6 h-6 flex items-center justify-center"
            style={{ 
              left: `calc(${powerUp.x}% - 12px)`, 
              top: `${powerUp.y}%`,
              animation: 'pulse 1s infinite'
            }}
          >
            {powerUp.type === 'shield' && <FaShieldAlt className="text-blue-400 text-xl" />}
            {powerUp.type === 'speed' && <FaBolt className="text-red-400 text-xl" />}
            {powerUp.type === 'slow' && <FaClock className="text-purple-400 text-xl" />}
            {powerUp.type === 'life' && <FaHeart className="text-green-400 text-xl" />}
            {powerUp.type === 'shoot' && <div className="text-yellow-400 text-xl">🔫</div>}
          </div>
        ))}
        
        {/* Particles for explosions */}
        {particles.map((particle, index) => (
          <div
            key={index}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              opacity: particle.life / 30,
              boxShadow: particle.isExplosion ? `0 0 ${2 + Math.random() * 3}px ${particle.color}` : 'none',
            }}
          />
        ))}
      </div>
      
      <div className="flex justify-between">
        <p className="text-sm text-gray-400">
          {screenWidth < 768 ? 
            "Tap to shoot, drag to move" : 
            "Left/Right or mouse to move, Space or click to shoot"}
        </p>
        <button onClick={onBackToMenu} className="text-sm text-blue-400 hover:text-blue-300">
          <FaArrowLeft className="inline mr-1" /> Back to Menu
        </button>
      </div>
      
      {/* Mobile controls */}
      {screenWidth < 768 && (
        <div className="flex justify-center gap-8 mt-2">
          <button 
            className="bg-gray-700 hover:bg-gray-600 w-12 h-12 rounded-full flex items-center justify-center"
            onTouchStart={() => setShipPosition(prev => Math.max(prev - 5, 0))}
          >
            <FaArrowLeft className="text-white" />
          </button>
          
          <button 
            className="bg-yellow-600 hover:bg-yellow-500 w-12 h-12 rounded-full flex items-center justify-center"
            onTouchStart={shootBullet}
          >
            🔥
          </button>
          
          <button 
            className="bg-gray-700 hover:bg-gray-600 w-12 h-12 rounded-full flex items-center justify-center"
            onTouchStart={() => setShipPosition(prev => Math.min(prev + 5, 100))}
          >
            <FaArrowRight className="text-white" />
          </button>
        </div>
      )}

      {/* Custom CSS for blinking effect */}
      <style jsx>{`
        @keyframes blink {
          0% { opacity: 0.3; }
          50% { opacity: 0.9; }
          100% { opacity: 0.3; }
        }
        
        @keyframes pulse {
          0% { transform: scale(0.95); }
          50% { transform: scale(1.05); }
          100% { transform: scale(0.95); }
        }
      `}</style>
    </div>
  );
};

export default AsteroidDodgeGame; 