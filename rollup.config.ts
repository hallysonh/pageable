import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import typescript from 'rollup-plugin-typescript2'
import json from 'rollup-plugin-json';
import { uglify } from 'rollup-plugin-uglify';
import { minify } from 'uglify-es';

const pkg = require('./package.json');
const libraryName = 'pageable';

export default {
  input: `src/${libraryName}.ts`,
  output: [
    { file: `${pkg.main}`, format: 'umd', sourcemap: true, name: libraryName },
    { file: `${pkg.module}`, format: 'es', sourcemap: true },
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [],
  watch: {
    include: 'src/**',
  },
  plugins: [
    // Compile TypeScript files
    typescript(),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    json(),
    // Allow node_modules resolution, so you can use 'external' to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),
    // Resolve source maps to the original source
    sourceMaps(),
    // Minify generated bundle.
    uglify({}, minify),
  ],
}
