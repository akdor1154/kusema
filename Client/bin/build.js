#!/usr/bin/env node

var jspm = require('./initJspm.js');

jspm.bundleSFX('bootstrap.js', 'build.js')
.then(function() { console.log('build done!')})
.catch(function(e) { console.error(e);});