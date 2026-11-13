import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Omit<Config, "content"> = {
  theme: {
    extend: {
      colors: {
        // Plated Semantic Tokens
        action: {
          primary: "hsl(var(--action-primary) / <alpha-value>)",
          hover: "hsl(var(--action-primary-hover) / <alpha-value>)",
          soft: "hsl(var(--action-primary) / 0.10)",
          subtle: "hsl(var(--action-primary) / 0.05)",
        },
        text: {
          primary: "hsl(var(--text-primary) / <alpha-value>)",
          secondary: "hsl(var(--text-primary) / 0.70)",
          tertiary: "hsl(var(--text-primary) / 0.50)",
        },
        surface: {
          primary: "hsl(var(--surface-primary) / <alpha-value>)",
          secondary: "hsl(var(--surface-secondary) / <alpha-value>)",
          tertiary: "hsl(var(--text-primary) / 0.04)",
        },
        border: {
          default: "hsl(var(--text-primary) / 0.12)",
          strong: "hsl(var(--text-primary) / 0.20)",
        },
        
        // Shadcn UI Fallback Mappings (to prevent errors before refactoring)
        background: "hsl(var(--surface-primary))",
        foreground: "hsl(var(--text-primary))",
        primary: {
          DEFAULT: "hsl(var(--action-primary))",
          foreground: "hsl(var(--surface-primary))",
        },
        secondary: {
          DEFAULT: "hsl(var(--text-primary) / 0.04)",
          foreground: "hsl(var(--text-primary))",
        },
        muted: {
          DEFAULT: "hsl(var(--text-primary) / 0.04)",
          foreground: "hsl(var(--text-primary) / 0.70)",
        },
        accent: {
          DEFAULT: "hsl(var(--action-primary) / 0.10)",
          foreground: "hsl(var(--action-primary))",
        },
        destructive: {
          DEFAULT: "hsl(0 84.2% 60.2%)", // Generic red as fallback
          foreground: "hsl(var(--surface-primary))",
        },
        ring: "hsl(var(--action-primary))",
      },
      fontSize: {
        "32": ["32px", { lineHeight: "40px" }],
        "28": ["28px", { lineHeight: "36px" }],
        "24": ["24px", { lineHeight: "32px" }],
        "20": ["20px", { lineHeight: "28px" }],
        "16": ["16px", { lineHeight: "24px" }],
        "16-tight": ["16px", { lineHeight: "20px" }],
        "14": ["14px", { lineHeight: "20px" }],
        "13": ["13px", { lineHeight: "18px" }],
        "12": ["12px", { lineHeight: "16px" }],
      },
      letterSpacing: {
        normal: "0",
        tight: "-0.02em",
        wide: "0.04em",
        wider: "0.06em",
      },
      boxShadow: {
        sm: "0 2px 8px rgba(23, 23, 23, 0.08)",
        md: "0 8px 24px rgba(23, 23, 23, 0.10)",
        lg: "0 16px 40px rgba(23, 23, 23, 0.12)",
        none: "0 0 #0000",
      },
      borderRadius: {
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        full: "var(--radius-full)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    plugin(function({ addUtilities }) {
      addUtilities({
        '.hover-underline': {
          'position': 'relative',
        },
        '.hover-underline::after': {
          'content': '""',
          'position': 'absolute',
          'bottom': '0',
          'left': '0',
          'width': '100%',
          'height': '2px',
          'background-color': 'currentColor',
          'transform': 'scaleX(0)',
          'transform-origin': 'bottom left',
          'transition': 'transform 0.3s ease-out',
        },
        '.hover-underline:hover::after': {
          'transform': 'scaleX(1)',
        },
        '.hover-underline[data-state="active"]::after': {
          'transform': 'scaleX(1)',
        },
        '.hover-underline[aria-current="page"]::after': {
          'transform': 'scaleX(1)',
        },
        '.hover-underline.active::after': {
          'transform': 'scaleX(1)',
        }
      })
    })
  ],
};

export default config;
