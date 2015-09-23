

import angular from 'angular';

import './config';
import 'common/components/components';
import 'common/services';
import 'user/kusemaUser';
import 'common/directives';

import kusema from './kusema';

function bootstrap() {
	angular.element(document).ready(function() {
		angular.bootstrap(document, [kusema.name], {strictDi: true});
	});
}

bootstrap();