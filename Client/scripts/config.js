'use strict';

var kusemaConfigModule = angular.module('kusema.config', [])
  .constant('kusemaConfig', {
    'host': 'localhost',
    'port': '3000',
    'url': function() { return 'http://'+this.host+':'+this.port+'/'; }
  });
