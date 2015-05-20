var q = require('q');
var AuthService = require('../../src/index.js');
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var chaiAsPromised = require("chai-as-promised");
var expect = chai.expect;
chai.use(sinonChai);
chai.use(chaiAsPromised);

var uid = '1';
var mockProvider = {
  create: function () { return q.resolve(uid); },
  loginWithEmail: function () { return q.resolve(); },
  loginWithToken: function () { return q.resolve(); },
  logout: function () { return true; },
  isAuthenticated: function () { return true; },
  requestPasswordReset: function () { return q.resolve(); },
  resetPassword: function () { return q.resolve(); }
}
var mockStorageService = {
  createRecord: function () {
    return {
      update: function () { return q.resolve(); },
      getID: function () { return uid; }
    }
  },
}
describe('AuthService', function () {
  var user = new AuthService(mockProvider, mockStorageService);
  var email = 'test.user@entercastle.com';
  var password = 'fakepassword1';
  var token = 'abc123';
  it('should respect logic', function () {
    expect(true).to.be.true;
    expect(true).not.to.be.false;
  });
  it('should require a provider', function () {
    expect(function () { new AuthService(); }).to.throw('Authentication provider required');
  });
  it('should create new users', function () {
    var promise = user.create(email, password);
    return expect(promise).to.eventually.be.fulfilled;
  });
  it('should require email to create new users', function () {
    var promise = user.create();
    return expect(promise).to.eventually.be.rejectedWith('Email required');
  });
  it('should require password to create new users', function () {
    var promise = user.create(email);
    return expect(promise).to.eventually.be.rejectedWith('Password required');
  });
  it('should log users in', function () {
    var promise = user.loginWithEmail(email, password);
    return expect(promise).to.eventually.be.fulfilled;
  });
  it('should log robots in', function () {
    var promise = user.loginWithToken(token);
    return expect(promise).to.eventually.be.fulfilled;
  });
  it('should require email to log users in', function () {
    var promise = user.loginWithEmail();
    return expect(promise).to.eventually.be.rejectedWith('Email required');
  });
  it('should require password to login users in', function () {
    var promise = user.loginWithEmail(email);
    return expect(promise).to.eventually.be.rejectedWith('Password required');
  });
  it('should log users out', function () {
    var spy = sinon.spy(mockProvider, 'logout');
    expect(user.logout()).to.be.true;
    expect(spy).to.have.been.called;
  });
  it('should check if users are logged in', function () {
    var spy = sinon.spy(mockProvider, 'isAuthenticated');
    expect(user.isAuthenticated()).to.be.true;
    expect(spy).to.have.been.called;
  });
  it('should allow users to request password resets', function () {
    var promise = user.requestPasswordReset(email);
    return expect(promise).to.eventually.be.fulfilled;
  });
  it('should require email for password reset requests', function () {
    var promise = user.requestPasswordReset();
    return expect(promise).to.eventually.be.rejected;
  });
  it('should allow users to reset passwords', function () {
    var promise = user.resetPassword(email, password, 'newpassword');
    return expect(promise).to.eventually.be.fulfilled;
  });
});
