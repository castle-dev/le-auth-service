var q = require('q');
/**
 * A tool for authenticating users
 * @class AuthService
 * @param {AuthProvider} provider the auth provider which this service delegates to
 * @returns {service}
 */
var AuthService = function (provider) {
  if (!provider) { throw new Error('Authentication provider required'); }
  var _provider = provider;
  /**
   * Creates a new user
   * @function createUser
   * @memberof AuthService
   * @instance
   * @param {string} email the new user's email
   * @param {string} password the new user's password
   * @returns {promise} resolves with the newly created user record
   */
  this.createUser = function (email, password, roles) {
    if (!email) { return q.reject(new Error('Email required')); }
    if (!password) { return q.reject(new Error('Password required')); }
    if (!roles) { return q.reject(new Error('Roles array required')); }
    return _provider.createUser(email, password, roles);
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
    return _provider.loginWithEmail(email, password);
  };
  /**
   * Logs a user in, given an access token
   * @function loginWithToken
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
  /**
   * Returns the authed user's record
   * @function getAuthedUser
   * @memberof AuthService
   * @instance
   * @returns {record} the authed user's record
   */
  this.getAuthedUser = function () {
    return _provider.getAuthedUser();
  };
  /**
   * Checks whether the current user have a given role
   * @function authedUserHasRole
   * @memberof AuthService
   * @instance
   * @param {string} role the role to check
   * @returns {promise}
   */
  this.authedUserHasRole = function (role) {
    return _provider.authedUserHasRole(role);
  };
  /**
   * Returns a map of the authed user's role records
   * @function getAuthedUserRoles
   * @memberof AuthService
   * @instance
   * @returns {promise} resolves with a map of role records
   */
  this.getAuthedUserRoles = function () {
    return _provider.getAuthedUserRoles();
  };
};

module.exports = AuthService;
