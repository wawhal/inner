import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090b',
        surface: '#111115',
        accent: '#38bdf8',
        subtle: '#a1a1aa'
      }
    }
  },
  plugins: []
}

export default config
