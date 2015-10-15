#!/usr/bin/env node

var jspm = require('./initJspm.js');

jspm.bundleSFX('bootstrap.js', 'build.js', {minify: true})
.then(function() { console.log('build done!')})
.catch(function(e) { console.error(e);});