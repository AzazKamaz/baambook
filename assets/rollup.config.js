import path from 'path';
import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';
import svg from 'rollup-plugin-svg';

const production = !process.env.ROLLUP_WATCH;
const dest = path.resolve(__dirname, '../priv/static/');

console.log(`Building with prod=${production}`);

export default {
  input: 'src/main.ts',
  output: {
    sourcemap: !production,
    format: 'iife',
    name: 'app',
    file: path.resolve(dest, 'bundle.js'),
  },
  plugins: [
    svelte({
      preprocess: sveltePreprocess({ sourceMap: !production }),
      compilerOptions: {
        dev: !production,
      },
    }),
    
    css({ output: 'bundle.css' }),
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

    copy({ targets: [{ src: 'static/**/*', dest }] }),
  ],
  watch: {
    clearScreen: false
  },
};
