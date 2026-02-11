/**
 * CelebrationService - Unified orchestrator for luxury celebrations
 *
 * Combines confetti, sound, and haptic feedback for immersive celebrations.
 * Designed for emotional wellness - celebrations feel rewarding, not overwhelming.
 */

import { ConfettiService, ConfettiType } from './ConfettiService';
import { HapticService, HapticPattern, HapticIntensity } from './HapticService';
import { SoundService, SoundType } from './SoundService';

export type CelebrationType =
  | 'tap' // Light interaction feedback
  | 'success' // Task/action completed
  | 'complete' // Something finished
  | 'achievement' // Major achievement unlocked
  | 'milestone' // Milestone reached (7 days, etc.)
  | 'streak' // Streak continued
  | 'streakMilestone' // Streak milestone (7, 30, 100 days)
  | 'levelUp' // Level/tier upgrade
  | 'unlock' // Feature unlocked
  | 'premium' // Premium upgrade
  | 'welcome' // Welcome/first time
  | 'breathingComplete' // Breathing exercise complete
  | 'journalSaved' // Journal entry saved
  | 'reflectionComplete' // Reflection complete
  | 'dailyCheckIn' // Daily check-in complete
  | 'weeklyReview' // Weekly review complete
  | 'error' // Error feedback
  | 'warning' // Warning feedback
  | 'radiance'; // Golden Ticket / Hall of Fame induction (ultimate celebration)

// Celebration configurations
export interface CelebrationConfig {
  confetti?: ConfettiType | null;
  sound?: SoundType | null;
  haptic?: HapticPattern | null;
  hapticIntensity?: HapticIntensity;
  delay?: number; // Delay between effects in ms
}

const CELEBRATION_CONFIGS: Record<CelebrationType, CelebrationConfig> = {
  tap: {
    confetti: null,
    sound: 'tap',
    haptic: 'tap',
    hapticIntensity: 'light',
  },

  success: {
    confetti: null,
    sound: 'success',
    haptic: 'success',
    hapticIntensity: 'medium',
  },

  complete: {
    confetti: 'sparkles',
    sound: 'complete',
    haptic: 'success',
    hapticIntensity: 'medium',
  },

  achievement: {
    confetti: 'achievement',
    sound: 'milestone',
    haptic: 'milestone',
    hapticIntensity: 'strong',
  },

  milestone: {
    confetti: 'milestone',
    sound: 'milestone',
    haptic: 'milestone',
    hapticIntensity: 'strong',
  },

  streak: {
    confetti: 'burst',
    sound: 'streak',
    haptic: 'streak',
    hapticIntensity: 'medium',
  },

  streakMilestone: {
    confetti: 'streak',
    sound: 'celebration',
    haptic: 'celebration',
    hapticIntensity: 'strong',
  },

  levelUp: {
    confetti: 'levelUp',
    sound: 'levelUp',
    haptic: 'levelUp',
    hapticIntensity: 'strong',
  },

  unlock: {
    confetti: 'stars',
    sound: 'unlock',
    haptic: 'unlock',
    hapticIntensity: 'strong',
  },

  premium: {
    confetti: 'premium',
    sound: 'celebration',
    haptic: 'celebration',
    hapticIntensity: 'strong',
  },

  welcome: {
    confetti: 'welcome',
    sound: 'success',
    haptic: 'success',
    hapticIntensity: 'medium',
  },

  breathingComplete: {
    confetti: 'sparkles',
    sound: 'complete',
    haptic: 'success',
    hapticIntensity: 'light',
  },

  journalSaved: {
    confetti: null,
    sound: 'complete',
    haptic: 'success',
    hapticIntensity: 'light',
  },

  reflectionComplete: {
    confetti: 'sparkles',
    sound: 'success',
    haptic: 'success',
    hapticIntensity: 'medium',
  },

  dailyCheckIn: {
    confetti: 'burst',
    sound: 'success',
    haptic: 'success',
    hapticIntensity: 'medium',
  },

  weeklyReview: {
    confetti: 'stars',
    sound: 'milestone',
    haptic: 'milestone',
    hapticIntensity: 'strong',
  },

  error: {
    confetti: null,
    sound: 'error',
    haptic: 'error',
    hapticIntensity: 'medium',
  },

  warning: {
    confetti: null,
    sound: 'warning',
    haptic: 'warning',
    hapticIntensity: 'light',
  },

  radiance: {
    // Multi-phase celebration - triggers supernova initially
    // Full radiance sequence handled by celebrateRadiance() method
    confetti: 'premium', // Fallback if single-phase
    sound: 'celebration',
    haptic: 'celebration',
    hapticIntensity: 'strong',
  },
};

// User preference keys for localStorage
const STORAGE_KEYS = {
  soundEnabled: 'celebration_sound_enabled',
  hapticEnabled: 'celebration_haptic_enabled',
  confettiEnabled: 'celebration_confetti_enabled',
  volume: 'celebration_volume',
};

class CelebrationServiceClass {
  private initialized = false;

  constructor() {
    // Load preferences on init
    if (typeof window !== 'undefined') {
      this.loadPreferences();
    }
  }

  /**
   * Load user preferences from localStorage
   */
  private loadPreferences(): void {
    try {
      const soundEnabled = localStorage.getItem(STORAGE_KEYS.soundEnabled);
      const hapticEnabled = localStorage.getItem(STORAGE_KEYS.hapticEnabled);
      const confettiEnabled = localStorage.getItem(
        STORAGE_KEYS.confettiEnabled,
      );
      const volume = localStorage.getItem(STORAGE_KEYS.volume);

      if (soundEnabled !== null) {
        SoundService.setEnabled(soundEnabled === 'true');
      }
      if (hapticEnabled !== null) {
        HapticService.setEnabled(hapticEnabled === 'true');
      }
      if (confettiEnabled !== null) {
        ConfettiService.setEnabled(confettiEnabled === 'true');
      }
      if (volume !== null) {
        SoundService.setVolume(parseFloat(volume));
      }

      this.initialized = true;
    } catch {
      // localStorage not available
    }
  }

  /**
   * Save user preferences to localStorage
   */
  private savePreferences(): void {
    try {
      localStorage.setItem(
        STORAGE_KEYS.soundEnabled,
        SoundService.isEnabled().toString(),
      );
      localStorage.setItem(
        STORAGE_KEYS.hapticEnabled,
        HapticService.isEnabled().toString(),
      );
      localStorage.setItem(
        STORAGE_KEYS.confettiEnabled,
        ConfettiService.isEnabled().toString(),
      );
      localStorage.setItem(
        STORAGE_KEYS.volume,
        SoundService.getVolume().toString(),
      );
    } catch {
      // localStorage not available
    }
  }

  /**
   * Trigger a celebration by type
   */
  celebrate(type: CelebrationType): void {
    const config = CELEBRATION_CONFIGS[type];
    if (!config) return;

    // Trigger all effects simultaneously for immediate feedback
    if (config.haptic) {
      HapticService.vibrate(config.haptic, config.hapticIntensity);
    }

    if (config.sound) {
      SoundService.play(config.sound);
    }

    if (config.confetti) {
      ConfettiService.celebrate(config.confetti);
    }
  }

  /**
   * Trigger a custom celebration
   */
  custom(config: CelebrationConfig): void {
    if (config.haptic) {
      HapticService.vibrate(config.haptic, config.hapticIntensity);
    }

    if (config.sound) {
      SoundService.play(config.sound);
    }

    if (config.confetti) {
      ConfettiService.celebrate(config.confetti);
    }
  }

  /**
   * Celebrate a streak milestone
   */
  celebrateStreak(days: number): void {
    if (days === 1) {
      this.celebrate('dailyCheckIn');
    } else if (days === 7 || days === 30 || days === 100 || days === 365) {
      this.celebrate('streakMilestone');
    } else {
      this.celebrate('streak');
    }
  }

  // Settings methods

  /**
   * Enable/disable sound effects
   */
  setSoundEnabled(enabled: boolean): void {
    SoundService.setEnabled(enabled);
    this.savePreferences();
  }

  /**
   * Enable/disable haptic feedback
   */
  setHapticEnabled(enabled: boolean): void {
    HapticService.setEnabled(enabled);
    this.savePreferences();
  }

  /**
   * Enable/disable confetti
   */
  setConfettiEnabled(enabled: boolean): void {
    ConfettiService.setEnabled(enabled);
    this.savePreferences();
  }

  /**
   * Set master volume (0-1)
   */
  setVolume(volume: number): void {
    SoundService.setVolume(volume);
    this.savePreferences();
  }

  /**
   * Get current settings
   */
  getSettings(): {
    soundEnabled: boolean;
    hapticEnabled: boolean;
    confettiEnabled: boolean;
    volume: number;
    hapticSupported: boolean;
    soundSupported: boolean;
  } {
    return {
      soundEnabled: SoundService.isEnabled(),
      hapticEnabled: HapticService.isEnabled(),
      confettiEnabled: ConfettiService.isEnabled(),
      volume: SoundService.getVolume(),
      hapticSupported: HapticService.isSupported(),
      soundSupported: SoundService.isSupported(),
    };
  }

  /**
   * Enable all celebration features
   */
  enableAll(): void {
    SoundService.setEnabled(true);
    HapticService.setEnabled(true);
    ConfettiService.setEnabled(true);
    this.savePreferences();
  }

  /**
   * Disable all celebration features
   */
  disableAll(): void {
    SoundService.setEnabled(false);
    HapticService.setEnabled(false);
    ConfettiService.setEnabled(false);
    this.savePreferences();
  }

  // Convenience methods for common celebrations

  /** Light tap feedback */
  tap(): void {
    this.celebrate('tap');
  }

  /** Success feedback */
  success(): void {
    this.celebrate('success');
  }

  /** Completion celebration */
  complete(): void {
    this.celebrate('complete');
  }

  /** Achievement unlocked */
  achievement(): void {
    this.celebrate('achievement');
  }

  /** Milestone reached */
  milestone(): void {
    this.celebrate('milestone');
  }

  /** Level up celebration */
  levelUp(): void {
    this.celebrate('levelUp');
  }

  /** Feature unlocked */
  unlock(): void {
    this.celebrate('unlock');
  }

  /** Premium upgrade celebration */
  premium(): void {
    this.celebrate('premium');
  }

  /** Welcome celebration */
  welcome(): void {
    this.celebrate('welcome');
  }

  /** Error feedback */
  error(): void {
    this.celebrate('error');
  }

  /** Warning feedback */
  warning(): void {
    this.celebrate('warning');
  }

  /**
   * Ultimate Radiance celebration - multi-phase sequence for Golden Ticket acceptance
   * Phase 1 (0-2s): Supernova explosion with strong haptic
   * Phase 2 (2-5s): Aurora flowing ribbons
   * Phase 3 (5-8s): Constellation pattern forming radiance symbol
   *
   * @param onPhaseChange - Optional callback for UI to sync with phases
   */
  celebrateRadiance(
    onPhaseChange?: (phase: number, name: string) => void,
  ): void {
    // Gold/purple triumph colors for radiance
    const triumphColors = [
      '#a855f7',
      '#c084fc',
      '#d8b4fe',
      '#fbbf24',
      '#fcd34d',
    ];
    const wonderColors = [
      '#0ea5e9',
      '#38bdf8',
      '#7dd3fc',
      '#bae6fd',
      '#a855f7',
    ];
    const constellationColors = ['#fbbf24', '#fcd34d', '#a855f7', '#c084fc'];

    // Phase 1: Immediate Impact (0-2s)
    onPhaseChange?.(1, 'supernova');
    HapticService.vibrate('celebration', 'strong');
    SoundService.play('celebration');
    ConfettiService.celebratePhysics({
      type: 'supernova',
      colors: triumphColors,
      intensity: 1.0,
    });

    // Phase 2: Sustained Glory (2-5s)
    setTimeout(() => {
      onPhaseChange?.(2, 'aurora');
      HapticService.vibrate('milestone', 'medium');
      SoundService.play('milestone');
      ConfettiService.celebratePhysics({
        type: 'aurora',
        colors: wonderColors,
        intensity: 0.8,
      });
    }, 2000);

    // Phase 3: Resolution (5-8s)
    setTimeout(() => {
      onPhaseChange?.(3, 'constellation');
      HapticService.vibrate('success', 'light');
      SoundService.play('success');
      ConfettiService.celebratePhysics({
        type: 'constellation',
        colors: constellationColors,
        intensity: 0.6,
      });
    }, 5000);

    // Complete
    setTimeout(() => {
      onPhaseChange?.(0, 'complete');
    }, 8000);
  }

  /** Radiance / Hall of Fame induction celebration */
  radiance(): void {
    this.celebrateRadiance();
  }
}

// Singleton instance
export const CelebrationService = new CelebrationServiceClass();
