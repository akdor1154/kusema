var jspm = require('jspm');

process.chdir(__dirname+'/../');

jspm.setPackagePath('.')

module.exports = jspm;