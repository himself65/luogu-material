const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const path = require('path')

const isProd = process.env.NODE_ENV === 'production'
const extractCSS = isProd || process.env.TARGET === 'development'

const stylusLoader = [
  extractCSS ? MiniCssExtractPlugin.loader : 'style-loader',
  { loader: 'css-loader', options: { sourceMap: !isProd } },
  { loader: 'postcss-loader', options: { sourceMap: !isProd } },
  { loader: 'stylus-loader', options: { sourceMap: !isProd } }
]

const resolve = (dir) => path.resolve(__dirname, dir)

module.exports = {
  entry: path.resolve(__dirname, './src', 'main.js'),
  mode: isProd ? 'production' : 'development',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.styl(us)?$/,
        use: stylusLoader
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: '[name].css' })
  ],
  optimization: {
    minimize: isProd,
    minimizer: [
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano'),
        cssProcessorOptions: {
          discardComments: { removeAll: true },
          postcssZindex: false,
          reduceIdents: false
        },
        canPrint: false
      })
    ]
  },
  resolve: {
    extensions: ['.js', '.styl'],
    alias: {
      'ui': resolve('node_modules/@kuen/ui/src')
    },
    modules: [
      'node_modules',
      resolve('node_modules')
    ]
  },
  resolveLoader: {
    modules: ['node_modules', path.resolve('node_modules')]
  },
  performance: {
    hints: false
  },
  stats: { children: false }
}
