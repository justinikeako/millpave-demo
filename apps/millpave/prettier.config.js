module.exports = {
	singleQuote: true,
	printWidth: 80,
	proseWrap: 'always',
	tabWidth: 2,
	useTabs: true,
	trailingComma: 'all',
	bracketSpacing: true,
	jsxBracketSameLine: false,
	semi: true,
	plugins: [require('prettier-plugin-tailwindcss')],
	tailwindConfig: './tailwind.config.cjs'
};
