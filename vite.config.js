import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import glsl from 'vite-plugin-glsl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    glsl({
      include: [
        '**/*.glsl',
        '**/*.vert',
        '**/*.frag'
      ],
      exclude: undefined,
      defaultExtension: 'glsl',
      warnDuplicatedImports: true,
      compress: false
    })
  ],
})
