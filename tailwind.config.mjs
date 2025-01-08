/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
        colors: {
          'bg': '#212738',
          'bg-slightly-lighter': '#242A3D',
          'bg-input': '#333C57',
          'line': '#424E70',
          'line-input' : '#6878A6',
          'text-grey': '#9FA9C6',
          'text-muted' : '#5D6E9D',
          'accent-pink': '#F75590',
          'accent-purple': '#BDB2FF',
        }
    },
    plugins: [],
  }
}
