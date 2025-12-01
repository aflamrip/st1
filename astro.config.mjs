import { defineConfig } from 'astro/config';
import UnoCSS from '@unocss/astro';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import AstroPWA from '@vite-pwa/astro';

export default defineConfig({
  site: 'https://example.com',
  output: 'static',
  integrations: [
    UnoCSS({
      injectReset: true
    }),
    sitemap(),
    AstroPWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Streaming Platform',
        short_name: 'Stream',
        description: 'Watch movies, shows and anime',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/favicon.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,webp}']
      }
    })
  ],
  vite: {
    ssr: {
      noExternal: ['plyr']
    },
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'embla': ['embla-carousel'],
            'fuse': ['fuse.js']
          }
        }
      }
    }
  },
  image: {
    domains: ['images.pexels.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com'
      }
    ],
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  }
});
