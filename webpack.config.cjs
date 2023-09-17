const path = require('path');

module.exports = {
  mode: "production",
  entry: './src/apis/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          configFile: "apis.tsconfig.json"
        },
        exclude: [/node_modules/],
      },
      {
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: "defaults" }]
            ]
          }
        }
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.mjs', '.cjs'],
  },
  output: {
    filename: 'chromeAPIs.js',
    path: path.resolve(__dirname, 'build/assets'),
  },
};