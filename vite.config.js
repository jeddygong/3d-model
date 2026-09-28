import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

/** Configures Vite to compile Vue single-file components. @returns {import('vite').UserConfig} Vite configuration. */
export default defineConfig({
  /** GitHub Pages 项目站点需要以仓库名称作为静态资源基础路径。 */
  base: '/3d-model/',
  plugins: [vue()],
})
