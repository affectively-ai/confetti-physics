/**
 * SoundService - Luxury audio feedback for celebrations and interactions
 *
 * Uses Web Audio API to generate pleasant tones.
 * Designed for emotional wellness - sounds are calming, satisfying, and non-jarring.
 */

export type SoundType =
  | 'tap' // Soft click
  | 'success' // Gentle success chime
  | 'celebration' // Exciting celebration fanfare
  | 'milestone' // Achievement unlocked
  | 'streak' // Streak sound
  | 'levelUp' // Level up ascending tones
  | 'unlock' // Feature unlocked
  | 'notification' // Soft notification
  | 'complete' // Task complete
  | 'breatheIn' // Soft tone for inhale
  | 'breatheOut' // Soft tone for exhale
  | 'heartbeat' // Gentle heartbeat
  | 'error' // Soft error
  | 'warning'; // Gentle warning

type SoundConfig = {
  frequencies: number[]; // Frequencies to play
  durations: number[]; // Duration for each frequency in ms
  type: OscillatorType; // Waveform type
  volume: number; // 0-1
  delay?: number[]; // Delay before each note in ms
  envelope?: {
    attack: number; // Attack time in seconds
    decay: number; // Decay time in seconds
    sustain: number; // Sustain level 0-1
    release: number; // Release time in seconds
  };
};

// Musical frequencies for pleasant sounds
const NOTE = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  A5: 880.0,
};

// Carefully designed sound configurations for emotional wellness
const SOUND_CONFIGS: Record<SoundType, SoundConfig> = {
  tap: {
    frequencies: [NOTE.G5],
    durations: [50],
    type: 'sine',
    volume: 0.1,
    envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.05 },
  },

  success: {
    frequencies: [NOTE.C5, NOTE.E5, NOTE.G5],
    durations: [100, 100, 200],
    delay: [0, 80, 160],
    type: 'sine',
    volume: 0.15,
    envelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.2 },
  },

  celebration: {
    frequencies: [
      NOTE.C5,
      NOTE.E5,
      NOTE.G5,
      NOTE.C5,
      NOTE.E5,
      NOTE.G5,
      NOTE.A5,
    ],
    durations: [80, 80, 80, 80, 80, 80, 300],
    delay: [0, 60, 120, 200, 260, 320, 450],
    type: 'sine',
    volume: 0.2,
    envelope: { attack: 0.01, decay: 0.05, sustain: 0.5, release: 0.3 },
  },

  milestone: {
    frequencies: [NOTE.G4, NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C5],
    durations: [150, 150, 150, 150, 400],
    delay: [0, 120, 240, 360, 500],
    type: 'sine',
    volume: 0.2,
    envelope: { attack: 0.02, decay: 0.1, sustain: 0.4, release: 0.4 },
  },

  streak: {
    frequencies: [NOTE.E5, NOTE.G5, NOTE.A5],
    durations: [80, 80, 150],
    delay: [0, 70, 140],
    type: 'sine',
    volume: 0.15,
    envelope: { attack: 0.01, decay: 0.08, sustain: 0.3, release: 0.2 },
  },

  levelUp: {
    frequencies: [
      NOTE.C4,
      NOTE.E4,
      NOTE.G4,
      NOTE.C5,
      NOTE.E5,
      NOTE.G5,
      NOTE.C5,
    ],
    durations: [100, 100, 100, 100, 100, 100, 400],
    delay: [0, 80, 160, 280, 360, 440, 600],
    type: 'sine',
    volume: 0.2,
    envelope: { attack: 0.01, decay: 0.1, sustain: 0.5, release: 0.5 },
  },

  unlock: {
    frequencies: [NOTE.G4, NOTE.B4, NOTE.D5, NOTE.G5],
    durations: [100, 100, 100, 300],
    delay: [0, 80, 160, 280],
    type: 'triangle',
    volume: 0.18,
    envelope: { attack: 0.02, decay: 0.1, sustain: 0.4, release: 0.3 },
  },

  notification: {
    frequencies: [NOTE.E5, NOTE.G5],
    durations: [80, 120],
    delay: [0, 100],
    type: 'sine',
    volume: 0.12,
    envelope: { attack: 0.01, decay: 0.1, sustain: 0.2, release: 0.15 },
  },

  complete: {
    frequencies: [NOTE.C5, NOTE.G5],
    durations: [100, 200],
    delay: [0, 80],
    type: 'sine',
    volume: 0.15,
    envelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.2 },
  },

  breatheIn: {
    frequencies: [NOTE.C4, NOTE.E4, NOTE.G4],
    durations: [800, 800, 1200],
    delay: [0, 600, 1200],
    type: 'sine',
    volume: 0.08,
    envelope: { attack: 0.5, decay: 0.3, sustain: 0.4, release: 0.8 },
  },

  breatheOut: {
    frequencies: [NOTE.G4, NOTE.E4, NOTE.C4],
    durations: [800, 800, 1200],
    delay: [0, 600, 1200],
    type: 'sine',
    volume: 0.08,
    envelope: { attack: 0.3, decay: 0.5, sustain: 0.3, release: 1.0 },
  },

  heartbeat: {
    frequencies: [NOTE.C4, NOTE.C4],
    durations: [100, 80],
    delay: [0, 150],
    type: 'sine',
    volume: 0.1,
    envelope: { attack: 0.02, decay: 0.1, sustain: 0.2, release: 0.15 },
  },

  error: {
    frequencies: [NOTE.E4, NOTE.C4],
    durations: [150, 200],
    delay: [0, 120],
    type: 'sine',
    volume: 0.12,
    envelope: { attack: 0.01, decay: 0.1, sustain: 0.2, release: 0.2 },
  },

  warning: {
    frequencies: [NOTE.A4, NOTE.F4],
    durations: [120, 180],
    delay: [0, 100],
    type: 'sine',
    volume: 0.1,
    envelope: { attack: 0.01, decay: 0.1, sustain: 0.2, release: 0.2 },
  },
};

class SoundServiceClass {
  private audioContext: AudioContext | null = null;
  private enabled = true;
  private volume = 0.5; // Master volume 0-1
  private supported = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.supported =
        'AudioContext' in window || 'webkitAudioContext' in window;
    }
  }

  /**
   * Initialize audio context (must be called after user interaction)
   */
  private getAudioContext(): AudioContext | null {
    if (!this.supported) return null;

    if (!this.audioContext) {
      try {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        this.audioContext = new AudioContextClass();
      } catch {
        return null;
      }
    }

    // Resume if suspended (browsers require user interaction)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    return this.audioContext;
  }

  /**
   * Check if sound is supported
   */
  isSupported(): boolean {
    return this.supported;
  }

  /**
   * Enable or disable sound globally
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * Check if sound is enabled
   */
  isEnabled(): boolean {
    return this.enabled && this.supported;
  }

  /**
   * Set master volume (0-1)
   */
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Get current master volume
   */
  getVolume(): number {
    return this.volume;
  }

  /**
   * Play a note with envelope
   */
  private playNote(
    frequency: number,
    duration: number,
    config: SoundConfig,
    startTime: number
  ): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = config.type;
    oscillator.frequency.value = frequency;

    // Apply ADSR envelope
    const envelope = config.envelope || {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.5,
      release: 0.2,
    };
    const effectiveVolume = config.volume * this.volume;
    const durationSec = duration / 1000;

    // Start at 0
    gainNode.gain.setValueAtTime(0, startTime);

    // Attack
    gainNode.gain.linearRampToValueAtTime(
      effectiveVolume,
      startTime + envelope.attack
    );

    // Decay to sustain
    gainNode.gain.linearRampToValueAtTime(
      effectiveVolume * envelope.sustain,
      startTime + envelope.attack + envelope.decay
    );

    // Hold at sustain level
    // Guard against short notes where release is longer than note duration,
    // which would produce an invalid negative timestamp for AudioParam.
    const sustainTime = Math.max(
      startTime,
      startTime + durationSec - envelope.release
    );
    gainNode.gain.setValueAtTime(
      effectiveVolume * envelope.sustain,
      sustainTime
    );

    // Release to 0
    gainNode.gain.linearRampToValueAtTime(0, startTime + durationSec);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + durationSec + 0.1);
  }

  /**
   * Play a sound by type
   */
  play(type: SoundType): void {
    if (!this.isEnabled()) return;

    const config = SOUND_CONFIGS[type];
    if (!config) return;

    const ctx = this.getAudioContext();
    if (!ctx) return;

    const baseTime = ctx.currentTime;

    config.frequencies.forEach((freq, index) => {
      const delay = config.delay?.[index] || 0;
      const duration = config.durations[index] || 100;
      const startTime = baseTime + delay / 1000;

      this.playNote(freq, duration, config, startTime);
    });
  }

  // Convenience methods

  /** Soft tap sound */
  tap(): void {
    this.play('tap');
  }

  /** Success chime */
  success(): void {
    this.play('success');
  }

  /** Celebration fanfare */
  celebrate(): void {
    this.play('celebration');
  }

  /** Milestone achievement */
  milestone(): void {
    this.play('milestone');
  }

  /** Streak sound */
  streak(): void {
    this.play('streak');
  }

  /** Level up sound */
  levelUp(): void {
    this.play('levelUp');
  }

  /** Unlock sound */
  unlock(): void {
    this.play('unlock');
  }

  /** Notification sound */
  notify(): void {
    this.play('notification');
  }

  /** Complete sound */
  complete(): void {
    this.play('complete');
  }

  /** Breathing - inhale */
  breatheIn(): void {
    this.play('breatheIn');
  }

  /** Breathing - exhale */
  breatheOut(): void {
    this.play('breatheOut');
  }

  /** Heartbeat */
  heartbeat(): void {
    this.play('heartbeat');
  }

  /** Error sound */
  error(): void {
    this.play('error');
  }

  /** Warning sound */
  warn(): void {
    this.play('warning');
  }

  /**
   * Play a custom frequency pattern
   */
  playCustom(
    frequencies: number[],
    durations: number[],
    options?: Partial<SoundConfig>
  ): void {
    if (!this.isEnabled()) return;

    const config: SoundConfig = {
      frequencies,
      durations,
      type: options?.type || 'sine',
      volume: options?.volume || 0.15,
      delay: options?.delay,
      envelope: options?.envelope,
    };

    const ctx = this.getAudioContext();
    if (!ctx) return;

    const baseTime = ctx.currentTime;

    frequencies.forEach((freq, index) => {
      const delay = config.delay?.[index] || index * 100;
      const duration = durations[index] || 100;
      const startTime = baseTime + delay / 1000;

      this.playNote(freq, duration, config, startTime);
    });
  }
}

// Singleton instance
export const SoundService = new SoundServiceClass();
