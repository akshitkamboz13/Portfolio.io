import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';

const AnimatedBackground = ({ color1 = '#3b82f6', color2 = '#2563eb', density = 0.00015 }) => {
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

    // Create engine
    const engine = Engine.create();
    engineRef.current = engine;

    // Create renderer
    const render = Render.create({
      element: container,
      engine: engine,
      canvas: canvasRef.current,
      options: {
        width: container.clientWidth,
        height: container.clientHeight,
        wireframes: false,
        background: 'transparent',
      }
    });

    // Create floating particles
    const createParticles = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      const particleCount = Math.floor(width * height * density);
      const particles = [];

      const colors = [color1, color2, '#ffffff'];
      
      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 10 + 2;
        const x = Math.random() * width;
        const y = Math.random() * height;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const opacity = Math.random() * 0.3 + 0.1;
        
        const particle = Bodies.circle(x, y, size, {
          render: {
            fillStyle: color,
            opacity: opacity
          },
          frictionAir: 0.1,
          restitution: 0.3,
          friction: 0.001,
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

    // Add mouse interaction
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });

    Composite.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    // Run the engine and renderer
    Runner.run(Runner.create(), engine);
    Render.run(render);

    // Handle resize
    const handleResize = () => {
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
      
      // Update wall sizes
      Matter.Body.setVertices(walls[0], Matter.Vertices.fromPath(`0 0 ${container.clientWidth} 0 ${container.clientWidth} 20 0 20`));
      Matter.Body.setVertices(walls[1], Matter.Vertices.fromPath(`0 0 ${container.clientWidth} 0 ${container.clientWidth} 20 0 20`));
      Matter.Body.setVertices(walls[2], Matter.Vertices.fromPath(`0 0 20 0 20 ${container.clientHeight} 0 ${container.clientHeight}`));
      Matter.Body.setVertices(walls[3], Matter.Vertices.fromPath(`0 0 20 0 20 ${container.clientHeight} 0 ${container.clientHeight}`));
    };

    window.addEventListener('resize', handleResize);

    return () => {
      // Cleanup
      window.removeEventListener('resize', handleResize);
      Render.stop(render);
      Runner.stop(Runner.create(), engine);
      if (render.canvas) {
        render.canvas.remove();
      }
      if (render.canvas && render.canvas.parentNode) {
        render.canvas.parentNode.removeChild(render.canvas);
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