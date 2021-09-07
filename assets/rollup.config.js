import path from 'path';
import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss'
import svg from 'rollup-plugin-svg';
import ignore from "rollup-plugin-ignore"

const production = !process.env.ROLLUP_WATCH;
const dest = path.resolve(__dirname, '../priv/static/');

// To stop watching when parent closes stdin (like mix does)
if (process.env.ROLLUP_WATCH) {
  process.stdin.on('end', () => process.exit(0));
  process.stdin.resume();
}

console.log(`Building with prod=${production}`);

export default [{
  input: 'src/main.ts',
  output: {
    sourcemap: !production,
    format: 'iife',
    name: 'app',
    file: path.resolve(dest, 'bundle.js'),
  },
  watch: {
    exclude: 'node_modules/**',
    clearScreen: false,
  },
  plugins: [
    svelte({
      preprocess: sveltePreprocess({ sourceMap: !production }),
      compilerOptions: {
        dev: !production,
      },
    }),
    
    postcss({ minimize: true, extract: false }),
    svg({ base64: true }),

    resolve({
      browser: true,
      dedupe: ['svelte'],
    }),
    commonjs(),
    typescript({
      sourceMap: !production,
      inlineSources: !production,
    }),

    production && terser(),

    copy({ targets: [{ src: 'public/**/*', dest }] }),
  ],
}, {
  input: 'src/worker.ts',
  output: {
    sourcemap: !production,
    format: 'iife',
    name: 'worker',
    file: path.resolve(dest, 'worker.js'),
  },
  watch: {
    exclude: 'node_modules/**',
    clearScreen: false,
  },
  plugins: [
    ignore(['fs', 'path']),
    resolve({
      browser: true,
      dedupe: ['svelte'],
    }),
    commonjs(),
    typescript({
      sourceMap: !production,
      inlineSources: !production,
    }),

    production && terser(),
    copy({
      targets: [
        { src: 'node_modules/pqrs-js/dist/*\.(wasm|asm\.js)', dest: path.resolve(dest, 'vendor/pqrs-js') },
      ], 
    }),
  ],
}];
