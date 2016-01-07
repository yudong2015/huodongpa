var path = require('path');
var jsonfile = require('jsonfile');

var conf = jsonfile.readFileSync(path.join(__dirname,"../config.json"));

module.exports = conf;