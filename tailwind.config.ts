import type { Config } from "tailwindcss";
const plugin = require('tailwindcss/plugin')


const myPlugin = plugin(function ({ matchUtilities, theme }:{matchUtilities:any, theme:any}) {
  matchUtilities(
    {
      'text-shadow': (value: string) => ({
        textShadow: value,
      }),
    },
    { values: theme('textShadow') }
  );
});

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/Lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      },
      animation: {
        'spin': 'spin 3s linear infinite',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      textShadow: {
        sm: '0 1px 2px var(--tw-shadow-color)',
        DEFAULT: '0 2px 4px var(--tw-shadow-color)',
        lg: '0 8px 16px var(--tw-shadow-color)',
        white: '0 0px 5px rgba(255, 255, 255, 0.9)',
      },
      colors: {
        mony: {
          DEFAULT: '#0AF7FC'
        },
        blood: {
          DEFAULT: '#FF1E00'
        }
      },
      fontFamily: {
        'playstation': ['playstation', 'sans-serif'] // Use a sensible fallback font
      }
    },
  },
  variants: {
    extend: {
      textShadow: ['hover']
    }
  },
  plugins: [
    myPlugin,
    require('flowbite/plugin')
  ],
};
export default config;
