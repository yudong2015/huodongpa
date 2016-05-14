module.exports = {
  "mysql": {
    "host": process.env.MYSQL_HOST || "localhost",
    "user": process.env.MYSQL_USER || "root",
    "password": process.env.MYSQL_PASSWORD || "huodongpa",
    "database": process.env.MYSQL_DB || "huodongpa",
    "port": "3306"
  },
  "admin": {
    "username": "admin",
    "password": "admin"
  },
  "redis": {
    "host": process.env.REDIS_HOST || "localhost",
    "port": "6379",
    "sessionSecret": process.env.REDIS_secret || "huodongpa"
  },
  "qiniu": {
    "bucket": "huodong-pa-dev",
    "url": "",
    "accesskey": "",
    "secretkey": ""
  },
  "yunpian": {
    "apikey": ""
  }
}
