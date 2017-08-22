### npm 的常用方法
---
#### 了解 npm 安装包的过程：

* 发出npm install 命令

* npm 向registry 查询模块压缩包的地址

* 下载压缩包，存放在~/.npm 目录

* 解压压缩包到当前项目中的node_modules目录


#### npm 的常用方法

1 查看npm的版本

	$ npm -v

2  查看package的最新版本和所有版本

	// 查看包的最新版本
	npm view packageName version
	// 查看包的所有版本
	npm view packageName versions

3 安装某个包

	// 安装最新的版本
	$ npm install packageName
	// 安装某个版本
	$ npm install packageName@version

4 卸载某个包

	$ npm uninstall packageName

5 更新某个包

	$ npm update packageName

6 清除缓存

	$ npm cache clean

7 安装依赖
	// 安装包的同时自动更新package.json的dependencies
	$ npm install packageName --save
	// 安装包的同时自动更新package.json的devDependencies
	$ npm install packageName --save-dev

#### npm设置安装镜像

1 通过config命令(安装淘宝镜像)

	$ npm config set registry https://registry.npm.taobao.org

2 命令行指定

	// 安装模块的时候指定
	$ npm --registry=https://registry.npm.taobao.org install koa

3 编辑~/.npmrc 文件

	registry=https://registry.npm.taobao.org
	sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
	phantomjs_cdnurl=http://npm.taobao.org/mirrors/phantomjs
	ELECTRON_MIRROR=http://npm.taobao.org/mirrors/electron/


参考资料： http://www.cnblogs.com/chern2468/p/6628252.html
