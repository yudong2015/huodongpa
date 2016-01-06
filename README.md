### 技术框架

* 语言：[NodeJS](http://nodejs.org/)
* web框架：[Express](http://www.expressjs.com.cn/)
* ORM：[squelize](http://docs.sequelizejs.com/en/latest/)

### 部署

1. 安装node环境
2. 安装MySQL，并新建数据库`xueshupa`，安装redis
3. 使用git clone项目
4. npm install
5. 新建`config.json`,参照`config.example.json`配置
6. 初始化数据库: `node ./tools/migrate.js`
7. node ./bin/www，或安装pm2后`pm2 start ./bin/www --name xueshupa -l xueshupa.log`