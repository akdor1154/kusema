kusema.directive('appMenu', function() {
    var linkFn;
    linkFn = function(scope, element, attrs) {
		var hamburger = document.getElementById('hamburger');

		hamburger.addEventListener("click", toggleMenu);

		function toggleMenu() {
			document.getElementById('add-button').classList.toggle('open');
			document.getElementById('main-panel').classList.toggle('open');
			document.getElementById('hamburger').classList.toggle('open');
		};
    };
    return {
        restrict: 'E', // TODO Break out HTML
        template: '<div><a href="#">Menu Item 1</a><br><a href="#">Menu Item 2</a><br><a href="#">Menu Item 3</a><br><a href="#">Menu Item 4</a><br></div>',
        link: linkFn
    };
});