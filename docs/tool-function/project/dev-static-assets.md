# 工程化

## webpack 配置开发环境下的静态资源

这里以构建 typescript 环境为例，实现开发环境下，静态资源配置

```JavaScript
const path = require('path');
module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    filename: 'bundle.js', // 开发环境下，会直接使用这个bundle.js，而不需要打包
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    host: '0.0.0.0',
    open: true,
    port: 8080,
    // 主要实在这里配置
    static: {
      /**
      告诉服务器从哪里提供内容。只有在你希望提供静态文件时才需要这样做。
      static.publicPath 将会被用来决定应该从哪里提供 bundle，并具有优先级。
      */
      directory: path.join(__dirname, 'public'),
      publicPath: '/'
    }
  },
  mode: 'development'
};
```
