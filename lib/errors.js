var errors = {
  OK: {code: 0, message: '成功'},
  ERR_SENDCODE: {code: 10001, message: '发送验证码失败'},
  ERR_INVALIDCODE: {code: 10002, message: '验证码错误'},
  ERR_DUPLICATEPHONE: {code: 10003, message: '电话号码重复'},
  ERR_CLASSNOTFOUND: {code: 10004, message: '课程不存在'},
  ERR_WRONGARG: {code: 10005, message: '无效参数'}
};

module.exports = errors;