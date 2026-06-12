import globals from 'globals';
import pluginJs from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import svelteConfig from './svelte.config.js';

export default [
	{ ignores: ['dist', 'build', 'package', 'node_modules'] },
	// Recommended JavaScript and TypeScript lints
	pluginJs.configs.recommended,
	...tsPlugin.configs['flat/recommended'],
	// Configure ESLint for use with Svelte, see https://github.com/sveltejs/eslint-plugin-svelte#typescript-project
	...svelte.configs['flat/recommended'],
	{ languageOptions: { globals: globals.browser } },
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: tsParser,
				svelteConfig
			}
		}
	},
	// Turn off lints that conflict with Prettier, see https://github.com/prettier/eslint-config-prettier#installation
	eslintConfigPrettier
];
