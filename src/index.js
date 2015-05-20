var q = require('q');
/**
 * A tool for authenticating users
 * @class AuthService
 * @param {AuthProvider} provider the auth provider which this service delegates to
 * @param {StorageService} storage an instance of le-storage-service that is used to create records
 * @returns {service}
 */
var AuthService = function (provider, storage) {
  if (!provider) { throw new Error('Authentication provider required'); }
  if (!storage) { throw new Error('Storage service required'); }
  var _provider = provider;
  var _storage = storage;
  var _authedUser;
  /**
   * Creates a new user
   * @function createUser
   * @memberof AuthService
   * @instance
   * @param {string} email the new user's email
   * @param {string} password the new user's password
   * @returns {promise} resolves with the newly created user record
   */
  this.createUser = function (email, password) {
    if (!email) { return q.reject(new Error('Email required')); }
    if (!password) { return q.reject(new Error('Password required')); }
    var _user;
    return _provider.createUser(email, password)
    .then(function (id) {
      _user = storage.createRecord('user', id);
      return _user.update({});
    })
    .then(function () { return _user });
  };
  /**
   * Logs a user in, given their email and password
   * @function loginWithEmail
   * @memberof AuthService
   * @instance
   * @param {string} email the user's email
   * @param {string} password the user's password
   * @returns {promise} resolves with the user record
   */
  this.loginWithEmail = function (email, password) {
    if (!email) { return q.reject(new Error('Email required')); }
    if (!password) { return q.reject(new Error('Password required')); }
    return _provider.loginWithEmail(email, password)
    .then(function (id) {
      _authedUser = storage.createRecord('user', id);
    })
    .then(function () { return _authedUser });
  };
  /**
   * Logs a user in, given an access token
   * @function loginWithEmail
   * @memberof AuthService
   * @instance
   * @param {string} token the user's access token (such as a secret key)
   * @returns {promise}
   */
  this.loginWithToken = function (token) {
    if (!token) { return q.reject(new Error('Token required')); }
    return _provider.loginWithToken(token);
  }
  /**
   * Checks whether a user is currently authenticated
   * @function isAuthenticated
   * @memberof AuthService
   * @instance
   * @returns {boolean}
   */
  this.isAuthenticated = function () {
    return _provider.isAuthenticated();
  };
  /**
   * Logs a user out
   * @function logout
   * @memberof AuthService
   * @instance
   */
  this.logout = function () {
    _authedUser = false;
    return _provider.logout();
  };
  /**
   * Start the password reset process
   * @function requestPasswordReset
   * @memberof AuthService
   * @instance
   * @param {string} email the user's email address
   * @returns {promise}
   */
  this.requestPasswordReset = function (email) {
    if (!email) { return q.reject(new Error('Email required')); }
    return _provider.requestPasswordReset(email);
  };
  /**
   * Complete the password reset process and change the user's password
   * @function resetPassword
   * @memberof AuthService
   * @instance
   * @param {string} email the user's email address
   * @param {string} resetToken the password reset token given to the user
   * @param {string} newPassword the user's new password
   * @returns {promise}
   */
  this.resetPassword = function (email, resetToken, newPassword) {
    if (!email) { return q.reject(new Error('Email required')); }
    if (!resetToken) { return q.reject(new Error('Reset token required')); }
    if (!newPassword) { return q.reject(new Error('Password required')); }
    return _provider.resetPassword(email, resetToken, newPassword);
  };
};

module.exports = AuthService;
