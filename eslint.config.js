import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['**/*.md', 'src/mocaiping/game.ts', 'src/mocaiping/mocaiping.css'],
  vue: false,
  react: true, // @eslint-react/eslint-plugin
  typescript: true,
  stylistic: true,
  formatters: true, // eslint-plugin-format 格式化
  rules: {
    'react/no-array-index-key': 'off',
    'react/no-children-to-array': 'off',
    'react/no-unnecessary-use-prefix': 'off',
    'jsdoc/check-alignment': 'off',
    'react-hooks/exhaustive-deps': 'off',
  },
})
