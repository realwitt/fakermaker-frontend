import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [
    vue({
      jsx: true,
      appEntrypoint: '/src/pages/_app'
    }),
    tailwind()
  ]
});
