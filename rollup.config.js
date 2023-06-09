import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import external from 'rollup-plugin-peer-deps-external';
import sourceMaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import { visualizer } from 'rollup-plugin-visualizer';
import sizes from 'rollup-plugin-sizes';
export default {
	input: `src/index.tsx`,
	output: [
		{
			file: pkg.main,
			format: 'cjs',
			sourcemap: true,
			plugins: [terser()],
			exports: 'auto',
		},
		{
			file: pkg.module,
			format: 'es',
			sourcemap: true,
			plugins: [terser()],
			exports: 'auto',
		},
		{
			file: 'dist/index.js',
			format: 'cjs',
			sourcemap: true,
			exports: 'auto',
		},
	],
	watch: {
		include: 'src/**',
	},
	plugins: [
		external(),
		postcss({
			modules: true,
		}),
		// Allow json resolution
		json(),
		// Allow node_modules resolution, so you can use 'external' to control
		// which external modules to include in the bundle
		// https://github.com/rollup/rollup-plugin-node-resolve#usage
		resolve(),
		// Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
		commonjs({
			ignoreGlobal: true,
			include: /\/node_modules\//,
			namedExports: {
				react: Object.keys(require('react')),
				'react-is': Object.keys(require('react-is')),
			},
		}),
		// Resolve source maps to the original source
		sourceMaps(),
		// Compile TypeScript files
		typescript({
			useTsconfigDeclarationDir: true,
			exclude: ['**/__tests__/**', '*.spec.*', '*.test.*'],
			clean: true,
		}),
		visualizer(), // Generates a visual report in stats.html
		sizes(), // Highlights size of deps
	],
};
