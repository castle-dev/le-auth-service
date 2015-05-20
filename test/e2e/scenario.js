var crypto = require('crypto');
var Firebase = require('firebase');
var StorageService = require('le-storage-service');
var StorageProvider = require('le-storage-provider-firebase');
var AuthService = require('../../src/index.js');
var AuthProviderFirebase = require('le-auth-provider-firebase');
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var chaiAsPromised = require("chai-as-promised");
var expect = chai.expect;
var storage = new StorageService(new StorageProvider(process.env.FIREBASE_URL));
var token = process.env.FIREBASE_SECRET;
chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('Security Module', function () {
  this.timeout(10000);
  var provider = new AuthProviderFirebase(process.env.FIREBASE_URL);
  var rand = crypto.randomBytes(10).toString('hex');
  var auth = new AuthService(provider, storage);
  var email = 'test@user.com';
  var password = rand;
  var newPassword = 'newPassword1';
  var property;
  after(function (done) {
    new Firebase(process.env.FIREBASE_URL)
    .removeUser({ email: email, password: newPassword }, done);
  });
  it('should respect logic', function () {
    expect(true).to.be.true;
    expect(true).not.to.be.false;
  });
  it('should create users', function () {
    var promise = auth.createUser(email, password);
    return expect(promise).to.eventually.be.fulfilled;
  });
  it('should log users in', function () {
    var promise = auth.loginWithEmail(email, password);
    return expect(promise).to.eventually.be.fulfilled;
  });
  it('should remember that users are authenticated', function () {
    expect(auth.isAuthenticated()).to.be.true;
  });
  it('should log users out', function () {
    auth.logout();
    expect(auth.isAuthenticated()).to.be.false;
  });
  it('should let users reset passwords', function () {
    var promise = auth.resetPassword(email, password, newPassword)
    .then(function () { return auth.loginWithEmail(email, newPassword); })
    return expect(promise).to.eventually.be.fulfilled;
  });
  it('should let robots login with tokens', function () {
    auth.logout();
    expect(auth.isAuthenticated()).to.be.false;
    var promise = auth.loginWithToken(token)
    .then(function () {
      expect(auth.isAuthenticated()).to.be.true;
    });
    return expect(promise).to.eventually.be.fulfilled;
  });
});
