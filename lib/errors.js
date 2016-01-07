var errors = {
  OK: {code: 0, message: '成功'},
  ERR_SENDCODE: {code: 10001, message: '发送验证码失败'},
  ERR_INVALIDCODE: {code: 10002, message: '验证码错误'}
};

module.exports = errors;