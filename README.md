# @affectively/confetti-physics

Physics-based confetti celebrations with fluid dynamics, haptic feedback, and procedural audio. Built with [hexgrid-3d](https://github.com/buley/hexgrid-3d) math.

[![npm version](https://img.shields.io/npm/v/@affectively/confetti-physics.svg)](https://www.npmjs.com/package/@affectively/confetti-physics)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🌀 **Physics-based confetti** - Fluid dynamics, flow fields, and particle attractors
- 🎉 **Classic confetti** - Traditional particle effects via canvas-confetti
- 🔊 **Procedural audio** - Web Audio API tones (no audio files needed)
- 📳 **Haptic feedback** - Web Vibration API patterns
- ⚛️ **React hooks** - Easy integration with React apps
- ♿ **Accessibility** - Respects `prefers-reduced-motion`
- 💾 **Preference persistence** - User settings saved to localStorage

## Installation

```bash
npm install @affectively/confetti-physics
# or
yarn add @affectively/confetti-physics
# or
bun add @affectively/confetti-physics
```

## Quick Start

### Basic Usage

```typescript
import { CelebrationService, ConfettiService, SoundService, HapticService } from '@affectively/confetti-physics';

// Quick celebration with confetti + sound + haptic
CelebrationService.celebrate('achievement');

// Physics-based confetti only
ConfettiService.supernova();
ConfettiService.aurora();
ConfettiService.vortex();

// Individual services
SoundService.success();
HapticService.celebrate();
```

### React Hooks

```tsx
import { useCelebration, useConfetti, usePhysicsConfetti } from '@affectively/confetti-physics/react';

function MyComponent() {
  const { celebrate, success, milestone } = useCelebration();
  const confetti = useConfetti();

  return (
    <div>
      <button onClick={() => celebrate('achievement')}>
        🏆 Unlock Achievement
      </button>
      <button onClick={() => confetti.supernova()}>
        💥 Supernova!
      </button>
    </div>
  );
}
```

## Celebration Types

### Orchestrated Celebrations

`CelebrationService` combines confetti, sound, and haptic feedback:

| Type | Confetti | Sound | Haptic |
|------|----------|-------|--------|
| `tap` | - | tap | light |
| `success` | - | success | medium |
| `complete` | sparkles | complete | medium |
| `achievement` | achievement | milestone | strong |
| `milestone` | milestone | milestone | strong |
| `streak` | burst | streak | medium |
| `streakMilestone` | streak | celebration | strong |
| `levelUp` | levelUp | levelUp | strong |
| `unlock` | stars | unlock | strong |
| `premium` | premium | celebration | strong |
| `welcome` | welcome | success | medium |
| `error` | - | error | medium |
| `warning` | - | warning | light |

### Classic Confetti Effects

| Type | Description |
|------|-------------|
| `burst` | Quick celebration burst |
| `shower` | Confetti rain from top |
| `fireworks` | Firework explosions |
| `sparkles` | Gentle sparkle effect |
| `stars` | Star-shaped particles |
| `hearts` | Heart emoji particles |
| `achievement` | Grand achievement celebration |
| `streak` | Fire + gold confetti |
| `milestone` | Trophy + stars |
| `levelUp` | Rocket + fireworks |
| `welcome` | Gentle welcome |
| `premium` | Crown + gem + gold |

### Physics-Based Confetti Effects

These use fluid dynamics, flow fields, and attractors from hexgrid-3d:

| Type | Description |
|------|-------------|
| `vortex` | Spiral vortex pulling particles inward |
| `supernova` | Explosive burst with fluid shockwave |
| `aurora` | Flowing northern lights ribbons |
| `resonance` | Heart-rate synced pulsing |
| `orbit` | Particles orbiting multiple attractors |
| `cascade` | Fluid waterfall effect |
| `emergence` | Particles following flow field |
| `harmony` | Lissajous pattern attractors |
| `helix` | DNA-like double helix spiral |
| `bloom` | Flower-like unfolding pattern |
| `constellation` | Particles forming and connecting |
| `nebula` | Gas cloud effect with density |

## Emotion-Aware Celebrations

Automatically select effects and colors based on emotional context:

```typescript
import { ConfettiService } from '@affectively/confetti-physics';

ConfettiService.celebrateEmotion({
  emotion: 'joy',
  valence: 0.8,   // -1 to 1 (negative to positive)
  arousal: 0.7,   // 0 to 1 (calm to excited)
  heartRate: 80   // Optional: sync with biometrics
});
```

### Emotion Color Palettes

| Emotion | Colors |
|---------|--------|
| joy | Gold, amber |
| serenity | Emerald, mint |
| excitement | Rose, gold |
| love | Pink, rose |
| triumph | Purple, gold |
| gratitude | Teal, emerald |
| wonder | Sky blue, purple |
| peace | Green, teal |

## Sound Effects

14 procedurally generated sounds using Web Audio API:

```typescript
import { SoundService } from '@affectively/confetti-physics';

SoundService.tap();           // Soft click
SoundService.success();       // C5-E5-G5 ascending
SoundService.celebration();   // Full fanfare
SoundService.milestone();     // Grand achievement
SoundService.streak();        // Quick excitement
SoundService.levelUp();       // Ascending scale
SoundService.unlock();        // Unlocking tone
SoundService.complete();      // Task done
SoundService.breatheIn();     // Rising tone for breathing exercises
SoundService.breatheOut();    // Falling tone
SoundService.heartbeat();     // Lub-dub rhythm
SoundService.error();         // Descending tone
SoundService.warn();          // Alert tone
```

### Volume Control

```typescript
SoundService.setVolume(0.5);  // 0-1
SoundService.setEnabled(false); // Mute
```

## Haptic Feedback

15 vibration patterns via Web Vibration API:

```typescript
import { HapticService } from '@affectively/confetti-physics';

HapticService.tap('light');       // Light tap
HapticService.success('medium');  // Satisfying success
HapticService.celebrate('strong'); // Excitement burst
HapticService.milestone();        // Grand achievement
HapticService.streak();           // Rapid fire
HapticService.levelUp();          // Ascending power
HapticService.unlock();           // Unlocking sensation
HapticService.heartbeat();        // Calming heartbeat
HapticService.breatheIn();        // For breathing exercises
HapticService.breatheOut();
```

### Intensity Levels

- `light` - 50% duration multiplier
- `medium` - 100% (default)
- `strong` - 150%

## User Preferences

Preferences are automatically saved to localStorage:

```typescript
import { CelebrationService } from '@affectively/confetti-physics';

// Get current settings
const settings = CelebrationService.getSettings();
// { soundEnabled, hapticEnabled, confettiEnabled, volume, hapticSupported, soundSupported }

// Update settings
CelebrationService.setSoundEnabled(false);
CelebrationService.setHapticEnabled(true);
CelebrationService.setConfettiEnabled(true);
CelebrationService.setVolume(0.7);

// Enable/disable all at once
CelebrationService.enableAll();
CelebrationService.disableAll();
```

## React Hooks

### useCelebration

Main hook for all celebration functionality:

```tsx
const {
  celebrate,           // (type) => void
  celebrateCustom,     // (config) => void
  celebrateStreak,     // (days) => void
  tap, success, complete, achievement, milestone,
  levelUp, unlock, premium, welcome, error, warning,
  settings,            // Current settings
  setSoundEnabled, setHapticEnabled, setConfettiEnabled, setVolume
} = useCelebration();
```

### useConfetti

For visual celebrations:

```tsx
const {
  celebrate,           // (type) => void
  celebratePhysics,    // (config) => void
  celebrateEmotion,    // ({ emotion, valence, arousal }) => void
  enabled, setEnabled,
  physicsEnabled, setPreferPhysics,
  fromElement,         // (element, type?) => void
  reset,               // () => void
  // Classic: burst, shower, fireworks, sparkles, stars, hearts, etc.
  // Physics: vortex, supernova, aurora, resonance, orbit, cascade, etc.
} = useConfetti();
```

### usePhysicsConfetti

Direct access to physics engine:

```tsx
const {
  celebrate,           // (config) => void
  celebrateWithEmotion, // (type, emotion, options) => void
  clear,               // () => void
  enabled, setEnabled,
  isAvailable,
  // Each type as a method with optional config
  vortex, supernova, aurora, resonance, orbit, cascade,
  emergence, harmony, helix, bloom, constellation, nebula
} = usePhysicsConfetti();
```

### useSound / useHaptic

Individual service hooks:

```tsx
const sound = useSound();
const haptic = useHaptic();

// Both have:
// - enabled, supported, setEnabled
// - Convenience methods (tap, success, etc.)
```

### useInteractionFeedback

For button feedback:

```tsx
const { onPress, onSuccess, onError } = useInteractionFeedback();

<button onClick={onPress}>Click me</button>
```

### useBreathingFeedback

For breathing exercises:

```tsx
const { breatheIn, breatheOut, hold, complete, breathingCycle } = useBreathingFeedback();
```

### useStreakCelebration

For streak milestones:

```tsx
const { celebrateStreak, celebrateDaily, celebrateWeekly } = useStreakCelebration();

// celebrateStreak(days) automatically picks the right celebration:
// - Day 1: dailyCheckIn
// - Days 7, 30, 100, 365: streakMilestone
// - Other days: streak
```

## Accessibility

The library automatically respects `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  /* Confetti and animations are disabled */
}
```

You can also manually disable effects:

```typescript
CelebrationService.disableAll();
// or individually:
ConfettiService.setEnabled(false);
SoundService.setEnabled(false);
HapticService.setEnabled(false);
```

## Browser Support

| Feature | Browser Support |
|---------|-----------------|
| Confetti (canvas) | All modern browsers |
| Physics engine | All modern browsers |
| Web Audio API | All modern browsers |
| Vibration API | Android Chrome, Firefox |

## Dependencies

- [`@affectively/hexgrid-3d`](https://github.com/buley/hexgrid-3d) - Physics math (fluid dynamics, flow fields)
- [`canvas-confetti`](https://github.com/catdad/canvas-confetti) - Classic confetti effects
- `react` (peer, optional) - For React hooks

## License

MIT © [AFFECTIVELY](https://affectively.ai)

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) first.

## Related Projects

- [hexgrid-3d](https://github.com/buley/hexgrid-3d) - The math library powering the physics
- [canvas-confetti](https://github.com/catdad/canvas-confetti) - Classic confetti effects
