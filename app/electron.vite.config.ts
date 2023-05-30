import { defineConfig, externalizeDepsPlugin } from "electron-vite"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import * as path from "path"

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        $common: path.resolve('./src/common/'),
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        $common: path.resolve('./src/common/'),
      },
    },
  },
  renderer: {
    resolve: {
      alias: {
        $lib: path.resolve('./src/renderer/src/'),
        $common: path.resolve('./src/common/'),
      },
    },
    plugins: [svelte()]
  }
})
