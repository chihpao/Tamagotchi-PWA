const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  entry: './src/game.ts',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [{
      test: /\.ts$/,
      use: 'ts-loader',
      exclude: /node_modules/
    }]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      maximumFileSizeToCacheInBytes: 8 * 1024 * 1024, // 設定為 8MB
      runtimeCaching: [{
        urlPattern: /\.(js|html|json|png)$/,
        handler: 'CacheFirst'
      }]
    })
  ],
  devServer: {
    static: {
      directory: __dirname + '/public'
    },
    compress: true,
    port: 8080
  }
};