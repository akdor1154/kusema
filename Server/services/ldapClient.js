var ldapjs = require('ldapjs');
var assert = require('assert');

var LdapClient = function() {
	this.client = ldapjs.createClient({
		url: 'ldap://directory.monash.edu',
		bindDN: 'o=Monash University, c=au'
	});
	/*
	this.getUser('jmwhi13').then(function(user) {
		console.log('got user!')
		console.log(user);
	}, function(error) {
		console.error('error!');
		console.error(error);
	});
	*/

	return this;
}

LdapClient.prototype.getUser = function(authcate) {
	return new Promise(function(resolve, reject) {
		this.client.search('o=Monash University, c=au', {
			scope: 'sub',
			filter: '(uid='+authcate+')'
		}, function(error, result) {
			if (error) {
				reject(error);
			}

			result.on('searchEntry', function(entry) {
				//console.log('entry: '+JSON.stringify(entry.object, null, 2));
				result.winning = true;
				resolve(entry.object) // will return the first match; that's all we really want anyway so no need to get more complicated;
			});
			result.on('searchReference', function(referral) {
	    		//console.log('ldap referral, dunno what do to here lol: ' + referral.uris.join());
	  		});
	  		result.on('error', function(error) {
	  			//console.error('error: '+error.message);
	  			reject(error);
	  		});
	  		result.on('end', function(result) {
	  			console.log('ldap query done: +'+result.status);
	  			if (!result.winning) {
	  				reject('query finished but no users found :(');
	  			}
	  		});
		});
	}.bind(this));
}

module.exports = new LdapClient();