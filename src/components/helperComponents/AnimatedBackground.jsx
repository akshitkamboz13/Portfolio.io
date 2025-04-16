import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';

const AnimatedBackground = ({ color1 = '#3b82f6', color2 = '#2563eb', density = 0.00008 }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const engineRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Module aliases
    const Engine = Matter.Engine,
          Render = Matter.Render,
          Runner = Matter.Runner,
          Composite = Matter.Composite,
          Bodies = Matter.Bodies,
          Mouse = Matter.Mouse,
          MouseConstraint = Matter.MouseConstraint;

    // Create engine with reduced constraints for better performance
    const engine = Engine.create({
      positionIterations: 2, // default is 6
      velocityIterations: 2, // default is 4
    });
    engineRef.current = engine;

    // Reduce gravity effect for performance
    engine.world.gravity.y = 0;

    // Create renderer with optimized settings
    const render = Render.create({
      element: container,
      engine: engine,
      canvas: canvasRef.current,
      options: {
        width: container.clientWidth,
        height: container.clientHeight,
        wireframes: false,
        background: 'transparent',
        pixelRatio: Math.min(window.devicePixelRatio, 1), // Limit pixel ratio
      }
    });

    // Create floating particles with reduced complexity
    const createParticles = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      // Limit maximum particles for performance
      const maxParticles = Math.min(Math.floor(width * height * density), 80);
      const particles = [];

      const colors = [color1, color2, '#ffffff'];
      
      for (let i = 0; i < maxParticles; i++) {
        // Use simpler, larger particles for better performance
        const size = Math.random() * 6 + 3;
        const x = Math.random() * width;
        const y = Math.random() * height;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const opacity = Math.random() * 0.25 + 0.05;
        
        const particle = Bodies.circle(x, y, size, {
          render: {
            fillStyle: color,
            opacity: opacity
          },
          frictionAir: 0.2, // Increased for slower movement
          restitution: 0.2,
          friction: 0.005,
          isStatic: false
        });
        
        particles.push(particle);
      }
      
      return particles;
    };

    // Add particles to the world
    Composite.add(engine.world, createParticles());

    // Add boundaries to keep particles inside
    const walls = [
      Bodies.rectangle(container.clientWidth / 2, -10, container.clientWidth, 20, { isStatic: true }),
      Bodies.rectangle(container.clientWidth / 2, container.clientHeight + 10, container.clientWidth, 20, { isStatic: true }),
      Bodies.rectangle(-10, container.clientHeight / 2, 20, container.clientHeight, { isStatic: true }),
      Bodies.rectangle(container.clientWidth + 10, container.clientHeight / 2, 20, container.clientHeight, { isStatic: true })
    ];
    
    Composite.add(engine.world, walls);

    // Add mouse interaction with reduced sensitivity 
    const mouse = Mouse.create(render.canvas);
    mouse.pixelRatio = Math.min(window.devicePixelRatio, 1); // Optimize for performance
    
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.1, // Reduced for lower CPU usage
        render: {
          visible: false
        }
      }
    });

    Composite.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    // Run the engine and renderer
    const runner = Runner.create({
      isFixed: true, // Use fixed timestep for better performance
      delta: 1000/30 // Limit to 30 FPS
    });
    Runner.run(runner, engine);
    Render.run(render);

    // Handle resize with debouncing
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        render.options.width = container.clientWidth;
        render.options.height = container.clientHeight;
        render.canvas.width = container.clientWidth;
        render.canvas.height = container.clientHeight;
        
        // Reposition walls
        walls[0].position.x = container.clientWidth / 2;
        walls[1].position.x = container.clientWidth / 2;
        walls[1].position.y = container.clientHeight + 10;
        walls[2].position.y = container.clientHeight / 2;
        walls[3].position.x = container.clientWidth + 10;
        walls[3].position.y = container.clientHeight / 2;
      }, 200); // Debounce resize
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      // Cleanup
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
      // Stop simulation first
      Runner.stop(runner);
      Render.stop(render);
      // Clean up Matter engine
      if (render.canvas) {
        render.canvas.remove();
      }
      Engine.clear(engine);
    };
  }, [color1, color2, density]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 pointer-events-none overflow-hidden"
    >
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0 opacity-30"
      />
    </div>
  );
};

export default AnimatedBackground; 