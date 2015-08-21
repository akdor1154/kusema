var ldapjs = require('ldapjs');
var assert = require('assert');

var LdapClient = function() {
	this.client = ldapjs.createClient({
		url: 'ldap://directory.monash.edu'
	});
	this.client.bind('o=Monash University, c=au', '', function() {
		this.getUser('jmwhi13');
	}.bind(this));

	return this;
}

LdapClient.prototype.getUser = function(authcate) {
	this.client.search('o=Monash University, c=au', {
		scope: 'sub',
		filter: '(uid='+authcate+')'
	}, function(error, result) {
		assert.ifError(error);

		result.on('searchEntry', function(entry) {
			console.log('entry: '+JSON.stringify(entry.object, null, 2));
		});
		result.on('searchReference', function(referral) {
    		console.log('referral: ' + referral.uris.join());
  		});
  		result.on('error', function(error) {
  			console.error('error: '+error.message);
  		});
  		result.on('end', function(result) {
  			console.log('status: +'+result.status);
  		});
	});
}

module.exports = new LdapClient();