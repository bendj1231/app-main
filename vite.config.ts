import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://localhost:8787',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    plugins: [
      react(),
    ],
    define: {
      // NEVER put API keys here — Vite bundles them into client JS.
      // Server-side secrets belong in Supabase Edge Function secrets.
      __BUILD_TIME__: JSON.stringify(new Date().toISOString())
    },
    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : [],
      pure: mode === 'production' ? ['console.log', 'console.warn', 'console.error', 'console.debug', 'console.info'] : []
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react-dom') || id.includes('react-router')) return 'vendor-react';
              if (id.includes('framer-motion')) return 'vendor-framer';
              if (id.includes('three') || id.includes('@react-three')) return 'vendor-three';
              if (id.includes('lucide-react')) return 'vendor-lucide';
              if (id.includes('recharts') || id.includes('d3-')) return 'vendor-charts';
              if (id.includes('firebase')) return 'vendor-firebase';
              if (id.includes('@paper-design') || id.includes('@fontsource')) return 'vendor-ui';
              return 'vendor-misc';
            }
            // Split large app modules individually
            if (id.includes('PortalWrapper')) return 'portal-wrapper';
            if (id.includes('PilotLicensureExperiencePage')) return 'pilot-licensure';
            if (id.includes('DigitalLogbookPage')) return 'logbook';
            if (id.includes('PilotJobDatabasePage')) return 'job-db';
          },
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]'
        }
      },
      chunkSizeWarningLimit: 1000
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});