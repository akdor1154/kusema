kusema.directive('exampleDirective', function() {
    var linkFn;
    linkFn = function(scope, element, attrs) {
        var animateDown, animateRight, box1, box2;

        box1 = angular.element(element.children()[0]);
        box2 = angular.element(element.children()[1]);

        animateDown = function() {
            $(this).animate({
                top: '+=10'
            });
        };

        animateRight = function() {
            $(this).animate({
                left: '+=500'
            });
        };

        $(box1).on('click', animateDown);
        $(box2).on('click', animateRight);
    };
    return {
        restrict: 'E', // This can be E for element, A for atribut, C for class name - you can combine these too ie 'AEC'
        // Note that this template (below) can be taken out of the directive and written in its own html file too!
        template: '<div id="two" class="example-box">directive demo!</div><div id="one" class="example-box">directive demo!</div>',
        link: linkFn
    };
});