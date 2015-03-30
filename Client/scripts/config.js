'use strict';

var kusemaConfigModule = angular.module('kusema.config', [])
  .constant('kusemaConfig', {
    'host': window.location.hostname,
    'port': '3000',
    'url': function() { return 'http://'+this.host+':'+this.port+'/'; }
  });
