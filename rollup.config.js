export default {
  input: 'src/index.js',
  output: {
    file: 'docs/js/bundle.js',
    format: 'es',
  },
  watch: {
    include: 'src/**',
  },
};
