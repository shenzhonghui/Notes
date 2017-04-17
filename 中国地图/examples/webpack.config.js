// 该配置基于webpack2.0 详情查看 https://webpack.js.org/guides/migrating/
var  path = require('path'); // 导入路径包
var webpack = require('webpack');
module.exports = {
    entry: {
      app: './app.js'
    }, //入口文件
    output: {
        path: path.resolve(__dirname, 'build'), // 指定打包之后的文件夹
// 　　　　 publicPath: 'build', // 指定资源文件引用的目录，也就是说用/assests/这个路径指代path，开启这个配置的话，index.html中应该要引用的路径全部改为'/assets/...'
        // filename: 'bundle.js' // 指定打包为一个文件 bundle.js
        filename: '[name].js' // 可以打包为多个文件
    },
    resolve: {
      extensions: ['.js'],
      alias: {
        // 'src': path.resolve(__dirname, '../src'),
        // 'assets': path.resolve(__dirname, '../src/assets')
      }
    },
    plugins: [
      new webpack.ProvidePlugin({
        '$': 'jquery',
        'jQuery': 'jquery',
        'window.jQuery': 'jquery',
      }),
    ],
    // 使用loader模块
    module: {
        rules: [{
            test: /\.css$/,
            use: [
                'style-loader', {
                    loader: 'css-loader',
                    options: {
                        modules: true // 设置css模块化,详情参考https://github.com/css-modules/css-modules
                    }
                }
            ]
        }, {
        test: /\.(jpg|png|gif|svg)$/,
        use: [{
          loader: 'url-loader',
          query: {
            limit: 2000,
            name: '[name].[ext]',
          },
        }, ],
      }]
    },
    devServer: {
  	   inline: true,
       hot: true,
       port: 9090,
       host: '0.0.0.0'
    }
}
