'use strict';

kusema.controller('NewReplyCtrl', [
  	'$scope',
  	'$routeParams',
  	'questionFactory',
  	function ($scope, $routeParams, questionFactory) {


      // DO NOT USE THIS CONTROLLER!!

      
    var messagerOpen = false;

    var closeWriter = function () {
        messagerOpen = false;
        $(".messager").animate({bottom:'-145px'}, 200);
        // $(".contribute").animate({bottom:'70px', opacity: 1}, 200);
        $("#cross").css({'-webkit-transform' : 'rotate('+ 0 +'deg)',
         '-moz-transform' : 'rotate('+ 0 +'deg)',
         '-ms-transform' : 'rotate('+ 0 +'deg)',
         'transform' : 'rotate('+ 0 +'deg)'});
    }

    var openWriter = function () {
        messagerOpen = true;
        $(".messager").animate({bottom:'0px'}, 200);
        // $(".contribute").animate({bottom:'155px', opacity: 1}, 200);
        $("#cross").css({'-webkit-transform' : 'rotate('+ 45 +'deg)',
         '-moz-transform' : 'rotate('+ 45 +'deg)',
         '-ms-transform' : 'rotate('+ 45 +'deg)',
         'transform' : 'rotate('+ 45 +'deg)'});
    }

    $(".contribute").click(function(){
      if (messagerOpen) {
        closeWriter();
      } else {
        openWriter();
      }
    });  


}]);