/**
 * @affectively/confetti-physics
 *
 * Physics-based confetti celebrations with fluid dynamics, haptic feedback, and procedural audio.
 *
 * @example
 * ```typescript
 * import { CelebrationService, ConfettiService, SoundService, HapticService } from '@affectively/confetti-physics';
 *
 * // Quick celebration
 * CelebrationService.celebrate('achievement');
 *
 * // Physics-based confetti
 * ConfettiService.supernova();
 * ConfettiService.aurora();
 * ConfettiService.vortex();
 *
 * // Emotion-aware celebration
 * ConfettiService.celebrateEmotion({
 *   emotion: 'joy',
 *   valence: 0.8,
 *   arousal: 0.7
 * });
 *
 * // Individual services
 * SoundService.success();
 * HapticService.celebrate();
 * ```
 */

// Main orchestrator
export {
  CelebrationService,
  type CelebrationType,
  type CelebrationConfig,
} from './CelebrationService';

// Confetti service (classic + physics)
export { ConfettiService, type ConfettiType } from './ConfettiService';

// Physics engine
export {
  PhysicsConfettiEngine,
  getPhysicsConfettiEngine,
  physicsConfettiEngine,
  type PhysicsCelebrationType,
  type PhysicsCelebrationConfig,
  BRAND_COLORS,
} from './PhysicsConfettiEngine';

// Sound service
export { SoundService, type SoundType } from './SoundService';

// Haptic service
export {
  HapticService,
  type HapticPattern,
  type HapticIntensity,
} from './HapticService';
