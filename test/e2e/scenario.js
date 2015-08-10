var crypto = require('crypto');
var Firebase = require('firebase');
var ref = new Firebase(process.env.FIREBASE_URL);
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

describe('Auth Service', function() {
  this.timeout(10000);
  var provider = new AuthProviderFirebase(ref, storage);
  var rand = crypto.randomBytes(10).toString('hex');
  var auth = new AuthService(provider);
  var email = 'test@user.com';
  var password = rand;
  var roles = ['owner'];
  var newPassword = 'newPassword1';
  var createUserPromise;
  after(function(done) {
    var firebaseRef = new Firebase(process.env.FIREBASE_URL);
    firebaseRef.removeUser({
      email: email,
      password: newPassword
    }, function() {
      firebaseRef.removeUser({
        email: 'test@test.test',
        password: 'fakepassword1'
      }, done);
    });
  });
  it('should respect logic', function() {
    expect(true).to.be.true;
    expect(true).not.to.be.false;
  });
  it('should create users', function() {
    createUserPromise = auth.createUser(email, password, roles);
    return expect(createUserPromise).to.eventually.be.fulfilled;
  });
  it('should log users in', function() {
    var promise = auth.loginWithEmail(email, password)
    return expect(promise).to.eventually.be.fulfilled;
  });
  it('should load newly created user records', function() {
    var promise = createUserPromise
      .then(function(record) {
        return record.load();
      });
    return expect(promise).to.eventually.be.fulfilled;
  });
  it('should remember that users are authenticated', function() {
    expect(auth.isAuthenticated()).to.be.true;
  });
  it('should load the authed user record', function() {
    var promise = auth.getAuthedUser().load();
    return expect(promise).to.eventually.be.fulfilled;
  });
  it('should know the user is an owner', function() {
    var promise = auth.authedUserHasRole('owner');
    return expect(promise).to.eventually.be.fulfilled;
  });
  it('should know the user is not a tenant', function() {
    var promise = auth.authedUserHasRole('tenant');
    return expect(promise).to.eventually.be.rejected;
  });
  it('should load the authed user\'s role records', function() {
    var promise = auth.getAuthedUserRoles()
      .then(function(roles) {
        expect(roles.owner).not.to.be.an('undefined');
        expect(roles.tenant).to.be.an('undefined');
      });
    return expect(promise).to.eventually.be.fulfilled;
  });
  it('should log users out', function() {
    auth.logout();
    expect(auth.isAuthenticated()).to.be.false;
  });
  it('should know unauthed users have no roles', function() {
    var promise = auth.authedUserHasRole('owner');
    return expect(promise).to.eventually.be.rejected;
  });
  it('should not load roles of unauthed users', function() {
    var promise = auth.getAuthedUserRoles();
    return expect(promise).to.eventually.be.rejected;
  });
  it('should let users reset passwords', function() {
    var promise = auth.resetPassword(email, password, newPassword)
      .then(function() {
        return auth.loginWithEmail(email, newPassword);
      })
    return expect(promise).to.eventually.be.fulfilled;
  });
  it('should let robots login with tokens', function() {
    auth.logout();
    expect(auth.isAuthenticated()).to.be.false;
    var promise = auth.loginWithToken(token)
      .then(function() {
        expect(auth.isAuthenticated()).to.be.true;
      });
    return expect(promise).to.eventually.be.fulfilled;
  });
  it('should create a user with an avater image', function(done) {
    var createUserWithImagePromise = auth.createUser('test@test.test', 'fakepassword1', ['contractor'], ['test-contractor-id'], 'image-id-1234', 'permission-id-1234');
    createUserWithImagePromise.then(function(userRecord) {
      var userRecordAvatarImageID = userRecord.getData().avatarImage;
      var userPermissionID = userRecord.getData().permission_id;
      expect(userRecordAvatarImageID).to.equal('image-id-1234');
      expect(userPermissionID).to.equal('permission-id-1234');
      done();
    }, function(err) {
      console.log(err);
    });
  });
});