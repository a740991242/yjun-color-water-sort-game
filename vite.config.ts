import type { ConfigEnv, UserConfig } from 'vite'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react-swc'
import postcssPresetEnv from 'postcss-preset-env'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const isDev = mode === 'dev' || mode === 'development'

  return {
    base: isDev ? './' : '/yjun-color-water-sort-game/',
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(import.meta.dirname, 'src'),
      },
    },
    css: {
      postcss: {
        plugins: [postcssPresetEnv()],
      },
    },
    server: {
      open: true,
      host: '0.0.0.0',
      port: 5201,
    },
    build: {
      target: 'es2018',
      outDir: 'dist',
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
    },
  }
})
