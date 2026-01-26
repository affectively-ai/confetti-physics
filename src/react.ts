/**
 * React hooks for @affectively/confetti-physics
 *
 * @example
 * ```tsx
 * import { useCelebration, useConfetti, usePhysicsConfetti } from '@affectively/confetti-physics/react';
 *
 * function MyComponent() {
 *   const { celebrate, success, milestone } = useCelebration();
 *   const confetti = useConfetti();
 *
 *   return (
 *     <button onClick={() => celebrate('achievement')}>
 *       Unlock Achievement
 *     </button>
 *   );
 * }
 * ```
 */

import { useCallback, useState } from 'react';
import {
  CelebrationService,
  type CelebrationType,
  type CelebrationConfig,
} from './CelebrationService';
import {
  HapticService,
  type HapticPattern,
  type HapticIntensity,
} from './HapticService';
import { SoundService, type SoundType } from './SoundService';
import { ConfettiService, type ConfettiType } from './ConfettiService';
import {
  getPhysicsConfettiEngine,
  type PhysicsCelebrationType,
  type PhysicsCelebrationConfig,
} from './PhysicsConfettiEngine';

/**
 * Main celebration hook - provides all celebration functionality
 */
export function useCelebration() {
  const [settings, setSettings] = useState(() =>
    CelebrationService.getSettings()
  );

  // Update settings when they change
  const refreshSettings = useCallback(() => {
    setSettings(CelebrationService.getSettings());
  }, []);

  // Celebration triggers
  const celebrate = useCallback((type: CelebrationType) => {
    CelebrationService.celebrate(type);
  }, []);

  const celebrateCustom = useCallback((config: CelebrationConfig) => {
    CelebrationService.custom(config);
  }, []);

  const celebrateStreak = useCallback((days: number) => {
    CelebrationService.celebrateStreak(days);
  }, []);

  // Settings controls
  const setSoundEnabled = useCallback(
    (enabled: boolean) => {
      CelebrationService.setSoundEnabled(enabled);
      refreshSettings();
    },
    [refreshSettings]
  );

  const setHapticEnabled = useCallback(
    (enabled: boolean) => {
      CelebrationService.setHapticEnabled(enabled);
      refreshSettings();
    },
    [refreshSettings]
  );

  const setConfettiEnabled = useCallback(
    (enabled: boolean) => {
      CelebrationService.setConfettiEnabled(enabled);
      refreshSettings();
    },
    [refreshSettings]
  );

  const setVolume = useCallback(
    (volume: number) => {
      CelebrationService.setVolume(volume);
      refreshSettings();
    },
    [refreshSettings]
  );

  // Convenience methods
  const tap = useCallback(() => CelebrationService.tap(), []);
  const success = useCallback(() => CelebrationService.success(), []);
  const complete = useCallback(() => CelebrationService.complete(), []);
  const achievement = useCallback(() => CelebrationService.achievement(), []);
  const milestone = useCallback(() => CelebrationService.milestone(), []);
  const levelUp = useCallback(() => CelebrationService.levelUp(), []);
  const unlock = useCallback(() => CelebrationService.unlock(), []);
  const premium = useCallback(() => CelebrationService.premium(), []);
  const welcome = useCallback(() => CelebrationService.welcome(), []);
  const error = useCallback(() => CelebrationService.error(), []);
  const warning = useCallback(() => CelebrationService.warning(), []);

  return {
    // Core methods
    celebrate,
    celebrateCustom,
    celebrateStreak,

    // Convenience methods
    tap,
    success,
    complete,
    achievement,
    milestone,
    levelUp,
    unlock,
    premium,
    welcome,
    error,
    warning,

    // Settings
    settings,
    setSoundEnabled,
    setHapticEnabled,
    setConfettiEnabled,
    setVolume,
  };
}

/**
 * Haptic feedback hook - for tactile interactions
 */
export function useHaptic() {
  const [enabled, setEnabledState] = useState(() => HapticService.isEnabled());
  const [supported] = useState(() => HapticService.isSupported());

  const vibrate = useCallback(
    (pattern: HapticPattern, intensity?: HapticIntensity) => {
      return HapticService.vibrate(pattern, intensity);
    },
    []
  );

  const setEnabled = useCallback((value: boolean) => {
    HapticService.setEnabled(value);
    setEnabledState(value);
  }, []);

  // Convenience methods
  const tap = useCallback(
    (intensity?: HapticIntensity) => HapticService.tap(intensity),
    []
  );
  const select = useCallback(
    (intensity?: HapticIntensity) => HapticService.select(intensity),
    []
  );
  const success = useCallback(
    (intensity?: HapticIntensity) => HapticService.success(intensity),
    []
  );
  const celebrate = useCallback(
    (intensity?: HapticIntensity) => HapticService.celebrate(intensity),
    []
  );
  const milestone = useCallback(
    (intensity?: HapticIntensity) => HapticService.milestone(intensity),
    []
  );
  const notify = useCallback(
    (intensity?: HapticIntensity) => HapticService.notify(intensity),
    []
  );
  const error = useCallback(
    (intensity?: HapticIntensity) => HapticService.error(intensity),
    []
  );
  const heartbeat = useCallback(
    (intensity?: HapticIntensity) => HapticService.heartbeat(intensity),
    []
  );
  const breatheIn = useCallback(
    (intensity?: HapticIntensity) => HapticService.breatheIn(intensity),
    []
  );
  const breatheOut = useCallback(
    (intensity?: HapticIntensity) => HapticService.breatheOut(intensity),
    []
  );

  return {
    vibrate,
    enabled,
    supported,
    setEnabled,
    stop: HapticService.stop.bind(HapticService),
    tap,
    select,
    success,
    celebrate,
    milestone,
    notify,
    error,
    heartbeat,
    breatheIn,
    breatheOut,
  };
}

/**
 * Sound hook - for audio feedback
 */
export function useSound() {
  const [enabled, setEnabledState] = useState(() => SoundService.isEnabled());
  const [volume, setVolumeState] = useState(() => SoundService.getVolume());
  const [supported] = useState(() => SoundService.isSupported());

  const play = useCallback((type: SoundType) => {
    SoundService.play(type);
  }, []);

  const setEnabled = useCallback((value: boolean) => {
    SoundService.setEnabled(value);
    setEnabledState(value);
  }, []);

  const setVolume = useCallback((value: number) => {
    SoundService.setVolume(value);
    setVolumeState(value);
  }, []);

  // Convenience methods
  const tap = useCallback(() => SoundService.tap(), []);
  const success = useCallback(() => SoundService.success(), []);
  const celebrate = useCallback(() => SoundService.celebrate(), []);
  const milestone = useCallback(() => SoundService.milestone(), []);
  const notify = useCallback(() => SoundService.notify(), []);
  const complete = useCallback(() => SoundService.complete(), []);
  const error = useCallback(() => SoundService.error(), []);
  const warn = useCallback(() => SoundService.warn(), []);

  return {
    play,
    enabled,
    supported,
    volume,
    setEnabled,
    setVolume,
    tap,
    success,
    celebrate,
    milestone,
    notify,
    complete,
    error,
    warn,
  };
}

/**
 * Confetti hook - for visual celebrations (classic + physics)
 */
export function useConfetti() {
  const [enabled, setEnabledState] = useState(() =>
    ConfettiService.isEnabled()
  );
  const [physicsEnabled, setPhysicsEnabledState] = useState(() =>
    ConfettiService.isPhysicsEnabled()
  );

  const celebrate = useCallback((type: ConfettiType) => {
    ConfettiService.celebrate(type);
  }, []);

  const celebratePhysics = useCallback((config: PhysicsCelebrationConfig) => {
    ConfettiService.celebratePhysics(config);
  }, []);

  const celebrateEmotion = useCallback(
    (config: {
      emotion: string;
      intensity?: number;
      valence?: number;
      arousal?: number;
      heartRate?: number;
    }) => {
      ConfettiService.celebrateEmotion(config);
    },
    []
  );

  const setEnabled = useCallback((value: boolean) => {
    ConfettiService.setEnabled(value);
    setEnabledState(value);
  }, []);

  const setPreferPhysics = useCallback((value: boolean) => {
    ConfettiService.setPreferPhysics(value);
    setPhysicsEnabledState(value);
  }, []);

  const fromElement = useCallback(
    (element: HTMLElement, type?: ConfettiType) => {
      ConfettiService.fromElement(element, type);
    },
    []
  );

  // Classic celebration methods
  const burst = useCallback(() => ConfettiService.burst(), []);
  const shower = useCallback(() => ConfettiService.shower(), []);
  const fireworks = useCallback(() => ConfettiService.fireworks(), []);
  const sparkles = useCallback(() => ConfettiService.sparkles(), []);
  const stars = useCallback(() => ConfettiService.stars(), []);
  const hearts = useCallback(() => ConfettiService.hearts(), []);
  const achievement = useCallback(() => ConfettiService.achievement(), []);
  const streak = useCallback(() => ConfettiService.streak(), []);
  const milestone = useCallback(() => ConfettiService.milestone(), []);
  const levelUp = useCallback(() => ConfettiService.levelUp(), []);
  const welcome = useCallback(() => ConfettiService.welcome(), []);
  const premium = useCallback(() => ConfettiService.premium(), []);
  const reset = useCallback(() => ConfettiService.reset(), []);

  // Physics-based celebration methods
  const vortex = useCallback(() => ConfettiService.vortex(), []);
  const supernova = useCallback(() => ConfettiService.supernova(), []);
  const aurora = useCallback(() => ConfettiService.aurora(), []);
  const resonance = useCallback(
    (heartRate?: number) => ConfettiService.resonance(heartRate),
    []
  );
  const orbit = useCallback(() => ConfettiService.orbit(), []);
  const cascade = useCallback(() => ConfettiService.cascade(), []);
  const emergence = useCallback(() => ConfettiService.emergence(), []);
  const harmony = useCallback(() => ConfettiService.harmony(), []);
  const helix = useCallback(() => ConfettiService.helix(), []);
  const bloom = useCallback(() => ConfettiService.bloom(), []);
  const constellation = useCallback(() => ConfettiService.constellation(), []);
  const nebula = useCallback(() => ConfettiService.nebula(), []);

  return {
    // Core methods
    celebrate,
    celebratePhysics,
    celebrateEmotion,
    enabled,
    physicsEnabled,
    setEnabled,
    setPreferPhysics,
    fromElement,
    reset,

    // Classic effects
    burst,
    shower,
    fireworks,
    sparkles,
    stars,
    hearts,
    achievement,
    streak,
    milestone,
    levelUp,
    welcome,
    premium,

    // Physics effects (clever math!)
    vortex,
    supernova,
    aurora,
    resonance,
    orbit,
    cascade,
    emergence,
    harmony,
    helix,
    bloom,
    constellation,
    nebula,
  };
}

/**
 * Physics-based confetti hook - direct access to PhysicsConfettiEngine
 *
 * Use this when you need fine-grained control over physics celebrations,
 * such as providing emotion context, heart rate for resonance, or custom origins.
 */
export function usePhysicsConfetti() {
  const engine = getPhysicsConfettiEngine();
  const [enabled, setEnabled] = useState(() => engine?.isEnabled() ?? false);

  const celebrate = useCallback((config: PhysicsCelebrationConfig) => {
    const e = getPhysicsConfettiEngine();
    if (e) {
      e.celebrate(config);
    }
  }, []);

  const celebrateWithEmotion = useCallback(
    (
      type: PhysicsCelebrationType,
      emotion: {
        name: string;
        valence?: number;
        arousal?: number;
      },
      options?: {
        origin?: { x: number; y: number };
        count?: number;
        intensity?: number;
        heartRate?: number;
      }
    ) => {
      const e = getPhysicsConfettiEngine();
      if (e) {
        e.celebrate({
          type,
          origin: options?.origin,
          count: options?.count,
          intensity: options?.intensity,
          heartRate: options?.heartRate,
          emotionContext: {
            valence: emotion.valence ?? 0,
            arousal: emotion.arousal ?? 0.5,
            dominantEmotion: emotion.name,
          },
        });
      }
    },
    []
  );

  const clear = useCallback(() => {
    const e = getPhysicsConfettiEngine();
    if (e) {
      e.clear();
    }
  }, []);

  const setPhysicsEnabled = useCallback((value: boolean) => {
    const e = getPhysicsConfettiEngine();
    if (e) {
      e.setEnabled(value);
      setEnabled(value);
    }
  }, []);

  // Quick access methods for each type
  const vortex = useCallback(
    (config?: Partial<PhysicsCelebrationConfig>) =>
      celebrate({ type: 'vortex', ...config }),
    [celebrate]
  );
  const supernova = useCallback(
    (config?: Partial<PhysicsCelebrationConfig>) =>
      celebrate({ type: 'supernova', ...config }),
    [celebrate]
  );
  const aurora = useCallback(
    (config?: Partial<PhysicsCelebrationConfig>) =>
      celebrate({ type: 'aurora', ...config }),
    [celebrate]
  );
  const resonance = useCallback(
    (heartRate: number, config?: Partial<PhysicsCelebrationConfig>) =>
      celebrate({ type: 'resonance', heartRate, ...config }),
    [celebrate]
  );
  const orbit = useCallback(
    (config?: Partial<PhysicsCelebrationConfig>) =>
      celebrate({ type: 'orbit', ...config }),
    [celebrate]
  );
  const cascade = useCallback(
    (config?: Partial<PhysicsCelebrationConfig>) =>
      celebrate({ type: 'cascade', ...config }),
    [celebrate]
  );
  const emergence = useCallback(
    (config?: Partial<PhysicsCelebrationConfig>) =>
      celebrate({ type: 'emergence', ...config }),
    [celebrate]
  );
  const harmony = useCallback(
    (config?: Partial<PhysicsCelebrationConfig>) =>
      celebrate({ type: 'harmony', ...config }),
    [celebrate]
  );
  const helix = useCallback(
    (config?: Partial<PhysicsCelebrationConfig>) =>
      celebrate({ type: 'helix', ...config }),
    [celebrate]
  );
  const bloom = useCallback(
    (config?: Partial<PhysicsCelebrationConfig>) =>
      celebrate({ type: 'bloom', ...config }),
    [celebrate]
  );
  const constellation = useCallback(
    (config?: Partial<PhysicsCelebrationConfig>) =>
      celebrate({ type: 'constellation', ...config }),
    [celebrate]
  );
  const nebula = useCallback(
    (config?: Partial<PhysicsCelebrationConfig>) =>
      celebrate({ type: 'nebula', ...config }),
    [celebrate]
  );

  return {
    // Core methods
    celebrate,
    celebrateWithEmotion,
    clear,
    enabled,
    setEnabled: setPhysicsEnabled,
    isAvailable: engine !== null,

    // Effect methods with optional config
    vortex,
    supernova,
    aurora,
    resonance,
    orbit,
    cascade,
    emergence,
    harmony,
    helix,
    bloom,
    constellation,
    nebula,
  };
}

/**
 * Hook for button/interaction feedback
 * Provides a simple way to add tactile + audio feedback to interactions
 */
export function useInteractionFeedback() {
  const { tap: hapticTap } = useHaptic();
  const { tap: soundTap } = useSound();

  const onPress = useCallback(() => {
    hapticTap('light');
    soundTap();
  }, [hapticTap, soundTap]);

  const onSuccess = useCallback(() => {
    HapticService.success();
    SoundService.success();
  }, []);

  const onError = useCallback(() => {
    HapticService.error();
    SoundService.error();
  }, []);

  return {
    onPress,
    onSuccess,
    onError,
  };
}

/**
 * Hook for breathing exercise feedback
 */
export function useBreathingFeedback() {
  const breatheIn = useCallback(() => {
    HapticService.breatheIn('light');
    SoundService.breatheIn();
  }, []);

  const breatheOut = useCallback(() => {
    HapticService.breatheOut('light');
    SoundService.breatheOut();
  }, []);

  const hold = useCallback(() => {
    HapticService.vibrateCustom([30, 200, 30]);
  }, []);

  const complete = useCallback(() => {
    CelebrationService.celebrate('breathingComplete');
  }, []);

  const breathingCycle = useCallback(
    (inhaleMs: number, holdMs: number, exhaleMs: number) => {
      HapticService.breathingCycle(inhaleMs, holdMs, exhaleMs);
    },
    []
  );

  return {
    breatheIn,
    breatheOut,
    hold,
    complete,
    breathingCycle,
  };
}

/**
 * Hook for streak celebrations
 */
export function useStreakCelebration() {
  const celebrateStreak = useCallback((days: number) => {
    CelebrationService.celebrateStreak(days);
  }, []);

  const celebrateDaily = useCallback(() => {
    CelebrationService.celebrate('dailyCheckIn');
  }, []);

  const celebrateWeekly = useCallback(() => {
    CelebrationService.celebrate('weeklyReview');
  }, []);

  return {
    celebrateStreak,
    celebrateDaily,
    celebrateWeekly,
  };
}

// Re-export types for convenience
export type {
  CelebrationType,
  CelebrationConfig,
  ConfettiType,
  PhysicsCelebrationType,
  PhysicsCelebrationConfig,
  SoundType,
  HapticPattern,
  HapticIntensity,
};
