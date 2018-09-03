const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, './src/server'),
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'server.js'
    },
    target: 'node',
    node: {
      __dirname: false,
      __filename: false
    },
    resolve: {
      extensions: [
        '.ts',
        '.tsx',
        '.js',
        '.json',
        '.jsx',
      ],
      plugins: [
        new TsconfigPathsPlugin({ configFile: path.resolve(__dirname, '../tsconfig.json') })
      ]
    },
    module: {
      strictExportPresence: true,
      rules: [
        {
          test: /\.(js|jsx|mjs)$/,
          loader: require.resolve('source-map-loader'),
          enforce: 'pre',
          include: path.resolve(__dirname, './src'),
        },
        {
          oneOf: [
            {
              test: /\.(js|jsx|mjs)$/,
              include: path.resolve(__dirname, './src'),
              loader: require.resolve('babel-loader'),
              options: {
                babelrc: false,
                compact: true,
              },
            },
            {
              test: /\.(ts|tsx)$/,
              include: path.resolve(__dirname, './src'),
              use: [
                {
                  loader: require.resolve('ts-loader'),
                  options: {
                    transpileOnly: true,
                  },
                },
              ],
            },
            {
              exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
              loader: require.resolve('file-loader'),
              options: {
                name: 'static/media/[name].[hash:8].[ext]',
              }
            }
          ]
        }
      ]
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            async: false,
            watch: path.resolve(__dirname, './src'),
            tsconfig: path.resolve(__dirname, '../tsconfig.json'),
            tslint: path.resolve(__dirname, '../tslint.json'),
        }),
    ]
};
  