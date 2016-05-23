var pro = {
  "mysql": {
    "host": process.env.MYSQL_HOST || "localhost",
    "user": process.env.MYSQL_USER || "root",
    "password": process.env.MYSQL_PASSWORD || "123456",
    "database": process.env.MYSQL_DB || "activitypar",
    "port": "3306"
  },
  "admin": {
    "username": "admin",
    "password": "123456"
  },
  "redis": {
    "host": process.env.REDIS_HOST || "localhost",
    "port": "6379",
    "sessionSecret": process.env.REDIS_secret || "kdNMMmI85hqbWQIy/COmtNsM+LU="
  },
  "qiniu": {
    "bucket": "zaker",
    "url": "http://o759sw3sw.bkt.clouddn.com/",
    "accesskey": "iR7EWQGW0QPUNwdeR1LAdQ_i5ps-ztDsegNvBg_8",
    "secretkey": "V2aQeojUqURdRr3a2rtXmZGzolgY1_yTezaQgQs5"
  },
  "yunpian": {
    "apikey": "af2a722aa68ea24af35975332871130c"
  },
  default:{
    categorys:function(){return '小升初、初一、初二、中考、高一、高二、高考'.split('、');}(), //��������
    catetoryType:{common:'common',special:'special'},
    managerRole:{super:'super', normal:'normal'},

    isDeleted:{deleted:'deleted',normal:'normal'},//
    password :"huodongpa",
  }
};

module.exports =  pro;
