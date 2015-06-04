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
  createUser: function () { return q.resolve(uid); },
  loginWithEmail: function () { return q.resolve(); },
  loginWithToken: function () { return q.resolve(); },
  logout: function () { return true; },
  isAuthenticated: function () { return true; },
  requestPasswordReset: function () { return q.resolve(); },
  resetPassword: function () { return q.resolve(); },
  getAuthedUser: function () {
    return {
      load: function () { return q.resolve(); }
    }
  },
  getAuthedUserRoles: function () {
    return q.resolve({
      cat: { load: function () { return q.resolve(); } },
      boat: { load: function () { return q.resolve(); } }
    });
  },
  authedUserHasRole: function (role) {
    if (role === 'cat' || role === 'boat') { return q.resolve(); }
    else { return q.reject(); }
  }
}
describe('AuthService', function () {
  var auth = new AuthService(mockProvider);
  var email = 'test.user@entercastle.com';
  var password = 'fakepassword1';
  var roles = ['cat', 'boat']
  var token = 'abc123';
  it('should respect logic', function () {
    expect(true).to.be.true;
    expect(true).not.to.be.false;
  });
  it('should require a provider', function () {
    expect(function () { new AuthService(); }).to.throw('Authentication provider required');
  });
  it('should create new users', function () {
    var promise = auth.createUser(email, password, roles);
    return expect(promise).to.eventually.be.fulfilled;
  });
  it('should require email to create new users', function () {
    var promise = auth.createUser();
    return expect(promise).to.eventually.be.rejectedWith('Email required');
  });
  it('should require password to create new users', function () {
    var promise = auth.createUser(email);
    return expect(promise).to.eventually.be.rejectedWith('Password required');
  });
  it('should require roles to create new users', function () {
    var promise = auth.createUser(email, password);
    return expect(promise).to.eventually.be.rejectedWith('Roles array required');
  });
  it('should log users in', function () {
    var promise = auth.loginWithEmail(email, password);
    return expect(promise).to.eventually.be.fulfilled;
  });
  it('should log robots in', function () {
    var promise = auth.loginWithToken(token);
    return expect(promise).to.eventually.be.fulfilled;
  });
  it('should require email to log users in', function () {
    var promise = auth.loginWithEmail();
    return expect(promise).to.eventually.be.rejectedWith('Email required');
  });
  it('should require password to login users in', function () {
    var promise = auth.loginWithEmail(email);
    return expect(promise).to.eventually.be.rejectedWith('Password required');
  });
  it('should load authenticated user record', function () {
    var promise = auth.getAuthedUser().load();
    return expect(promise).to.eventually.be.fulfilled;
  });
  it('should know the authed user has the cat role', function () {
    var promise = auth.authedUserHasRole('cat');
    return expect(promise).to.eventually.be.fulfilled;
  });
  it('should know the authed user does not have the dog role', function () {
    var promise = auth.authedUserHasRole('dog');
    return expect(promise).to.eventually.be.rejected;
  });
  it('should load authenticated user\'s role records', function () {
    var promise = auth.getAuthedUserRoles()
    .then(function (roles) {
      expect(roles.cat).not.to.be.an('undefined');
      expect(roles.dog).to.be.an('undefined');
      return roles.cat.load();
    });
    return expect(promise).to.eventually.be.fulfilled;
  });
  it('should log users out', function () {
    var spy = sinon.spy(mockProvider, 'logout');
    expect(auth.logout()).to.be.true;
    expect(spy).to.have.been.called;
  });
  it('should check if users are logged in', function () {
    var spy = sinon.spy(mockProvider, 'isAuthenticated');
    expect(auth.isAuthenticated()).to.be.true;
    expect(spy).to.have.been.called;
  });
  it('should allow users to request password resets', function () {
    var promise = auth.requestPasswordReset(email);
    return expect(promise).to.eventually.be.fulfilled;
  });
  it('should require email for password reset requests', function () {
    var promise = auth.requestPasswordReset();
    return expect(promise).to.eventually.be.rejected;
  });
  it('should allow users to reset passwords', function () {
    var promise = auth.resetPassword(email, password, 'newpassword');
    return expect(promise).to.eventually.be.fulfilled;
  });
});
