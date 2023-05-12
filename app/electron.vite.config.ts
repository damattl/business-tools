import { defineConfig, externalizeDepsPlugin } from "electron-vite"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import * as path from "path"

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        $lib: path.resolve('./src/renderer/src/'),
      },
    },
    plugins: [svelte()]
  }
})
