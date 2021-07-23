module.exports = {
  purge: [
    './src/components/*/*.js',
    './src/components/*.js',
    './src/pages/*/*.js',
    './src/hoc/*/*.js',
    './public/index.html',
  ],
  darkMode: false, // or 'media' or 'class'
  variants: {
    extend: {},
  },
  plugins: [],
};
