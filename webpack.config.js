// 語言：JavaScript (webpack.config.js)
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: './src/game.ts',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: 'Tamagotchi PWA',
        template: './src/index.html'
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: 'assets', to: 'assets' },
          // 若有其他公共資源也可在此設定
        ]
      }),
      isProduction && new WorkboxPlugin.GenerateSW({
        clientsClaim: true,
        skipWaiting: true,
      })
    ].filter(Boolean),
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist')
      },
      compress: true,
      port: 9000,
      open: true
    },
    mode: argv.mode
  };
};