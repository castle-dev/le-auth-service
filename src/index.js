var q = require('q');

var AuthService = function (provider, storage) {
  if (!provider) { throw new Error('Authentication provider required'); }
  if (!storage) { throw new Error('Storage service required'); }
  var _provider = provider;
  var _storage = storage;
  var _authedUser;

  this.createUser = function (email, password) {
    if (!email) { return q.reject(new Error('Email required')); }
    if (!password) { return q.reject(new Error('Password required')); }
    return _provider.createUser(email, password)
    .then(function (id) {
      var _user = storage.createRecord('user', id);
      return _user.update({});
    });
  };
  this.getID = function () {
    if (_authedUser) { return _authedUser.getID(); }
  };
  this.setRole = function (role) {
    if (!_authedUser) { return q.reject(new Error('Cannot set role before logging in')); }
    var record = storage.createRecord('role', _authedUser.getID());
    return record.update(role);
  };
  this.loginWithEmail = function (email, password) {
    if (!email) { return q.reject(new Error('Email required')); }
    if (!password) { return q.reject(new Error('Password required')); }
    return _provider.loginWithEmail(email, password)
    .then(function (id) {
      _authedUser = storage.createRecord('user', id);
    });
  };
  this.loginWithToken = function (token) {
    if (!token) { return q.reject(new Error('Token required')); }
    return _provider.loginWithToken(token);
  }
  this.isAuthenticated = function () {
    return _provider.isAuthenticated();
  };
  this.logout = function () {
    _authedUser = false;
    return _provider.logout();
  };
  this.requestPasswordReset = function (email) {
    if (!email) { return q.reject(new Error('Email required')); }
    return _provider.requestPasswordReset(email);
  };
  this.resetPassword = function (email, resetToken, newPassword) {
    if (!email) { return q.reject(new Error('Email required')); }
    if (!resetToken) { return q.reject(new Error('Reset token required')); }
    if (!newPassword) { return q.reject(new Error('Password required')); }
    return _provider.resetPassword(email, resetToken, newPassword);
  };
};

module.exports = AuthService;
