# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-25

### Added

- Initial release
- **PhysicsConfettiEngine**: Advanced physics-based confetti using hexgrid-3d math
  - Fluid dynamics with Navier-Stokes simulation
  - Flow fields with streamlines
  - Particle attractors (pull, push, orbit, vortex)
  - 12 physics celebration types: vortex, supernova, aurora, resonance, orbit, cascade, emergence, harmony, helix, bloom, constellation, nebula
  - Emotion-aware color palettes
  - Biometric sync (heart rate)
  - Accessibility support (prefers-reduced-motion)
- **ConfettiService**: Classic confetti effects using canvas-confetti
  - 12 classic celebration types: burst, shower, fireworks, sparkles, stars, hearts, achievement, streak, milestone, levelUp, welcome, premium
  - Seamless integration with physics engine
  - Brand color palettes
- **SoundService**: Procedural audio via Web Audio API
  - 14 sound types for different interactions
  - ADSR envelope system
  - Musical note frequencies
  - Volume control
- **HapticService**: Tactile feedback via Web Vibration API
  - 15 haptic patterns
  - Three intensity levels (light, medium, strong)
  - Breathing exercise support
- **CelebrationService**: Unified orchestrator
  - Combines confetti, sound, and haptic
  - 17 celebration types
  - User preference persistence
- **React Hooks**:
  - `useCelebration` - Main celebration hook
  - `useConfetti` - Confetti control
  - `usePhysicsConfetti` - Physics engine control
  - `useSound` - Audio feedback
  - `useHaptic` - Tactile feedback
  - `useInteractionFeedback` - Button feedback
  - `useBreathingFeedback` - Breathing exercises
  - `useStreakCelebration` - Streak milestones
