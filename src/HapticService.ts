/**
 * HapticService - Luxury haptic feedback using the Web Vibration API
 *
 * Provides tactile feedback patterns for different user interactions and celebrations.
 * Falls back gracefully on devices that don't support vibration.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API
 */

export type HapticPattern =
  | 'tap' // Light single tap
  | 'doubleTap' // Quick double tap
  | 'success' // Satisfying success pattern
  | 'celebration' // Exciting celebration burst
  | 'milestone' // Achievement unlocked
  | 'streak' // Streak continuation
  | 'warning' // Gentle warning
  | 'error' // Error feedback
  | 'heartbeat' // Calming heartbeat rhythm
  | 'breatheIn' // Breathing exercise - inhale
  | 'breatheOut' // Breathing exercise - exhale
  | 'selection' // Item selected
  | 'notification' // New notification
  | 'unlock' // Feature unlocked
  | 'levelUp'; // Level up / upgrade

export type HapticIntensity = 'light' | 'medium' | 'strong';

// Vibration patterns in milliseconds [vibrate, pause, vibrate, pause, ...]
const HAPTIC_PATTERNS: Record<HapticPattern, number | number[]> = {
  // Basic interactions
  tap: 10,
  doubleTap: [10, 50, 10],
  selection: [5, 30, 5],

  // Success patterns
  success: [20, 50, 40], // Short-pause-longer = satisfying crescendo
  celebration: [30, 30, 30, 30, 50, 50, 80], // Building excitement burst
  milestone: [50, 100, 50, 100, 100, 50, 150], // Grand achievement
  streak: [20, 40, 20, 40, 20, 40, 60], // Rapid fire excitement
  unlock: [100, 50, 30, 50, 30, 50, 30], // Unlocking sensation
  levelUp: [50, 50, 50, 50, 100, 100, 200], // Ascending power

  // Feedback patterns
  warning: [30, 100, 30],
  error: [100, 50, 100, 50, 100],
  notification: [20, 80, 20],

  // Wellness patterns - gentle and calming
  heartbeat: [100, 100, 100, 400], // Lub-dub... pause
  breatheIn: [20, 50, 30, 50, 40, 50, 50, 50, 60], // Gradually intensifying
  breatheOut: [60, 50, 50, 50, 40, 50, 30, 50, 20], // Gradually fading
};

// Intensity multipliers
const INTENSITY_MULTIPLIERS: Record<HapticIntensity, number> = {
  light: 0.5,
  medium: 1,
  strong: 1.5,
};

class HapticServiceClass {
  private enabled = true;
  private supported = false;

  constructor() {
    // Check if Vibration API is supported
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      this.supported = true;
    }
  }

  /**
   * Check if haptic feedback is available on this device
   */
  isSupported(): boolean {
    return this.supported;
  }

  /**
   * Enable or disable haptic feedback globally
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Check if haptic feedback is currently enabled
   */
  isEnabled(): boolean {
    return this.enabled && this.supported;
  }

  /**
   * Apply intensity multiplier to a pattern
   */
  private applyIntensity(
    pattern: number | number[],
    intensity: HapticIntensity,
  ): number | number[] {
    const multiplier = INTENSITY_MULTIPLIERS[intensity];

    if (typeof pattern === 'number') {
      return Math.round(pattern * multiplier);
    }

    return pattern.map((value, index) => {
      // Only multiply vibration durations (even indices), not pauses (odd indices)
      if (index % 2 === 0) {
        return Math.round(value * multiplier);
      }
      return value;
    });
  }

  /**
   * Trigger a haptic pattern
   */
  vibrate(
    pattern: HapticPattern,
    intensity: HapticIntensity = 'medium',
  ): boolean {
    if (!this.isEnabled()) {
      return false;
    }

    try {
      const basePattern = HAPTIC_PATTERNS[pattern];
      const adjustedPattern = this.applyIntensity(basePattern, intensity);
      return navigator.vibrate(adjustedPattern);
    } catch {
      // Silently fail if vibration not available
      return false;
    }
  }

  /**
   * Trigger a custom vibration pattern
   */
  vibrateCustom(pattern: number | number[]): boolean {
    if (!this.isEnabled()) {
      return false;
    }

    try {
      return navigator.vibrate(pattern);
    } catch {
      return false;
    }
  }

  /**
   * Stop any ongoing vibration
   */
  stop(): boolean {
    if (!this.supported) {
      return false;
    }

    try {
      return navigator.vibrate(0);
    } catch {
      return false;
    }
  }

  // Convenience methods for common patterns

  /** Light tap for button presses */
  tap(intensity: HapticIntensity = 'light'): boolean {
    return this.vibrate('tap', intensity);
  }

  /** Selection feedback */
  select(intensity: HapticIntensity = 'light'): boolean {
    return this.vibrate('selection', intensity);
  }

  /** Success feedback - task completed */
  success(intensity: HapticIntensity = 'medium'): boolean {
    return this.vibrate('success', intensity);
  }

  /** Celebration - major achievement */
  celebrate(intensity: HapticIntensity = 'strong'): boolean {
    return this.vibrate('celebration', intensity);
  }

  /** Milestone reached */
  milestone(intensity: HapticIntensity = 'strong'): boolean {
    return this.vibrate('milestone', intensity);
  }

  /** Streak continuation */
  streak(intensity: HapticIntensity = 'medium'): boolean {
    return this.vibrate('streak', intensity);
  }

  /** Warning feedback */
  warn(intensity: HapticIntensity = 'medium'): boolean {
    return this.vibrate('warning', intensity);
  }

  /** Error feedback */
  error(intensity: HapticIntensity = 'strong'): boolean {
    return this.vibrate('error', intensity);
  }

  /** Notification received */
  notify(intensity: HapticIntensity = 'light'): boolean {
    return this.vibrate('notification', intensity);
  }

  /** Feature unlocked */
  unlock(intensity: HapticIntensity = 'strong'): boolean {
    return this.vibrate('unlock', intensity);
  }

  /** Level up / upgrade */
  levelUp(intensity: HapticIntensity = 'strong'): boolean {
    return this.vibrate('levelUp', intensity);
  }

  /** Calming heartbeat for relaxation */
  heartbeat(intensity: HapticIntensity = 'light'): boolean {
    return this.vibrate('heartbeat', intensity);
  }

  /** Breathing exercise - inhale */
  breatheIn(intensity: HapticIntensity = 'light'): boolean {
    return this.vibrate('breatheIn', intensity);
  }

  /** Breathing exercise - exhale */
  breatheOut(intensity: HapticIntensity = 'light'): boolean {
    return this.vibrate('breatheOut', intensity);
  }

  /**
   * Breathing cycle - vibrates in sync with breath timing
   * @param inhaleMs - Duration of inhale in milliseconds
   * @param holdMs - Duration of hold in milliseconds
   * @param exhaleMs - Duration of exhale in milliseconds
   */
  breathingCycle(inhaleMs: number, holdMs: number, exhaleMs: number): void {
    if (!this.isEnabled()) return;

    // Inhale: gradual build
    this.breatheIn();

    // Hold: gentle pulse at peak
    setTimeout(() => {
      this.vibrateCustom([30, 200, 30]);
    }, inhaleMs);

    // Exhale: gradual fade
    setTimeout(() => {
      this.breatheOut();
    }, inhaleMs + holdMs);
  }
}

// Singleton instance
export const HapticService = new HapticServiceClass();
