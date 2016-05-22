### 技术框架

* 语言：[NodeJS](http://nodejs.org/)
* web框架：[Express](http://www.expressjs.com.cn/)
* ORM：[squelize](http://docs.sequelizejs.com/en/latest/)

### 组件依赖
* MySQL
* Redis

### 第三方云服务
* 图片存储：[七牛云存储](qiniu.com)
* 短信服务：[云片](yunpian.com)

账号密码都一样。账号：`shiye@xueshupa.net`, 密码：`1lovehuoguomei`

### 部署

1. 安装node环境
2. 安装MySQL，并新建数据库`xueshupa`，
3. 安装redis
4. 使用`git`clone项目
5. `npm install`安装依赖
6. 新建`config.json`,参照`config.example.json`配置
7. 初始化数据库: `node ./tools/migrate.js`(注意：只限新增表，修改表结构需手动更新)
8. `node ./bin/www`，或安装pm2后`pm2 start ./bin/www --name xueshupa -l xueshupa.log`
9. 如果是在新环境部署，**务必**在[云片](yunpian.com)网将该服务器ip增加到ip白名单，否则短信验证码无法发送。

### 升级


### 目录说明

* `bin` express生成的启动脚本
* `lib` 一些通用的函数
	* `code.js`: 验证码发送
	* `config.js`: 配置文件读取
	* `erros.js`: 错误码及错误说明配置
	* `helpers.js`: 模板工具函数，里面的函数会注入到模板引擎
	* `index.js`: 工具函数
	* `middleware.js`: 中间件，如用户登录验证等
* `models` 数据库表ORM定义
* `public` 静态文件，所有js/css/image
* `rebuild` 原始重构稿
* `routes` 路由
* `tools` 工具程序，如数据库脚本
* `views` 模板文件
* `config.js` 配置文件实例，实际配置文件为`config.js`
* `app.js` 程序入口
