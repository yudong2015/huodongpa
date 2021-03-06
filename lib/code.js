/* SMS verification code generater and validater */
var SMSClient = require('yunpian-sms-client');
var redis = require('redis');

// load config file
var jsonfile = require('jsonfile');
var path = require('path')

var config = require('../config');
// var config = jsonfile.readFileSync(path.join(__dirname,'../config.json'));

var VerifyCodePrefix = 'verify:';
var VerifyCodeTimeout = 300; // 5 minutes.

var redisClient = redis.createClient({
  host: config.redis.host,
  port: config.redis.port
});

redisClient.on("error", function (err) {
    console.log("RedisError " + err);
});

function genRandomCode(count){
  var code = '';
  for(var i=0; i<count; i++) {
    code += Math.floor(Math.random()*10)
  }
  return code;
}

function sendVerifyCode(phone, callback) {
  var code = genRandomCode(6);
  var c = new SMSClient({
    apiKey: config.yunpian.apikey,
    sendContent: '【学术葩】您的验证码是' + code + '。如非本人操作，请忽略本短信',
    mobile: [phone]
  });

  c.sendSMS(function (err, result) {
    if (err) {
        console.log(err);
        return callback(err);
    }

    console.log(result);
    var ret = JSON.parse(result);
    if (ret.code != 0) {
      return callback(ret.msg);
    }
    redisClient.set(VerifyCodePrefix + phone, code, redis.print);
    redisClient.expire(VerifyCodePrefix + phone, VerifyCodeTimeout, redis.print);
    return callback();
  });
}

function validateVerifyCode(phone, code, callback) {
  redisClient.get(VerifyCodePrefix + phone, function(err, reply){
    console.log("verifing code of " + phone);
    if (err) {
      console.log(err);
      return callback(err);
    }

    if (reply && reply.toString() == code) {
      return callback();
    } else {
      return callback('verification code error.');
    }
  });
}

exports.sendVerifyCode = sendVerifyCode;
exports.validateVerifyCode = validateVerifyCode;

