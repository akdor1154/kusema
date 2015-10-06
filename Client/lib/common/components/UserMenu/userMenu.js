import userMenuTemplate from './userMenuTemplate.html';

import {Injector} from 'kusema.js';

var userMenuDirective = function() {
		return {
			template: userMenuTemplate,
			controller: 'kusemaUserMenuController',
			controllerAs: 'c'
		};
	};
//}

var I = new Injector('$timeout', '$mdMenu', '$q', 'loginService')

var userMenuController = function() {
		I.init();
		this.originalEvent = null;
		this.loginData = I.loginService.bindables;
		return this;
	}

	userMenuController.prototype.openMenu = function(openMenuFunction, event) {
		I.loginService.checkLogin();
		this.originalEvent = event;
		openMenuFunction(event);
		this.loginMessage = null;
		I.$timeout(function() { 
			// we need to do this instead of ngClick because if we can't cancel
			// the event, we can't stop the menu closing.
			if (!this.listenerAdded) {
				document.getElementById('loginButton').addEventListener('click', this.clickLogin.bind(this), true)
				this.listenerAdded = true;
			}
		}.bind(this));
	}
	userMenuController.prototype.loginMonash = function() {
		I.loginService.loginMonash();
	}
	userMenuController.prototype.clickLogin = function(event) {
		console.log('clicked Login');
		event.stopPropagation();
		this.loginMessage = null;
		this.login()
		.then( function() {
			I.$mdMenu.hide();
		}.bind(this));
	}
	userMenuController.prototype.login = function() {
		console.log('login');
		return I.loginService.login(this.data.username, this.data.password)
		.catch(function(e) {
			console.log('caught');
			this.loginMessage = e;
			return I.$q.reject(e);
		}.bind(this));
	}
	userMenuController.prototype.register = function() {
		console.log('register');
		I.loginService.register(this.data.username, this.data.password)
		.then(function(registration) {
			I.loginService.login(this.data.username, this.data.password);
		}.bind(this));
	}
	userMenuController.prototype.logout = function() {
		console.log('logout');
		I.loginService.logout();
	}

import notLoggedInTemplate from './notLoggedInTemplate.html';
var userMenuNotLoggedInDirective = function() {
	return {
		scope: true,
		template: notLoggedInTemplate
	};
};

import loggedInTemplate from './loggedInTemplate.html';
var userMenuLoggedInDirective = function() {
	return {
		scope: true,
		template: loggedInTemplate
	}
}

import {addModule} from 'kusema.js';
addModule('kusema.components.userMenu')
		.directive('kusemaUserMenu', userMenuDirective)
		.controller('kusemaUserMenuController', userMenuController)
		.directive('kusemaUserMenuNotLoggedIn', userMenuNotLoggedInDirective)
		.directive('kusemaUserMenuLoggedIn', userMenuLoggedInDirective);
