import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

export default [
  { ignores: ['out/**', 'dist_electron/**', 'node_modules/**', 'src/renderer/public/**'] },
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
    rules: {
      'no-unused-vars': 'off',
      // single-word component names and prop-edited configs are existing design
      'vue/multi-word-component-names': 'off',
      'vue/no-mutating-props': 'off'
    }
  }
]
