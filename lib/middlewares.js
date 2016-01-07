// user auth
var userAuth = function(req, res, next) {
  if( req.session.user ){
    next();
  } else {
    res.redirect('/login');
  }
};

exports.userAuth = userAuth;