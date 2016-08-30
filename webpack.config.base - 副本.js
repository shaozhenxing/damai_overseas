var path = require('path');
var glob = require('glob');
var util = require('util');

var webpack = require('webpack');
var pkg = require('./package.json');

var ExtractTextPlugin = require('extract-text-webpack-plugin');  // 提取文本
var HtmlWebpackPlugin = require('html-webpack-plugin');  // 生成 html 模板
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;  // 丑化

// 引入路径
var node_modules = path.resolve(__dirname, 'node_modules');

// webpack/hot/only-dev-server 如果你喜欢手动更新
var webpackHot = 'webpack/hot/dev-server';
var webpackClient = 'webpack-dev-server/client?http:// ' + pkg.config.devHost + ':' + pkg.config.devPort;

/**
 * 获得路径
 * @param globPath: str
 * @param pathDir: str 对比路径
 * @returns {{}}
 */

function getEntry(globPath, pathDir) {
  var files = glob.sync(globPath);
  var entries = {},
      entry, dirname, basename, pathname, extname;

  for (var i = 0; i < files.length; i++) {
    entry = files[i];
    dirname = path.dirname(entry);
    extname = path.extname(entry);
    basename = path.basename(entry, extname);
    pathname = path.normalize(path.join(dirname, basename));
    pathDir = path.normalize(pathDir);
  
    if (pathname.startsWith(pathDir)) {
      pathname = pathname.substring(pathDir.length)
    }
  
    entries[pathname] = ['./' + entry];
  }
  
  return entries;
}

module.exports = function(options) {
  options = options || {};

  var DEBUG = options.debug !== undefined ? options.debug : true;

  // 生成路径字符串
  var jsBundle = path.join('_js', util.format('[name].%s.js', pkg.version));
  var cssBundle = path.join('_css', util.format('[name].%s.css', pkg.version));
  var _path = pkg.config.buildDir;

  //  获取js
  var entries = getEntry('app/_js/**/*.js', 'app/_js/');
  
  // 用entries 获取 html 多模块入口文件
  var pages = Object.keys(entries);

  // #如果需要 ie8~9 下调试注释这里 ie8~9 不支持热调试
  //  if(DEBUG){
  //      pages.forEach(function (e) {
  //          entries[e].unshift(webpackClient,webpackHot)
  //      });
  //  }
  // #end

  // config
  var config = {
    entry: Object.assign(entries, {
      //  用到什么公共lib（例如jquery.js），就把它加进common去，目的是将公用库单独提取打包
      'common': ['jquery', 'avalon2']
    }),
    resolve: {
      extensions: ['', '.js', '.json'],
      alias: {
        'jquery': path.resolve(__dirname, 'app/_vendor/jquery/jQuery-1.11.3.js'),
        'avalon2': path.resolve(__dirname, 'app/_vendor/avalon/avalon.modern.js'),
        'fetch2': 'fetch-polyfill2'
        // 'avalon2':path.resolve(node_modules,'avalon2/dist/avalon.js')
      }
    },
    output: {
      path: path.join(__dirname, _path),
      publicPath: '/',  // 这里需要更具具体情况来配置调整 公共路径
      // publicPath: '/webpack-avalon2-seed/dist/',
      filename: jsBundle
    },
    module: {
      loaders: [
        // 如果你需要 使用es6
        {
          test: /\.js$/,
          exclude: /node_modules|_vendor/,  // 排除文件夹
          loader: 'babel', // 解析 es6
          query: {
            plugins: ['transform-runtime'],
            presets: ['es2015', 'stage-0']
          }
        }, {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract('style', 'css')
        }, {
          test: /\.less$/,
          loader: 'style-loader!css-loader!less-loader'
        }, {
          test: /\.scss$/,
          // loaders: ['style', 'css', 'sass']
          loader: ExtractTextPlugin.extract('css!sass')
        }, {
          test: /\.html$/,
          loader: 'html?-minimize'  // 避免压缩 html, https:// github.com/webpack/html-loader/issues/50
        }, {
          test: /\.(woff|woff2|ttf|eot|svg)(\?t=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'file-loader?name=_fonts/[name].[ext]'  // 这里前缀路径 publicPath 参数为基础
        }, {
          test: /\.(png|jpe?g|gif)$/,
          loader: 'url-loader?limit=8192&name=_images/[name]-[hash].[ext]'  // 这里前缀路路径 publicPath 参数为基础
        }
      ]
    },
    plugins: [
      new ExtractTextPlugin(cssBundle, {
        allChunks: true
      }),
      new webpack.ProvidePlugin({
        $: 'jquery',  // 加载$全局
        jQuery: 'jquery'  // 加载$全局
        // avalon:'avalon2'  // 加载 avalon 全局 [******这里必须强制 window.avalon]
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'common',  // 将公共模块提取，生成名为`common`的chunk
        chunks: pages,  // 提取哪些模块共有的部分
        minChunks: pages.length
      }),
      DEBUG ? function() {} : new UglifyJsPlugin({ 
        // 压缩代码
        compress: {
          warnings: false
        },
        except: ['$', 'exports', 'require'] // 排除关键字
      })
    ],
    // 使用webpack-dev-server，提高开发效率
    // 启用热服务有两种 如果是 api 启动方式, 这里只是一个配置目录,不会被webpack读取,
    // 只有命令行才会读取这个参数
    devServer: {
      contentBase: path.resolve(pkg.config.buildDir),
      host: pkg.config.devHost,
      port: pkg.config.devPort,
      hot: true,
      noInfo: false,
      inline: true,
      stats: {
        colors: true
      }
    }
  };

  // html 模板插件
  pages.forEach(function (pathname) {
    var conf = {
      filename: './_views/' + pathname + '.html',  // 生成的html存放路径，相对于path
      template: path.resolve(__dirname, './app/_views/' + pathname + '.html'),  // html模板路径
      hash: true
      /**
        * 压缩这块，调用了html-minify，会导致压缩时候的很多html语法检查问题，
        * 如在html标签属性上使用{{...}}表达式，很多情况下并不需要在此配置压缩项，
        * 另外，UglifyJsPlugin会在压缩代码的时候连同html一起压缩。
        * 为避免压缩html，需要在html-loader上配置'html?-minimize'，见loaders中html-loader的配置。
        */
        
        /* minify: { // 压缩HTML文件
           removeComments: true, // 移除HTML中的注释
           collapseWhitespace: false // 删除空白符与换行符
        } */
    };

    if (pathname in config.entry) {
      conf.inject = 'body';
      conf.chunks = ['common', pathname];
    }
    
    config.plugins.push(new HtmlWebpackPlugin(conf));
  });

  return config;
};