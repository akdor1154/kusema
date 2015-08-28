var mongoose = require('mongoose');
var objectId = mongoose.Schema.Types.ObjectId;
var bcrypt   = require('bcrypt');

// Schema definition
var userSchema = mongoose.Schema({
    username:       String,
    password:       String,
    authcate:       String,
    email:          String,
    dateCreated:    { type: Date, default: Date.now },
    dateModified:   { type: Date, default: null },
    subscriptions:  [{ type: objectId, active: Boolean }],
    enrollments:    [{ type: objectId, active: Boolean }],
    isAdmin:        { type: Boolean, default: false },
    moderatorOf:    [{ type: objectId, ref: 'Group' }]
})

// Indexes
userSchema.index({ subscriptions: 1 });
userSchema.path('username').index({text : true});
userSchema.path('authcate').index({text : true});

//TODO Make the following methods asynch
// generating a hash
userSchema.methods.generateHash = function(password) {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    return hash;
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    if (!this.password) {
        return false;
    }
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.configureFromAuthcate = function(authcateUserName) {
    var ldap = require('../services/ldapClient.js');

    this.authcate = authcateUserName;
    return ldap.getUser(authcateUserName).then(
        function(ldapUser) {
            console.log('got ldap result');
            this.email = ldapUser.mail;
            this.authcate = ldapUser.uid;
            this.username = ldapUser.givenName.split(' ')[0]+' '+ldapUser.sn.substring(0,1);
            return this;
        }.bind(this),
        function(ldapError) {
            console.error('couldn\'t find '+authcateUserName+' in ldap :(');
            console.error(ldapError);
            return ldapError;
        }
    );
}


module.exports = mongoose.model('User', userSchema);