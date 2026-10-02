# UI Context

## Color Palette & Theming
- **Monochrome Dark Mode (Primary):**
  - Background: `#000000` (`--bg`)
  - Surface: `#0A0A0A` (`--surface`)
  - Border: `rgba(255, 255, 255, 0.1)` (`--border`)
  - Text Primary: `#EDEDED` (`--text-primary`)
  - Text Secondary: `#A1A1AA` (`--text-secondary`)
- **Accent Blue (Focus, active states, key highlight):**
  - Primary Accent: `#0072F5`
  - Glow / Border: `#3399ff` / `rgba(0, 114, 245, 0.4)`
- **Danger Red (Errors, typos):**
  - Error Red: `#ff453a` (Dark mode) / `#dc2626` (Light mode)

## Typography
- Sans-serif: `Geist Variable`, system-ui, sans-serif
- Monospace (Keys, timers, WPM metrics): `JetBrains Mono Variable`, monospace

## Floating Hero Keyboard Elements
- Container: `.keyboard-wrapper` (perspective: 1400px)
- Board: `.keyboard-board` (transform: rotateX(54deg) rotateZ(-7deg))
- Key Container: `.kb-key-container` (`--kw: <width_multiplier>`)
- Key Parts:
  - `.kb-well`: Base depression at `translateZ(0)`
  - `.kb-body`: Middle plastic extrusion at `translateZ(8px)`
  - `.kb-cap`: Key top face at `translateZ(16px)`
  - `.pressed`: Key depressed to `translateZ(6px)`
