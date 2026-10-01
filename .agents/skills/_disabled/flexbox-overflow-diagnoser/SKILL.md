---
name: flexbox-overflow-diagnoser
description: Diagnoses and fixes flexbox squishing bugs where backgrounds shrink smaller than their inner contents. Use when UI elements (like buttons or text) are spilling out of their container's background.
---

# Flexbox Overflow Diagnoser

When troubleshooting a layout where elements (like icons or text) are visually spilling out of their parent container's background, follow these steps:

## 1. Identify the Flex Container and Squeeze
The most common cause of this bug is a parent flex container (like a wrapper with a `max-width`) squeezing its children. Flex items have `flex-shrink: 1` by default, meaning they are allowed to shrink smaller than their content if the parent doesn't have enough space.

## 2. Check for Fixed-Width Children
If the inner elements (like `width: 36px` buttons) or text (`white-space: nowrap`) cannot shrink, but the parent container *can* shrink, the parent's background will squish inward while the children overflow visually.

## 3. The Fix: `flex-shrink: 0`
To force a flex item's background to permanently wrap its contents without ever squishing, apply `flex-shrink: 0` to the container whose background is breaking.

```css
.container-with-background {
  /* Prevent the parent flex container from squishing this background */
  flex-shrink: 0; 
}
```

## 4. Alternative: Let Children Shrink
If the background *must* shrink (e.g. for responsive design on tiny mobile screens), you must allow the children to shrink too.
- Add `min-width: 0;` to the children to override the flex `min-content` default.
- Add `overflow: hidden;` or `overflow-x: auto;` to handle the overflow gracefully.
