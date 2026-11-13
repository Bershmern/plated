# Plated Design System

This document is the source of truth for the Plated design language, typography, and semantic token architecture. 

**Design Personality**: Premium hospitality × modern fintech × understated technology. 
The system should feel warm, precise, premium, and approachable.

## USP 2: White-Labelling Architecture

Plated is a multi-tenant platform. While this document defines the **Plated Default Brand** (Burnt Orange, Near Black, Warm Ivory, Geist), the architecture must support **USP 2**: Dynamic white-labelling.

- **Diner App**: Must dynamically accept CSS variables injected at runtime to override the primary brand color and typography to match the specific restaurant's brand.
- **Merchant App**: Uses the Plated Default Brand.

---

## 1. Color System

The system relies on a three-color foundation translated into a Semantic Token architecture to support USP 2.

### Foundation Primitives (Plated Default)
| Role                   | Color        | Hex       |
| ---------------------- | ------------ | --------- |
| **Primary**            | Burnt Orange | `#E85D04` |
| **Dark / Text**        | Near Black   | `#171717` |
| **Background / Light** | Warm Ivory   | `#FFF8F0` |

### Semantic Tokens (CSS Variables)

Do not hardcode hex values in the UI. Use semantic tokens so that the primary brand color can be overridden by the tenant.

#### Brand / Action
| Token | Use |
|-------|-----|
| `color.action.primary` | Primary brand/action (Default: `#E85D04`) |
| `color.action.primary.hover` | Hover/pressed state |
| `color.action.primary.soft` | Selected backgrounds (`rgba(brand, 0.10)`) |
| `color.action.primary.subtle`| Very light accent (`rgba(brand, 0.05)`) |

#### Neutral / Text
| Token | Use |
|-------|-----|
| `color.text.primary` | Primary text (`#171717`) |
| `color.text.secondary`| Secondary text (`rgba(23,23,23,0.70)`) |
| `color.text.tertiary` | Supporting text (`rgba(23,23,23,0.50)`) |

#### Surface / Hierarchy
| Token | Use |
|-------|-----|
| `color.surface.primary` | Overall customer environment (`#FFF8F0`) |
| `color.surface.secondary` | Cards, menus, modals (`#FFFFFF`) |
| `color.surface.tertiary` | Subtle containers, table rows (`rgba(23,23,23,0.04)`) |

#### Border
| Token | Use |
|-------|-----|
| `color.border.default` | Default subtle border (`rgba(23,23,23,0.12)`) |
| `color.border.strong` | Stronger division (`rgba(23,23,23,0.20)`) |

---

## 2. Typography

The system is built around a single typeface (**Geist** as default), but relies on two distinct scales tailored to the specific user context.
*Tenant override*: The font-family for the Diner app can be dynamically overridden.

### Line Height & Tracking Rules
- Specify line heights explicitly (e.g., 16px font / 24px line-height).
- **Tracking**: `0` for body, `-0.02em` for headings, `+0.04em` to `+0.06em` for small uppercase labels.

### Customer Mobile Scale (Diner App)
Optimized for scanning, appetite, and fast decisions. Large, highly readable, hierarchy-driven.

| Role | Font Size / Line Height / Weight |
|------|--------------------------------|
| Restaurant Name | 24px / 32px / 700 |
| Section | 20px / 28px / 600 |
| Item Name | 16px / 24px / 600 |
| Item Description | 14px / 20px / 400 |
| Price | 16px / 24px / 600 |
| Body | 14px / 20px / 400 |
| Button | 16px / 20px / 600 |
| Caption | 12px / 16px / 500 |

### Merchant Desktop Scale (Restaurant App)
Optimized for information density, operational clarity, and long sessions.

| Role | Font Size / Line Height / Weight |
|------|--------------------------------|
| Metric (Hero) | 32px / 40px / 700 |
| Page Title | 28px / 36px / 700 |
| Section | 20px / 28px / 600 |
| Card Title | 16px / 24px / 600 |
| Body Strong | 14px / 20px / 600 |
| Body / Table | 14px / 20px / 400 |
| Label | 12px / 16px / 600 |
| Caption | 13px / 18px / 400 |

---

## 3. Shape, Space, & Motion

### Corner Radius
Soft but not bubbly. Avoid 24px on every component.
- `Radius / XS` (6px): Small controls
- `Radius / SM` (8px): Inputs, badges
- `Radius / MD` (12px): Cards, buttons
- `Radius / LG` (16px): Larger cards
- `Radius / XL` (24px): Feature/hero surfaces
- `Radius / Full` (999px): Pills

### Elevation / Shadow
Keep shadows restrained. Most cards should have **no shadow** (use borders instead).
- `Small`: `0 2px 8px rgba(23,23,23,0.08)` (Dropdowns/popovers)
- `Medium`: `0 8px 24px rgba(23,23,23,0.10)` (Modals)
- `Large`: `0 16px 40px rgba(23,23,23,0.12)` (Floating surfaces)

### Motion
Subtle and operational. No bouncing or exaggerated transitions.
- 150–200ms: Micro-interactions
- 200–300ms: Panels/modals
- `ease-out` for entrances, `ease-in` for exits.

---

## 4. Iconography
- **Style**: Outline / stroke-based icons (e.g., Lucide).
- **Scale**: XS (14px), SM (16px), MD (20px), LG (24px), XL (32px).
- **Stroke Weight**: 1.75px default; 2px for 24px+ sizes.
- **Hierarchy**: Primary (`#171717`), Secondary (`rgba(23,23,23,0.60)`), Active (`color.action.primary`).
