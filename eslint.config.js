import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  features: {
    tooling: true,
    stylistic: true
  },
  dirs: {
    src: ['./']
  }
}).append({
  rules: {
    // Enforce consistent coding style for 816tech
    'vue/multi-word-component-names': 'off',
    'vue/no-multiple-template-root': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    
    // DRY and best practices enforcement
    'no-duplicate-imports': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    
    // Vue-specific rules for consistency
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/no-unused-components': 'warn',
    'vue/no-unused-vars': 'warn',
    'vue/require-default-prop': 'off',
    'vue/require-prop-types': 'warn',
    
    // Import organization
    'import/order': ['error', {
      'groups': [
        'builtin',
        'external',
        'internal',
        'parent',
        'sibling',
        'index'
      ],
      'newlines-between': 'always',
      'alphabetize': {
        'order': 'asc',
        'caseInsensitive': true
      }
    }]
  }
})
