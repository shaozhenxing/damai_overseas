# webpack-avalon2-seed #



### 安装依赖

`$ npm install` - 安装依赖

### npm scripts

`$ npm run dev` - 建立开发模式并启动应用程序在 http://localhost:3000

`$ npm run build` - 打包理想的生产环境 ./dist 目录下

`$ npm run bug` - 命令行启动热服务


### 开发要求/原则

**_js,_views,_scss 目录结构文件名保持一致**

```
--- ./app
    |--- ./_components (组件目录)
    |--- ./_fonts(字体库)
    |--- ./_images(图片)
    |--- ./_lib(外部库文件)
              |--- jQuery-3.0.0.js
    |--- ./_scss
              |--- base.scss
              |--- variables.scss {scss 全局的变量定义 引入到base.scss}

              |---./home [这是一个业务模块]
                    |--- index.scss
    |--- ./_js
         |--- ./home [业务模块]
              |--- index.js
              |--- search.js
         |--- ./product [业务模块]
              |--- index.js
              |--- order.js
    |--- ./_views
          |--- ./home [业务模块]
              |--- index.html
              |--- search.html
          |--- ./product [业务模块]
              |--- index.html
              |--- order.html
```
### 兼容尝试[版本支持 ie8]

1.  如果需要支持es6
    `babel-core`
    `"babel-loader"`
    `"babel-preset-es2015"`

2.  经过测试
    如果 你需要在ie8~9下 调试
    请在注释到dev.config.js 和 webpack.config.base.js 下 热更新插件的代码


3.  webpack 支持的jQuery 从1.11.0 开始
    之前的版本会挂在 window下
    而并非是

```javascript
/* WEBPACK VAR INJECTION */(function($) {__webpack_require__(79)
	__webpack_require__(83)

	// var avalon = require("avalon2");
	avalon.define({
	    $id: "root-index",
	    name: "Hello Avalon! -  首页11sda2"
	});
	console.log($)
	$("<div>首页</div>").appendTo("#index");
	$("#index").css({color:"red"})
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))
```


### 相关链接

[webpack: <http://webpack.github.io>]

[avalon2: <http://avalonjs.coding.me>]