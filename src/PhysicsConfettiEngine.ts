/**
 * PhysicsConfettiEngine - Advanced physics-driven confetti using hexgrid-3d math
 *
 * This engine creates genuinely clever confetti effects:
 * - Fluid dynamics: Particles follow Navier-Stokes flow, swirling naturally
 * - Attractors: Particles orbit around celebration points
 * - Flow fields: Streamlines create artistic motion patterns
 * - Emergence: Complex behavior from simple rules
 * - Biometric sync: Optional heart-rate driven pulse effects
 *
 * Uses the math infrastructure from hexgrid-3d for real physics simulation.
 */

import { Vector2, StableFluids, FlowField2D } from '@buley/hexgrid-3d';

/** Individual confetti particle with physics properties */
interface PhysicsParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  ax: number;
  ay: number;
  size: number;
  rotation: number;
  rotationVelocity: number;
  color: string;
  opacity: number;
  life: number;
  maxLife: number;
  mass: number;
  shape: 'square' | 'circle' | 'star' | 'heart' | 'hexagon' | 'spiral';
  trail: Array<{ x: number; y: number; opacity: number }>;
  pulsePhase: number;
  /** For spiral shapes - current angle */
  spiralAngle?: number;
}

/** Attractor point that pulls particles */
interface Attractor {
  x: number;
  y: number;
  strength: number;
  radius: number;
  type: 'pull' | 'push' | 'orbit' | 'vortex';
}

/** Configuration for physics celebration effects */
export interface PhysicsCelebrationConfig {
  /** Celebration type - determines behavior */
  type: PhysicsCelebrationType;
  /** Origin point (normalized 0-1) */
  origin?: { x: number; y: number };
  /** Number of particles */
  count?: number;
  /** Color palette */
  colors?: string[];
  /** Intensity multiplier (0-1) */
  intensity?: number;
  /** Optional heart rate for biometric sync */
  heartRate?: number;
  /** Emotion context for color/behavior adaptation */
  emotionContext?: {
    valence: number; // -1 to 1 (negative to positive)
    arousal: number; // 0 to 1 (calm to excited)
    dominantEmotion?: string;
  };
}

/** Physics-based celebration types */
export type PhysicsCelebrationType =
  | 'vortex' // Spiral vortex pulling particles inward
  | 'supernova' // Explosive burst with fluid wake
  | 'aurora' // Flowing northern lights effect
  | 'resonance' // Heart-rate synced pulsing
  | 'orbit' // Particles orbiting multiple attractors
  | 'cascade' // Fluid waterfall effect
  | 'emergence' // Particles emerging following flow field
  | 'harmony' // Multiple attractors creating Lissajous patterns
  | 'helix' // DNA-like double helix spiral
  | 'bloom' // Flower-like unfolding pattern
  | 'constellation' // Particles forming and connecting
  | 'nebula'; // Gas cloud effect with density

/** Color palettes for emotions */
const EMOTION_PALETTES: Record<string, string[]> = {
  joy: ['#fbbf24', '#f59e0b', '#fcd34d', '#fef3c7', '#fff7ed'],
  serenity: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'],
  excitement: ['#f43f5e', '#fb7185', '#fda4af', '#fbbf24', '#fcd34d'],
  love: ['#ec4899', '#f472b6', '#f9a8d4', '#f43f5e', '#fb7185'],
  triumph: ['#a855f7', '#c084fc', '#d8b4fe', '#fbbf24', '#fcd34d'],
  gratitude: ['#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4', '#10b981'],
  wonder: ['#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd', '#a855f7'],
  peace: ['#10b981', '#14b8a6', '#2dd4bf', '#5eead4', '#a7f3d0'],
  default: ['#10b981', '#34d399', '#14b8a6', '#2dd4bf', '#fbbf24'],
};

/** Default brand colors */
export const BRAND_COLORS = {
  emerald: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'],
  teal: ['#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4'],
  gold: ['#fbbf24', '#fcd34d', '#fde68a', '#fef3c7'],
  rose: ['#f43f5e', '#fb7185', '#fda4af', '#fecdd3'],
  purple: ['#a855f7', '#c084fc', '#d8b4fe', '#e9d5ff'],
  sky: ['#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd'],
};

/**
 * PhysicsConfettiEngine - The brain behind clever celebrations
 */
export class PhysicsConfettiEngine {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: Map<number, PhysicsParticle> = new Map();
  private attractors: Attractor[] = [];
  private fluid: StableFluids | null = null;
  private flowField: FlowField2D | null = null;
  private animationId: number | null = null;
  private time = 0;
  private particleIdCounter = 0;
  private enabled = true;
  private prefersReducedMotion = false;

  // Configuration
  private gravity = 0.15;
  private drag = 0.98;
  private fluidInfluence = 0.5;
  private trailLength = 8;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initCanvas();
      this.initFluidSim();

      // Respect reduced motion preferences
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.prefersReducedMotion = mediaQuery.matches;
      mediaQuery.addEventListener('change', (e) => {
        this.prefersReducedMotion = e.matches;
      });
    }
  }

  /** Initialize the canvas overlay */
  private initCanvas(): void {
    // Create full-screen canvas overlay
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'physics-confetti-canvas';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    `;
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.resize();

    window.addEventListener('resize', () => this.resize());
  }

  /** Initialize fluid simulation */
  private initFluidSim(): void {
    // Use a coarse grid for performance (every 20 pixels)
    const gridWidth = Math.ceil(window.innerWidth / 20);
    const gridHeight = Math.ceil(window.innerHeight / 20);

    this.fluid = new StableFluids({
      width: gridWidth,
      height: gridHeight,
      viscosity: 0.0001,
      diffusion: 0.00001,
    });

    this.flowField = new FlowField2D({
      width: window.innerWidth,
      height: window.innerHeight,
      resolution: 20,
    });
  }

  /** Handle window resize */
  private resize(): void {
    if (!this.canvas) return;

    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.ctx?.scale(dpr, dpr);
  }

  /** Enable or disable the engine */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) {
      this.clear();
    }
  }

  /** Check if enabled */
  isEnabled(): boolean {
    return this.enabled && !this.prefersReducedMotion;
  }

  /**
   * Trigger a physics-based celebration!
   */
  celebrate(config: PhysicsCelebrationConfig): void {
    if (!this.isEnabled()) return;

    const {
      type,
      origin = { x: 0.5, y: 0.5 },
      count = 100,
      colors = this.getColorsForEmotion(config.emotionContext?.dominantEmotion),
      intensity = 1,
      heartRate,
    } = config;

    // Convert normalized origin to screen coordinates
    const originX = origin.x * window.innerWidth;
    const originY = origin.y * window.innerHeight;

    // Clear previous attractors
    this.attractors = [];

    // Configure based on type
    switch (type) {
      case 'vortex':
        this.createVortex(originX, originY, count, colors, intensity);
        break;
      case 'supernova':
        this.createSupernova(originX, originY, count, colors, intensity);
        break;
      case 'aurora':
        this.createAurora(count, colors, intensity);
        break;
      case 'resonance':
        this.createResonance(
          originX,
          originY,
          count,
          colors,
          intensity,
          heartRate,
        );
        break;
      case 'orbit':
        this.createOrbit(originX, originY, count, colors, intensity);
        break;
      case 'cascade':
        this.createCascade(count, colors, intensity);
        break;
      case 'emergence':
        this.createEmergence(originX, originY, count, colors, intensity);
        break;
      case 'harmony':
        this.createHarmony(originX, originY, count, colors, intensity);
        break;
      case 'helix':
        this.createHelix(originX, originY, count, colors, intensity);
        break;
      case 'bloom':
        this.createBloom(originX, originY, count, colors, intensity);
        break;
      case 'constellation':
        this.createConstellation(count, colors, intensity);
        break;
      case 'nebula':
        this.createNebula(originX, originY, count, colors, intensity);
        break;
    }

    // Start animation loop if not running
    if (this.animationId === null) {
      this.animate();
    }
  }

  // =========================================================================
  // CELEBRATION TYPE IMPLEMENTATIONS
  // =========================================================================

  /** Vortex - Spiral particles pulling inward like a galaxy */
  private createVortex(
    x: number,
    y: number,
    count: number,
    colors: string[],
    intensity: number,
  ): void {
    // Central vortex attractor
    this.attractors.push({
      x,
      y,
      strength: 200 * intensity,
      radius: 400,
      type: 'vortex',
    });

    // Add swirling force to fluid
    if (this.fluid) {
      const gridX = x / 20;
      const gridY = y / 20;
      this.fluid.addForce(gridX, gridY, 0, -50 * intensity, 10);
    }

    // Spawn particles in a ring around center
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3;
      const radius = 150 + Math.random() * 200;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;

      // Tangential velocity for spiral motion
      const tangentAngle = angle + Math.PI / 2;
      const speed = 3 + Math.random() * 3;

      this.addParticle({
        x: px,
        y: py,
        vx: Math.cos(tangentAngle) * speed,
        vy: Math.sin(tangentAngle) * speed,
        color: colors[i % colors.length],
        size: 6 + Math.random() * 8,
        life: 200 + Math.random() * 150,
        shape: Math.random() > 0.7 ? 'star' : 'square',
        mass: 1,
      });
    }
  }

  /** Supernova - Explosive burst with fluid shockwave */
  private createSupernova(
    x: number,
    y: number,
    count: number,
    colors: string[],
    intensity: number,
  ): void {
    // Create expanding shockwave in fluid
    if (this.fluid) {
      const gridX = x / 20;
      const gridY = y / 20;
      // Explosive outward force
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
        const fx = Math.cos(angle) * 100 * intensity;
        const fy = Math.sin(angle) * 100 * intensity;
        this.fluid.addForce(gridX, gridY, fx, fy, 5);
      }
      this.fluid.addDensity(gridX, gridY, 100 * intensity, 5);
    }

    // Initial burst - fast particles
    for (let i = 0; i < count * 0.6; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (15 + Math.random() * 20) * intensity;

      this.addParticle({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[i % colors.length],
        size: 4 + Math.random() * 6,
        life: 80 + Math.random() * 60,
        shape: 'circle',
        mass: 0.5,
      });
    }

    // Secondary ring - slower, larger particles
    setTimeout(() => {
      for (let i = 0; i < count * 0.4; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = (5 + Math.random() * 10) * intensity;

        this.addParticle({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: colors[(i + 2) % colors.length],
          size: 8 + Math.random() * 10,
          life: 150 + Math.random() * 100,
          shape: 'star',
          mass: 1.5,
        });
      }
    }, 100);
  }

  /** Aurora - Flowing northern lights ribbons */
  private createAurora(
    count: number,
    colors: string[],
    intensity: number,
  ): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Create horizontal flow in fluid
    if (this.flowField) {
      this.flowField.clear();
      // Add multiple wave sources
      for (let i = 0; i < 5; i++) {
        const y = height * (0.1 + i * 0.2);
        this.flowField.addSource(
          0,
          y,
          2 * intensity,
          Math.sin(i * 0.5) * 0.5,
          200,
        );
      }
    }

    // Create ribbon-like particle streams
    const ribbons = 4;
    for (let ribbon = 0; ribbon < ribbons; ribbon++) {
      const baseY = height * (0.15 + ribbon * 0.25);
      const particlesPerRibbon = Math.floor(count / ribbons);

      for (let i = 0; i < particlesPerRibbon; i++) {
        const px = Math.random() * width;
        const py = baseY + (Math.random() - 0.5) * 60;

        this.addParticle({
          x: px,
          y: py,
          vx: 1 + Math.random() * 2,
          vy: Math.sin(px * 0.01 + ribbon) * 0.5,
          color: colors[ribbon % colors.length],
          size: 10 + Math.random() * 15,
          life: 300 + Math.random() * 200,
          shape: 'circle',
          mass: 0.8,
        });
      }
    }
  }

  /** Resonance - Heart-rate synced pulsing particles */
  private createResonance(
    x: number,
    y: number,
    count: number,
    colors: string[],
    intensity: number,
    heartRate?: number,
  ): void {
    // Default to 72 BPM if no heart rate provided
    const bpm = heartRate ?? 72;
    const pulseInterval = 60000 / bpm; // ms per beat

    // Central attractor that pulses
    this.attractors.push({
      x,
      y,
      strength: 150 * intensity,
      radius: 300,
      type: 'pull',
    });

    // Create particles in concentric rings
    const rings = 4;
    for (let ring = 0; ring < rings; ring++) {
      const ringRadius = 50 + ring * 40;
      const particlesInRing = Math.floor(count / rings);

      for (let i = 0; i < particlesInRing; i++) {
        const angle = (i / particlesInRing) * Math.PI * 2;
        const px = x + Math.cos(angle) * ringRadius;
        const py = y + Math.sin(angle) * ringRadius;

        this.addParticle({
          x: px,
          y: py,
          vx: 0,
          vy: 0,
          color: colors[ring % colors.length],
          size: 8 + Math.random() * 6,
          life: 400 + Math.random() * 200,
          shape: ring % 2 === 0 ? 'heart' : 'circle',
          mass: 1,
          pulsePhase: (ring * Math.PI) / 2, // Stagger pulse phases
        });
      }
    }

    // Schedule pulse effects
    const pulseCount = 5;
    for (let i = 0; i < pulseCount; i++) {
      setTimeout(() => {
        if (this.fluid) {
          const gridX = x / 20;
          const gridY = y / 20;
          this.fluid.addDensity(gridX, gridY, 50, 8);
          // Radial outward pulse
          for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
            const fx = Math.cos(angle) * 30;
            const fy = Math.sin(angle) * 30;
            this.fluid.addForce(gridX, gridY, fx, fy, 3);
          }
        }
      }, i * pulseInterval);
    }
  }

  /** Orbit - Multiple bodies with orbiting particles */
  private createOrbit(
    x: number,
    y: number,
    count: number,
    colors: string[],
    intensity: number,
  ): void {
    // Create 3 orbital centers in a triangle
    const centers = [
      { x, y, strength: 300 * intensity },
      { x: x - 150, y: y + 100, strength: 200 * intensity },
      { x: x + 150, y: y + 100, strength: 200 * intensity },
    ];

    centers.forEach((center) => {
      this.attractors.push({
        x: center.x,
        y: center.y,
        strength: center.strength,
        radius: 250,
        type: 'orbit',
      });
    });

    // Create particles in orbital paths
    centers.forEach((center, ci) => {
      const particlesPerCenter = Math.floor(count / 3);
      for (let i = 0; i < particlesPerCenter; i++) {
        const orbitRadius = 60 + Math.random() * 100;
        const angle = Math.random() * Math.PI * 2;
        const px = center.x + Math.cos(angle) * orbitRadius;
        const py = center.y + Math.sin(angle) * orbitRadius;

        // Orbital velocity (perpendicular to radius)
        const orbitalSpeed = Math.sqrt(center.strength / orbitRadius) * 0.3;
        const tangent = angle + Math.PI / 2;

        this.addParticle({
          x: px,
          y: py,
          vx: Math.cos(tangent) * orbitalSpeed,
          vy: Math.sin(tangent) * orbitalSpeed,
          color: colors[(ci + i) % colors.length],
          size: 5 + Math.random() * 7,
          life: 400 + Math.random() * 200,
          shape: Math.random() > 0.5 ? 'circle' : 'hexagon',
          mass: 1,
        });
      }
    });
  }

  /** Cascade - Fluid waterfall effect */
  private createCascade(
    count: number,
    colors: string[],
    intensity: number,
  ): void {
    const width = window.innerWidth;

    // Create downward flow in fluid
    if (this.flowField) {
      this.flowField.clear();
      // Multiple downward streams
      for (let i = 0; i < 7; i++) {
        const x = width * (0.1 + i * 0.13);
        this.flowField.addSource(x, 0, 0, 5 * intensity, 300);
      }
    }

    // Spawn particles at top, spread across width
    const spawnDuration = 2000;
    const spawnInterval = spawnDuration / count;

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const px = width * (0.1 + Math.random() * 0.8);
        const streamIndex = Math.floor((px / width) * 7);

        this.addParticle({
          x: px,
          y: -20 + Math.random() * 10,
          vx: (Math.random() - 0.5) * 2,
          vy: 5 + Math.random() * 5,
          color: colors[streamIndex % colors.length],
          size: 6 + Math.random() * 10,
          life: 300 + Math.random() * 150,
          shape: 'circle',
          mass: 0.8 + Math.random() * 0.4,
        });
      }, i * spawnInterval);
    }
  }

  /** Emergence - Particles following flow field streamlines */
  private createEmergence(
    x: number,
    y: number,
    count: number,
    colors: string[],
    intensity: number,
  ): void {
    // Create radial flow field emanating from origin
    if (this.flowField) {
      this.flowField.clear();
      // Central outward source
      this.flowField.addSource(x, y, 0, -3 * intensity, 500);

      // Add some turbulence
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const r = 200;
        const sourceX = x + Math.cos(angle) * r;
        const sourceY = y + Math.sin(angle) * r;
        const vx = Math.cos(angle + Math.PI / 2) * 2;
        const vy = Math.sin(angle + Math.PI / 2) * 2;
        this.flowField.addSource(sourceX, sourceY, vx, vy, 100);
      }
    }

    // Spawn particles at center that will follow flow
    const spawnDuration = 1500;
    const spawnInterval = spawnDuration / count;

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * 30;

        this.addParticle({
          x: x + Math.cos(angle) * r,
          y: y + Math.sin(angle) * r,
          vx: Math.cos(angle) * 2,
          vy: Math.sin(angle) * 2,
          color: colors[i % colors.length],
          size: 4 + Math.random() * 8,
          life: 200 + Math.random() * 150,
          shape: 'spiral',
          mass: 0.7,
          spiralAngle: angle,
        });
      }, i * spawnInterval);
    }
  }

  /** Harmony - Lissajous pattern attractors */
  private createHarmony(
    x: number,
    y: number,
    count: number,
    colors: string[],
    intensity: number,
  ): void {
    // Create moving attractors that trace Lissajous curves
    // This creates beautiful interference patterns

    const baseAttractors = [
      { freqX: 3, freqY: 2, phaseX: 0, phaseY: Math.PI / 4 },
      { freqX: 2, freqY: 3, phaseX: Math.PI / 2, phaseY: 0 },
      { freqX: 1, freqY: 2, phaseX: 0, phaseY: Math.PI / 3 },
    ];

    // Add dynamic attractors (will be updated in animation)
    baseAttractors.forEach((_, i) => {
      this.attractors.push({
        x,
        y,
        strength: 100 * intensity,
        radius: 200,
        type: 'pull',
      });
    });

    // Store Lissajous params for animation
    (this as unknown as { lissajous: typeof baseAttractors }).lissajous =
      baseAttractors;

    // Create particles evenly distributed
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 100 + Math.random() * 150;
      const px = x + Math.cos(angle) * r;
      const py = y + Math.sin(angle) * r;

      this.addParticle({
        x: px,
        y: py,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        color: colors[i % colors.length],
        size: 5 + Math.random() * 6,
        life: 500 + Math.random() * 200,
        shape: 'hexagon',
        mass: 1,
      });
    }
  }

  /** Helix - DNA-like double helix spiral */
  private createHelix(
    x: number,
    y: number,
    count: number,
    colors: string[],
    intensity: number,
  ): void {
    const height = window.innerHeight;
    const helixRadius = 80;
    const verticalSpeed = 3 * intensity;

    // Two intertwined spirals
    const strands = 2;
    const particlesPerStrand = Math.floor(count / strands);

    for (let strand = 0; strand < strands; strand++) {
      const phaseOffset = strand * Math.PI; // 180 degree offset

      for (let i = 0; i < particlesPerStrand; i++) {
        const angle = (i / particlesPerStrand) * Math.PI * 6 + phaseOffset;
        const yOffset = (i / particlesPerStrand) * height * 0.8;
        const px = x + Math.cos(angle) * helixRadius;
        const py = y - height * 0.4 + yOffset;

        // Tangential velocity for spiral motion
        const tangent = angle + Math.PI / 2;

        this.addParticle({
          x: px,
          y: py,
          vx: Math.cos(tangent) * 2 * intensity,
          vy: verticalSpeed + Math.sin(angle) * 0.5,
          color: strand === 0 ? colors[0] : colors[colors.length - 1],
          size: 6 + Math.random() * 5,
          life: 250 + Math.random() * 100,
          shape: 'circle',
          mass: 0.9,
          spiralAngle: angle,
        });
      }
    }
  }

  /** Bloom - Flower-like unfolding pattern */
  private createBloom(
    x: number,
    y: number,
    count: number,
    colors: string[],
    intensity: number,
  ): void {
    const petals = 8;
    const layers = 4;
    const particlesPerPetal = Math.floor(count / petals);

    // Gentle central attractor
    this.attractors.push({
      x,
      y,
      strength: 50 * intensity,
      radius: 200,
      type: 'pull',
    });

    for (let petal = 0; petal < petals; petal++) {
      const baseAngle = (petal / petals) * Math.PI * 2;

      for (let layer = 0; layer < layers; layer++) {
        const layerParticles = Math.floor(particlesPerPetal / layers);
        const layerRadius = 30 + layer * 50;

        for (let i = 0; i < layerParticles; i++) {
          const angle = baseAngle + (Math.random() - 0.5) * 0.3;
          const r = layerRadius + Math.random() * 30;
          const px = x + Math.cos(angle) * r;
          const py = y + Math.sin(angle) * r;

          // Outward + tangential velocity for unfolding
          const outwardSpeed = (1 + layer * 0.5) * intensity;
          const tangentSpeed = 0.5 * intensity;

          this.addParticle({
            x: px,
            y: py,
            vx:
              Math.cos(angle) * outwardSpeed +
              Math.cos(angle + Math.PI / 2) * tangentSpeed,
            vy:
              Math.sin(angle) * outwardSpeed +
              Math.sin(angle + Math.PI / 2) * tangentSpeed,
            color: colors[(petal + layer) % colors.length],
            size: 8 + Math.random() * 8 - layer * 1.5,
            life: 200 + layer * 50 + Math.random() * 100,
            shape: layer === 0 ? 'heart' : 'circle',
            mass: 0.8,
          });
        }
      }
    }
  }

  /** Constellation - Particles that form and connect with lines */
  private createConstellation(
    count: number,
    colors: string[],
    intensity: number,
  ): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Create star positions in a pleasing pattern
    const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    for (let i = 0; i < count; i++) {
      // Fibonacci spiral distribution
      const angle = i * goldenAngle;
      const r = Math.sqrt(i) * 30;
      const px = width / 2 + Math.cos(angle) * r;
      const py = height / 2 + Math.sin(angle) * r;

      // Only keep particles within screen
      if (px > 50 && px < width - 50 && py > 50 && py < height - 50) {
        this.addParticle({
          x: px,
          y: py,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          color: colors[i % colors.length],
          size: 3 + Math.random() * 5,
          life: 400 + Math.random() * 200,
          shape: 'star',
          mass: 0.5,
        });
      }
    }
  }

  /** Nebula - Gas cloud effect with density variations */
  private createNebula(
    x: number,
    y: number,
    count: number,
    colors: string[],
    intensity: number,
  ): void {
    // Add density to fluid for gaseous effect
    if (this.fluid) {
      for (let i = 0; i < 5; i++) {
        const offsetX = (Math.random() - 0.5) * 200;
        const offsetY = (Math.random() - 0.5) * 200;
        const gridX = (x + offsetX) / 20;
        const gridY = (y + offsetY) / 20;
        this.fluid.addDensity(gridX, gridY, 80 * intensity, 8);
      }
    }

    // Create soft, diffuse particles
    for (let i = 0; i < count; i++) {
      // Gaussian distribution for natural gas cloud shape
      const angle = Math.random() * Math.PI * 2;
      const u = Math.random();
      const v = Math.random();
      const r = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v) * 100;
      const px = x + Math.cos(angle) * r;
      const py = y + Math.sin(angle) * r;

      this.addParticle({
        x: px,
        y: py,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        color: colors[i % colors.length],
        size: 15 + Math.random() * 25,
        life: 250 + Math.random() * 150,
        shape: 'circle',
        mass: 0.4,
      });
    }
  }

  // =========================================================================
  // PARTICLE MANAGEMENT
  // =========================================================================

  /** Add a new particle */
  private addParticle(config: Partial<PhysicsParticle>): void {
    const id = this.particleIdCounter++;
    const particle: PhysicsParticle = {
      id,
      x: config.x ?? 0,
      y: config.y ?? 0,
      vx: config.vx ?? 0,
      vy: config.vy ?? 0,
      ax: 0,
      ay: 0,
      size: config.size ?? 8,
      rotation: Math.random() * Math.PI * 2,
      rotationVelocity: (Math.random() - 0.5) * 0.2,
      color: config.color ?? '#10b981',
      opacity: 1,
      life: config.life ?? 150,
      maxLife: config.life ?? 150,
      mass: config.mass ?? 1,
      shape: config.shape ?? 'square',
      trail: [],
      pulsePhase: config.pulsePhase ?? Math.random() * Math.PI * 2,
      spiralAngle: config.spiralAngle,
    };

    this.particles.set(id, particle);
  }

  /** Update particle physics */
  private updateParticle(particle: PhysicsParticle, dt: number): void {
    // Store trail
    if (this.trailLength > 0) {
      particle.trail.unshift({
        x: particle.x,
        y: particle.y,
        opacity: particle.opacity,
      });
      if (particle.trail.length > this.trailLength) {
        particle.trail.pop();
      }
    }

    // Reset acceleration
    particle.ax = 0;
    particle.ay = this.gravity * particle.mass;

    // Apply attractor forces
    for (const attractor of this.attractors) {
      const dx = attractor.x - particle.x;
      const dy = attractor.y - particle.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < attractor.radius && dist > 0.1) {
        const falloff = 1 - dist / attractor.radius;
        const forceMag =
          (attractor.strength * falloff * falloff) / (dist * dist + 100);

        switch (attractor.type) {
          case 'pull':
            particle.ax += (dx / dist) * forceMag;
            particle.ay += (dy / dist) * forceMag;
            break;
          case 'push':
            particle.ax -= (dx / dist) * forceMag;
            particle.ay -= (dy / dist) * forceMag;
            break;
          case 'orbit': {
            // Perpendicular force for orbital motion
            const perpX = -dy / dist;
            const perpY = dx / dist;
            particle.ax += perpX * forceMag * 0.7;
            particle.ay += perpY * forceMag * 0.7;
            // Plus weak pull to maintain orbit
            particle.ax += (dx / dist) * forceMag * 0.3;
            particle.ay += (dy / dist) * forceMag * 0.3;
            break;
          }
          case 'vortex': {
            // Strong perpendicular + pull for spiral
            const perpX = -dy / dist;
            const perpY = dx / dist;
            particle.ax += perpX * forceMag * 0.8;
            particle.ay += perpY * forceMag * 0.8;
            particle.ax += (dx / dist) * forceMag * 0.5;
            particle.ay += (dy / dist) * forceMag * 0.5;
            break;
          }
        }
      }
    }

    // Apply fluid velocity influence
    if (this.fluid && this.fluidInfluence > 0) {
      const gridX = particle.x / 20;
      const gridY = particle.y / 20;
      const fluidVel = this.fluid.getVelocity(gridX, gridY);
      particle.vx += fluidVel.x * this.fluidInfluence * dt;
      particle.vy += fluidVel.y * this.fluidInfluence * dt;
    }

    // Apply flow field influence
    if (this.flowField) {
      const flowVel = this.flowField.sample(particle.x, particle.y);
      particle.vx += flowVel.x * 0.1 * dt;
      particle.vy += flowVel.y * 0.1 * dt;
    }

    // Integrate velocity
    particle.vx += particle.ax * dt;
    particle.vy += particle.ay * dt;

    // Apply drag
    particle.vx *= this.drag;
    particle.vy *= this.drag;

    // Integrate position
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;

    // Update rotation
    particle.rotation += particle.rotationVelocity;

    // Update spiral angle if present
    if (particle.spiralAngle !== undefined) {
      particle.spiralAngle += 0.02;
    }

    // Update life and opacity
    particle.life -= dt;
    const lifeRatio = particle.life / particle.maxLife;
    particle.opacity = Math.min(1, lifeRatio * 2); // Fade out in last 50%

    // Pulse effect
    const pulseScale =
      1 + Math.sin(this.time * 0.1 + particle.pulsePhase) * 0.15;
    particle.size *=
      pulseScale /
      (pulseScale -
        0.15 * Math.sin(this.time * 0.1 + particle.pulsePhase - 0.1));
  }

  // =========================================================================
  // RENDERING
  // =========================================================================

  /** Render all particles */
  private render(): void {
    if (!this.ctx || !this.canvas) return;

    // Clear canvas
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // Draw constellation lines first (behind particles)
    this.drawConstellationLines();

    // Draw particles
    for (const particle of Array.from(this.particles.values())) {
      this.drawParticle(particle);
    }
  }

  /** Draw a single particle */
  private drawParticle(particle: PhysicsParticle): void {
    if (!this.ctx) return;

    const ctx = this.ctx;

    // Draw trail
    for (let i = 0; i < particle.trail.length; i++) {
      const trailPoint = particle.trail[i];
      const trailOpacity =
        trailPoint.opacity * (1 - i / particle.trail.length) * 0.3;
      const trailSize = particle.size * (1 - i / particle.trail.length) * 0.5;

      ctx.save();
      ctx.globalAlpha = trailOpacity;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(trailPoint.x, trailPoint.y, trailSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Draw main particle
    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation);

    ctx.fillStyle = particle.color;

    const pulseScale =
      1 + Math.sin(this.time * 0.1 + particle.pulsePhase) * 0.1;
    const size = particle.size * pulseScale;

    switch (particle.shape) {
      case 'square':
        ctx.fillRect(-size / 2, -size / 2, size, size);
        break;

      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'star':
        this.drawStar(ctx, 0, 0, 5, size / 2, size / 4);
        break;

      case 'heart':
        this.drawHeart(ctx, 0, 0, size);
        break;

      case 'hexagon':
        this.drawHexagon(ctx, 0, 0, size / 2);
        break;

      case 'spiral':
        this.drawSpiral(ctx, 0, 0, size / 2, particle.spiralAngle ?? 0);
        break;
    }

    ctx.restore();
  }

  /** Draw a star shape */
  private drawStar(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    spikes: number,
    outerRadius: number,
    innerRadius: number,
  ): void {
    let rot = (Math.PI / 2) * 3;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
      ctx.lineTo(
        cx + Math.cos(rot) * outerRadius,
        cy + Math.sin(rot) * outerRadius,
      );
      rot += step;
      ctx.lineTo(
        cx + Math.cos(rot) * innerRadius,
        cy + Math.sin(rot) * innerRadius,
      );
      rot += step;
    }

    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  }

  /** Draw a heart shape */
  private drawHeart(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    size: number,
  ): void {
    const s = size / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy + s * 0.3);
    ctx.bezierCurveTo(cx - s, cy - s * 0.5, cx - s, cy + s * 0.5, cx, cy + s);
    ctx.bezierCurveTo(
      cx + s,
      cy + s * 0.5,
      cx + s,
      cy - s * 0.5,
      cx,
      cy + s * 0.3,
    );
    ctx.fill();
  }

  /** Draw a hexagon shape */
  private drawHexagon(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    radius: number,
  ): void {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3 - Math.PI / 2;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fill();
  }

  /** Draw a spiral shape */
  private drawSpiral(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    radius: number,
    angle: number,
  ): void {
    ctx.beginPath();
    const turns = 2;
    const steps = 20;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const r = t * radius;
      const a = t * turns * Math.PI * 2 + angle;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.strokeStyle = ctx.fillStyle;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  /** Draw lines connecting nearby particles (for constellation effect) */
  private drawConstellationLines(): void {
    if (!this.ctx) return;

    const particles = Array.from(this.particles.values());
    const connectionDistance = 100;

    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.lineWidth = 1;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const opacity =
            (1 - dist / connectionDistance) *
            Math.min(p1.opacity, p2.opacity) *
            0.3;
          this.ctx.globalAlpha = opacity;
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }
    }

    this.ctx.globalAlpha = 1;
  }

  // =========================================================================
  // ANIMATION LOOP
  // =========================================================================

  /** Main animation loop */
  private animate = (): void => {
    const dt = 1; // Fixed timestep
    this.time += dt;

    // Update Lissajous attractors if present
    const lissajous = (
      this as unknown as {
        lissajous?: Array<{
          freqX: number;
          freqY: number;
          phaseX: number;
          phaseY: number;
        }>;
      }
    ).lissajous;
    if (lissajous && this.attractors.length >= 3) {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const amplitude = 150;

      for (let i = 0; i < Math.min(3, this.attractors.length); i++) {
        const params = lissajous[i];
        if (params) {
          this.attractors[i].x =
            centerX +
            Math.sin(this.time * 0.02 * params.freqX + params.phaseX) *
              amplitude;
          this.attractors[i].y =
            centerY +
            Math.sin(this.time * 0.02 * params.freqY + params.phaseY) *
              amplitude;
        }
      }
    }

    // Update fluid simulation
    if (this.fluid) {
      this.fluid.step(dt * 0.016);
    }

    // Update flow field
    if (this.flowField) {
      this.flowField.update(dt);
    }

    // Update particles
    const deadParticles: number[] = [];
    for (const particle of Array.from(this.particles.values())) {
      this.updateParticle(particle, dt);
      if (particle.life <= 0 || particle.opacity <= 0) {
        deadParticles.push(particle.id);
      }
    }

    // Remove dead particles
    for (const id of deadParticles) {
      this.particles.delete(id);
    }

    // Render
    this.render();

    // Continue animation if particles remain
    if (this.particles.size > 0 || this.attractors.length > 0) {
      this.animationId = requestAnimationFrame(this.animate);
    } else {
      this.animationId = null;
      // Clear Lissajous state
      delete (this as unknown as { lissajous?: unknown }).lissajous;
    }
  };

  // =========================================================================
  // UTILITIES
  // =========================================================================

  /** Get color palette for an emotion */
  private getColorsForEmotion(emotion?: string): string[] {
    if (emotion && EMOTION_PALETTES[emotion.toLowerCase()]) {
      return EMOTION_PALETTES[emotion.toLowerCase()];
    }
    return [...BRAND_COLORS.emerald, ...BRAND_COLORS.teal];
  }

  /** Clear all particles and effects */
  clear(): void {
    this.particles.clear();
    this.attractors = [];
    if (this.fluid) {
      this.fluid.clear();
    }
    if (this.flowField) {
      this.flowField.clear();
    }
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    delete (this as unknown as { lissajous?: unknown }).lissajous;
  }

  /** Destroy the engine */
  destroy(): void {
    this.clear();
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    this.canvas = null;
    this.ctx = null;
  }
}

/** Create singleton instance (lazy initialization) */
let physicsConfettiEngineInstance: PhysicsConfettiEngine | null = null;

export function getPhysicsConfettiEngine(): PhysicsConfettiEngine | null {
  if (typeof window === 'undefined') return null;
  if (!physicsConfettiEngineInstance) {
    physicsConfettiEngineInstance = new PhysicsConfettiEngine();
  }
  return physicsConfettiEngineInstance;
}

/** Legacy export for backwards compatibility */
export const physicsConfettiEngine =
  typeof window !== 'undefined' ? getPhysicsConfettiEngine() : null;
