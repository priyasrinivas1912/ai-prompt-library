# Design Brief

## Purpose & Emotional Context
Premium digital library for AI prompt curation. Professional, focused, editorial. Users organize creative assets with clarity and confidence.

## Tone & Differentiation
Refined restraint. No generic AI aesthetics. Deep dark backgrounds with crisp typography. Cards breathe. Complexity badges are instantly scannable through semantic color. Editorial clarity over decoration.

## Color Palette

| Token | Light OKLCH | Dark OKLCH | Usage |
|-------|-------------|-----------|-------|
| background | 0.99 0 0 | 0.1 0 0 | Page background |
| foreground | 0.15 0 0 | 0.95 0 0 | Primary text |
| card | 1.0 0 0 | 0.16 0 0 | Card surfaces |
| primary | 0.65 0.15 262 | 0.72 0.18 262 | CTA, links (cyan-blue) |
| accent | 0.7 0.22 40 | 0.75 0.22 40 | Secondary highlights |
| success | 0.65 0.22 142 | 0.72 0.22 142 | Complexity 1-3 badge |
| warning | 0.75 0.22 70 | 0.8 0.22 70 | Complexity 4-7 badge |
| destructive | 0.55 0.22 25 | 0.68 0.22 25 | Complexity 8-10 badge |
| border | 0.9 0 0 | 0.25 0 0 | Dividers, card borders |
| muted | 0.95 0 0 | 0.22 0 0 | Secondary surfaces |

## Typography
- **Display/Body**: General Sans (contemporary, neutral, readable)
- **Mono**: JetBrains Mono (technical content, code snippets)
- **Scale**: 12px (caption), 14px (body), 16px (heading), 20px (hero)

## Elevation & Depth
- Cards: `shadow-sm` with subtle `border-border` (no heavy shadows)
- Hover: `shadow-md` with `bg-muted/10` (minimal state change)
- Modals/dropdowns: `shadow-md` with `bg-popover`

## Structural Zones
- **Header**: `bg-card` with `border-b` (container, logo, nav placeholder)
- **Main content**: `bg-background` (spacious, breathing room)
- **Card grid**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3` with `gap-4`
- **Prompt card**: `card-elevated` with title, preview, complexity badge top-right
- **Badge**: color-coded pill (green/orange/red) with `rounded-full`

## Component Patterns
- Buttons: `primary` for CTA, `secondary` for cancel/back
- Forms: inline validation, clear error messages, focus ring on all inputs
- Lists: card-based, no table layout for better visual hierarchy
- Badges: semantic colors (success/warning/destructive), rounded, small padding

## Motion
- Default: `transition-smooth` (0.3s cubic-bezier)
- Cards: fade + lift on hover (shadow-sm → shadow-md)
- Forms: focus ring with ring color

## Constraints
- No decorative gradients or blur effects
- No animations > 0.3s (maintains professional feel)
- Minimum contrast: AA+ on all text
- Cards max-width: 400px (prevents overwhelming scale)
- Badge text: always `font-semibold`, `text-sm`

## Signature Detail
Complexity badges as semantic dots — green (safe), orange (moderate), red (challenging). Instantly legible without reading the number. Dark background elevates the badges as functional art.
