import daisyui from 'daisyui';
import typography from '@tailwindcss/typography';

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui, typography],
}
