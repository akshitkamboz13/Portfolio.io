// config/Particles-config.js
const particlesConfig = {
  background: {
    color: {
      value: "#0c0f13",
    },
  },
  fpsLimit: 120,
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: "push",
      },
      onHover: {
        enable: true,
        mode: "grab",
        parallax: {
          enable: true,
          force: 60,
          smooth: 10
        }
      },
    },
    modes: {
      push: {
        quantity: 4,
      },
      grab: {
        distance: 180,
        links: {
          opacity: 0.8,
          color: "#4a8cff"
        }
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: ["#3498db", "#5d6dff", "#1d4ed8", "#60a5fa", "#3b82f6"],
    },
    links: {
      color: "#ffffff",
      distance: 150,
      enable: true,
      opacity: 0.3,
      width: 1,
      triangles: {
        enable: true,
        opacity: 0.05
      }
    },
    move: {
      direction: "none",
      enable: true,
      outModes: {
        default: "out",
      },
      random: true,
      speed: 2,
      straight: false,
      attract: {
        enable: true,
        rotateX: 600,
        rotateY: 1200
      }
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 80,
    },
    opacity: {
      value: 0.5,
      random: true,
      anim: {
        enable: true,
        speed: 1,
        opacity_min: 0.1,
        sync: false
      }
    },
    shape: {
      type: ["circle", "triangle", "polygon"],
      polygon: {
        sides: 6
      }
    },
    size: {
      value: { min: 1, max: 3 },
      random: true,
      anim: {
        enable: true,
        speed: 2,
        size_min: 0.3,
        sync: false
      }
    },
  },
  detectRetina: true,
};

export default particlesConfig;
