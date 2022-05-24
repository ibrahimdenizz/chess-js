// vite.config.js
import { defineConfig } from "vite";

var path = require("path");

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.js"),
      name: "chess-js",
      fileName: (format) => `${format}.js`,
    },
  },
  resolve: { alias: { "@": "/src" } },
});
