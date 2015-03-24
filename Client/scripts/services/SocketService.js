'use strict';

kusema.factory('socketFactory', ['$rootScope', function ($rootScope, kusemaConfig) {
  var socket = io.connect(kusemeConfig.url());
    return {
    
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        console.log('args -' + arguments);
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
}])
