import babel from '@rollup/plugin-babel';
import resolve, { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import filesize from 'rollup-plugin-filesize';
import autoprefixer from 'autoprefixer';

import pkg from './package.json';

const INPUT_FILE_PATH = 'src/index.js';
const OUTPUT_NAME = 'Example';
const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const GLOBALS = {
  react: 'React',
  'react-dom': 'ReactDOM',
  'prop-types': 'PropTypes',
};

const PLUGINS = [
  postcss({
    extract: true,
    plugins: [
      autoprefixer,
    ],
  }),
  babel({
    babelHelpers: 'runtime',
    exclude: 'node_modules/**',
    extensions,
  }),
  resolve({
    browser: true, // <-- suppress node-specific features
    resolveOnly: [
      /^(?!react$)/,
      /^(?!react-dom$)/,
      /^(?!prop-types)/,
    ],
    extensions: ['.jsx', '.js', '.json'],
  }),
  commonjs({
    include: /node_modules/
  }),
  nodeResolve(),
  filesize(),
];

const EXTERNAL = [
  'react',
  'react-dom',
  'prop-types',
  'reselect'
];

// https://github.com/rollup/plugins/tree/master/packages/babel#babelhelpers
const CJS_AND_ES_EXTERNALS = EXTERNAL.concat(/@babel\/runtime/);

const OUTPUT_DATA = [
  // {
  //   file: pkg.browser,
  //   format: 'umd',
  // },
  // {
  //   file: pkg.main,
  //   format: 'cjs',
  // },
  {
    file: pkg.module,
    format: 'es',
  },
];

const onwarn = warning => {
  // Skip certain warnings
  switch (warning.code) {
    case 'THIS_IS_UNDEFINED':
    case 'UNUSED_EXTERNAL_IMPORT':
    case 'CIRCULAR_DEPENDENCY':
    case 'NAMESPACE_CONFLICT':
      return;
    default:
      // console.warn everything else
      console.warn(`(!) ${warning.code}`);
      console.warn("IN:\t", warning.importer);
      console.warn("SOURCE:\t", warning.source);
      console.warn("MESSAGE:", warning.message, "\n");
      break;
  }
}

const config = OUTPUT_DATA.map(({ file, format }) => ({
  input: INPUT_FILE_PATH,
  output: {
    file,
    format,
    name: OUTPUT_NAME,
    globals: GLOBALS,
  },
  external: ['cjs', 'es'].includes(format) ? CJS_AND_ES_EXTERNALS : EXTERNAL,
  plugins: PLUGINS,
  onwarn
}));

export default config;
