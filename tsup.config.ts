// tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],       // adjust if entry point is different
  splitting: false,              // disable code splitting (for lib)
  sourcemap: true,
  clean: true,                   // clean outDir before build
  dts: true,                     // emit .d.ts files
  format: ['cjs', 'esm'],        // build both formats
  outDir: 'dist',
  minify: true,                  // .min.js output
  target: 'es2020',              // or match your node target
});
