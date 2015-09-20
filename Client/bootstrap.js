

import angular from 'angular';

import './config';
import 'common/components/components';
import 'common/services';
import 'user/kusemaUser';

import kusema from './kusema';
console.log(kusema._invokeQueue);
angular.element(document).ready(function() {
	angular.bootstrap(document, [kusema.name], {strictDi: true});
});


