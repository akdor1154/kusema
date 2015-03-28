'use strict';

kusema.factory('toolboxFactory', [function() {

  /* Provides useful browser events, properties and functions to controllers */
  var toolboxFactory = {};
  
  toolboxFactory.findObjectInArray = function(array, property, value){
    for (var i = 0, len = array.length; i < len; i++) {
      if (array[i][property] === value) {
        return {
          referenceToObject: array[i],
          objectPosition: i
        };
      }
    }
    return {
      referenceToObject: -1,
      objectPosition: -1
    };
  };

  toolboxFactory.documentHeight = function() {
    var D = document;
    return Math.max(
      Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
      Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
      Math.max(D.body.clientHeight, D.documentElement.clientHeight)
      );
  };

  toolboxFactory.scrollMax = function(callback) {
    window.onscroll = function() {
      if ((window.innerHeight + window.scrollY + 20) >= toolboxFactory.documentHeight()) {
        callback();
      }
    };
  };

  return toolboxFactory;
}]);