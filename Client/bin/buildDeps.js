#!/usr/bin/env node

var jspm = require('./initJspm.js');

jspm.bundle('lib/**/* - [lib/**/*]', 'deps.js', {minify: true, sourceMaps: true})
.then(function() { console.log('deps done!')})
.catch(function(e) { console.error(e);});