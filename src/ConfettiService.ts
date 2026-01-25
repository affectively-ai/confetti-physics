/**
 * ConfettiService - Luxury visual celebrations with particle effects
 *
 * Two rendering engines:
 * 1. canvas-confetti: Classic confetti with simple physics (fallback)
 * 2. PhysicsConfettiEngine: Advanced fluid dynamics, attractors, flow fields
 *
 * Uses the hexgrid-3d math library for genuinely clever physics simulations.
 */

import {
  PhysicsConfettiEngine,
  getPhysicsConfettiEngine,
  type PhysicsCelebrationType,
  type PhysicsCelebrationConfig,
  BRAND_COLORS,
} from './PhysicsConfettiEngine';

// Dynamic import for canvas-confetti to support SSR
let confetti: ConfettiFn | null = null;
if (typeof window !== 'undefined') {
  import('canvas-confetti').then((mod) => {
    confetti = mod.default ?? mod;
  });
}

// Type definitions for confetti
interface ConfettiOptions {
  particleCount?: number;
  angle?: number;
  spread?: number;
  startVelocity?: number;
  decay?: number;
  gravity?: number;
  drift?: number;
  ticks?: number;
  origin?: { x?: number; y?: number };
  colors?: string[];
  shapes?: ('square' | 'circle' | 'star' | Shape)[];
  scalar?: number;
  zIndex?: number;
  disableForReducedMotion?: boolean;
}

interface Shape {
  type: 'path' | 'text';
}

interface ConfettiFn {
  (options?: ConfettiOptions): Promise<null>;
  reset: () => void;
  shapeFromText: (config: { text: string; scalar?: number }) => Shape;
}

export type ConfettiType =
  | 'burst' // Quick celebration burst
  | 'shower' // Confetti shower from top
  | 'fireworks' // Firework explosions
  | 'sparkles' // Gentle sparkle effect
  | 'stars' // Star-shaped particles
  | 'hearts' // Heart-shaped particles
  | 'achievement' // Grand achievement celebration
  | 'streak' // Streak celebration
  | 'milestone' // Milestone reached
  | 'levelUp' // Level up celebration
  | 'welcome' // Welcome/onboarding
  | 'premium' // Premium upgrade celebration
  // Physics-based types (uses hexgrid-3d math)
  | 'vortex' // Spiral vortex pulling particles (fluid dynamics)
  | 'supernova' // Explosive burst with fluid shockwave
  | 'aurora' // Flowing northern lights ribbons
  | 'resonance' // Heart-rate synced pulsing particles
  | 'orbit' // Multiple orbital attractors
  | 'cascade' // Fluid waterfall effect
  | 'emergence' // Particles following flow field
  | 'harmony' // Lissajous pattern attractors
  | 'helix' // DNA-like double helix spiral
  | 'bloom' // Flower-like unfolding pattern
  | 'constellation' // Particles forming and connecting
  | 'nebula'; // Gas cloud effect with density

// Classic confetti types that use canvas-confetti
type ClassicConfettiType =
  | 'burst'
  | 'shower'
  | 'fireworks'
  | 'sparkles'
  | 'stars'
  | 'hearts'
  | 'achievement'
  | 'streak'
  | 'milestone'
  | 'levelUp'
  | 'welcome'
  | 'premium';

/** Physics-based confetti types that use PhysicsConfettiEngine */
const PHYSICS_TYPES: PhysicsCelebrationType[] = [
  'vortex',
  'supernova',
  'aurora',
  'resonance',
  'orbit',
  'cascade',
  'emergence',
  'harmony',
  'helix',
  'bloom',
  'constellation',
  'nebula',
];

/** Check if a type uses physics engine */
function isPhysicsType(type: ConfettiType): type is PhysicsCelebrationType {
  return PHYSICS_TYPES.includes(type as PhysicsCelebrationType);
}

// Preset configurations for classic celebration types (canvas-confetti)
function getConfettiPresets(): Record<ClassicConfettiType, () => void> {
  if (!confetti) {
    return {} as Record<ClassicConfettiType, () => void>;
  }

  const c = confetti;

  return {
    burst: () => {
      c({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: [...BRAND_COLORS.emerald, ...BRAND_COLORS.teal],
      });
    },

    shower: () => {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        c({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0 },
          colors: BRAND_COLORS.emerald,
        });
        c({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0 },
          colors: BRAND_COLORS.teal,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    },

    fireworks: () => {
      const duration = 4000;
      const end = Date.now() + duration;
      const colors = [...BRAND_COLORS.emerald, ...BRAND_COLORS.gold];

      const frame = () => {
        c({
          particleCount: 30,
          startVelocity: 30,
          spread: 360,
          origin: {
            x: Math.random(),
            y: Math.random() * 0.5,
          },
          colors,
          gravity: 0.8,
          scalar: 1.2,
        });

        if (Date.now() < end) {
          setTimeout(frame, 400 + Math.random() * 200);
        }
      };

      frame();
    },

    sparkles: () => {
      const duration = 2000;
      const end = Date.now() + duration;

      const frame = () => {
        c({
          particleCount: 5,
          spread: 360,
          startVelocity: 10,
          origin: {
            x: Math.random(),
            y: Math.random(),
          },
          colors: BRAND_COLORS.gold,
          gravity: 0.3,
          scalar: 0.5,
          drift: 0,
          ticks: 100,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    },

    stars: () => {
      const defaults: ConfettiOptions = {
        spread: 360,
        ticks: 100,
        gravity: 0.5,
        decay: 0.94,
        startVelocity: 20,
        colors: [...BRAND_COLORS.gold, ...BRAND_COLORS.emerald],
        shapes: ['star'],
        scalar: 1.5,
      };

      c({
        ...defaults,
        particleCount: 30,
        origin: { x: 0.5, y: 0.5 },
      });

      setTimeout(() => {
        c({
          ...defaults,
          particleCount: 20,
          origin: { x: 0.3, y: 0.4 },
        });
      }, 200);

      setTimeout(() => {
        c({
          ...defaults,
          particleCount: 20,
          origin: { x: 0.7, y: 0.4 },
        });
      }, 400);
    },

    hearts: () => {
      // Custom heart shape using text
      const heart = c.shapeFromText({ text: '❤️', scalar: 2 });

      c({
        particleCount: 50,
        spread: 100,
        origin: { y: 0.6 },
        shapes: [heart],
        scalar: 2,
        colors: BRAND_COLORS.rose,
      });
    },

    achievement: () => {
      // Side cannons
      const count = 200;
      const defaults: ConfettiOptions = {
        origin: { y: 0.7 },
        colors: [...BRAND_COLORS.emerald, ...BRAND_COLORS.gold],
      };

      function fire(particleRatio: number, opts: Partial<ConfettiOptions>) {
        c({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      }

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    },

    streak: () => {
      // Fire emoji confetti
      const fire = c.shapeFromText({ text: '🔥', scalar: 2 });

      c({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.6 },
        shapes: [fire],
        scalar: 2,
      });

      setTimeout(() => {
        c({
          particleCount: 50,
          spread: 80,
          origin: { y: 0.5 },
          colors: [...BRAND_COLORS.gold, ...BRAND_COLORS.rose],
        });
      }, 150);
    },

    milestone: () => {
      // Trophy and star celebration
      const trophy = c.shapeFromText({ text: '🏆', scalar: 2 });

      c({
        particleCount: 20,
        spread: 50,
        origin: { y: 0.6 },
        shapes: [trophy],
        scalar: 2.5,
        gravity: 0.6,
      });

      setTimeout(() => {
        getConfettiPresets().stars();
      }, 300);
    },

    levelUp: () => {
      // Ascending particles
      const rocket = c.shapeFromText({ text: '🚀', scalar: 2 });

      c({
        particleCount: 10,
        spread: 30,
        origin: { y: 0.9 },
        shapes: [rocket],
        scalar: 2,
        gravity: -0.5,
        startVelocity: 50,
      });

      setTimeout(() => {
        getConfettiPresets().fireworks();
      }, 500);
    },

    welcome: () => {
      // Gentle welcoming particles
      const sparkle = c.shapeFromText({ text: '✨', scalar: 2 });

      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        c({
          particleCount: 2,
          spread: 50,
          origin: { x: Math.random(), y: 0 },
          shapes: [sparkle, 'circle'],
          scalar: 1.5,
          colors: BRAND_COLORS.teal,
          gravity: 0.5,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    },

    premium: () => {
      // Grand premium upgrade celebration
      const crown = c.shapeFromText({ text: '👑', scalar: 2 });
      const gem = c.shapeFromText({ text: '💎', scalar: 2 });

      // Crown rain
      c({
        particleCount: 15,
        spread: 60,
        origin: { y: 0.4 },
        shapes: [crown],
        scalar: 3,
        gravity: 0.4,
      });

      // Gems
      setTimeout(() => {
        c({
          particleCount: 20,
          spread: 80,
          origin: { y: 0.5 },
          shapes: [gem],
          scalar: 2,
        });
      }, 200);

      // Gold confetti
      setTimeout(() => {
        c({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: [...BRAND_COLORS.gold, ...BRAND_COLORS.purple],
        });
      }, 400);

      // Final fireworks
      setTimeout(() => {
        getConfettiPresets().fireworks();
      }, 800);
    },
  };
}

class ConfettiServiceClass {
  private enabled = true;
  private prefersReducedMotion = false;
  private preferPhysics = true; // Use physics engine when available

  constructor() {
    if (typeof window !== 'undefined') {
      // Respect user's motion preferences
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.prefersReducedMotion = mediaQuery.matches;

      // Listen for changes
      mediaQuery.addEventListener('change', (e) => {
        this.prefersReducedMotion = e.matches;
      });
    }
  }

  /**
   * Enable or disable confetti globally
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    const engine = getPhysicsConfettiEngine();
    if (engine) {
      engine.setEnabled(enabled);
    }
  }

  /**
   * Enable or disable physics engine preference
   * When disabled, only canvas-confetti is used
   */
  setPreferPhysics(prefer: boolean): void {
    this.preferPhysics = prefer;
  }

  /**
   * Check if confetti is enabled
   */
  isEnabled(): boolean {
    return this.enabled && !this.prefersReducedMotion;
  }

  /**
   * Check if physics engine is available and preferred
   */
  isPhysicsEnabled(): boolean {
    return this.preferPhysics && getPhysicsConfettiEngine() !== null;
  }

  /**
   * Trigger a confetti celebration
   */
  celebrate(type: ConfettiType): void {
    if (!this.isEnabled()) return;

    // Route physics types to physics engine
    if (isPhysicsType(type) && this.isPhysicsEnabled()) {
      this.celebratePhysics({ type });
      return;
    }

    // Use canvas-confetti for classic types
    const presets = getConfettiPresets();
    const preset = presets[type as ClassicConfettiType];
    if (preset) {
      preset();
    }
  }

  /**
   * Trigger a physics-based celebration with full configuration
   */
  celebratePhysics(config: PhysicsCelebrationConfig): void {
    if (!this.isEnabled()) return;
    const engine = getPhysicsConfettiEngine();
    if (engine) {
      engine.celebrate(config);
    }
  }

  /**
   * Trigger emotion-aware celebration
   * Automatically selects the best celebration type and colors based on emotion context
   */
  celebrateEmotion(config: {
    emotion: string;
    intensity?: number;
    valence?: number;
    arousal?: number;
    heartRate?: number;
  }): void {
    if (!this.isEnabled()) return;

    const {
      emotion,
      intensity = 0.7,
      valence = 0,
      arousal = 0.5,
      heartRate,
    } = config;

    // Select celebration type based on emotion characteristics
    let type: PhysicsCelebrationType;

    if (arousal > 0.7) {
      // High arousal: energetic effects
      type = valence > 0 ? 'supernova' : 'vortex';
    } else if (arousal < 0.3) {
      // Low arousal: calm effects
      type = valence > 0 ? 'aurora' : 'nebula';
    } else {
      // Medium arousal: balanced effects
      if (valence > 0.5) {
        type = Math.random() > 0.5 ? 'bloom' : 'harmony';
      } else if (valence > 0) {
        type = Math.random() > 0.5 ? 'orbit' : 'constellation';
      } else {
        type = Math.random() > 0.5 ? 'cascade' : 'emergence';
      }
    }

    // Use resonance if heart rate is provided
    if (heartRate && heartRate > 0) {
      type = 'resonance';
    }

    this.celebratePhysics({
      type,
      intensity,
      heartRate,
      emotionContext: {
        valence,
        arousal,
        dominantEmotion: emotion,
      },
    });
  }

  /**
   * Fire custom confetti with full options
   */
  custom(options: ConfettiOptions): void {
    if (!this.isEnabled() || !confetti) return;
    confetti(options);
  }

  /**
   * Fire confetti from a specific element's position
   */
  fromElement(element: HTMLElement, type: ConfettiType = 'burst'): void {
    if (!this.isEnabled() || !confetti) return;

    const rect = element.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    // Override origin for the preset
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { x, y },
      colors: [...BRAND_COLORS.emerald, ...BRAND_COLORS.teal],
    });
  }

  /**
   * Clear all confetti (both engines)
   */
  reset(): void {
    if (confetti) {
      confetti.reset();
    }
    const engine = getPhysicsConfettiEngine();
    if (engine) {
      engine.clear();
    }
  }

  // Convenience methods

  /** Quick celebration burst */
  burst(): void {
    this.celebrate('burst');
  }

  /** Confetti shower */
  shower(): void {
    this.celebrate('shower');
  }

  /** Fireworks display */
  fireworks(): void {
    this.celebrate('fireworks');
  }

  /** Gentle sparkles */
  sparkles(): void {
    this.celebrate('sparkles');
  }

  /** Star celebration */
  stars(): void {
    this.celebrate('stars');
  }

  /** Heart celebration */
  hearts(): void {
    this.celebrate('hearts');
  }

  /** Grand achievement celebration */
  achievement(): void {
    this.celebrate('achievement');
  }

  /** Streak celebration */
  streak(): void {
    this.celebrate('streak');
  }

  /** Milestone celebration */
  milestone(): void {
    this.celebrate('milestone');
  }

  /** Level up celebration */
  levelUp(): void {
    this.celebrate('levelUp');
  }

  /** Welcome celebration */
  welcome(): void {
    this.celebrate('welcome');
  }

  /** Premium upgrade celebration */
  premium(): void {
    this.celebrate('premium');
  }

  // Physics-based celebration methods

  /** Spiral vortex pulling particles inward (fluid dynamics) */
  vortex(): void {
    this.celebrate('vortex');
  }

  /** Explosive burst with fluid shockwave */
  supernova(): void {
    this.celebrate('supernova');
  }

  /** Flowing northern lights ribbons */
  aurora(): void {
    this.celebrate('aurora');
  }

  /** Heart-rate synced pulsing particles */
  resonance(heartRate?: number): void {
    this.celebratePhysics({ type: 'resonance', heartRate });
  }

  /** Multiple orbital attractors */
  orbit(): void {
    this.celebrate('orbit');
  }

  /** Fluid waterfall effect */
  cascade(): void {
    this.celebrate('cascade');
  }

  /** Particles following flow field */
  emergence(): void {
    this.celebrate('emergence');
  }

  /** Lissajous pattern attractors */
  harmony(): void {
    this.celebrate('harmony');
  }

  /** DNA-like double helix spiral */
  helix(): void {
    this.celebrate('helix');
  }

  /** Flower-like unfolding pattern */
  bloom(): void {
    this.celebrate('bloom');
  }

  /** Particles forming and connecting */
  constellation(): void {
    this.celebrate('constellation');
  }

  /** Gas cloud effect with density */
  nebula(): void {
    this.celebrate('nebula');
  }
}

// Singleton instance
export const ConfettiService = new ConfettiServiceClass();
