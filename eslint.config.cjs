// Lightweight bridge for ESLint v9 to load legacy .eslintrc.json
module.exports = {
  'ignores': [],
  'languageOptions': {
    'ecmaVersion': 2021,
    'sourceType': 'module'
  },
  'settings': require('./.eslintrc.json')?.settings || {},
  'plugins': {},
  'rules': require('./.eslintrc.json')?.rules || {}
};
