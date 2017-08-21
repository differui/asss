const commonjs = require('rollup-plugin-commonjs')
const replace = require('rollup-plugin-replace')
const resolve = require('rollup-plugin-node-resolve')
const typescript = require('rollup-plugin-typescript')

export default {
  entry: './src/index.ts',
  dest: './dest/bundle.js',
  format: 'cjs',
  plugins: [
    typescript(),
    commonjs({
      namedExports: {}
    }),
    resolve(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ]
}
