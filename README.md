le-auth-service
=========

**Authenticate users**

## Installation

  `npm install le-auth-service`

## Usage

```
  var storage = /* initialize storage service */
  var provider = /* initialize auth provider (such as le-auth-provider-firebase) */
  var AuthService = require('le-auth-service');
  var auth = new AuthService(provider, storage);

  auth.createUser('user@email.com', 'abc123');
  .then(function (record) {
    ...
  });
```

## Tests

* `npm test` to run unit tests once
* `gulp tdd` to run unit and e2e tests when tests change
* `gulp coverage` to run unit tests and create a code coverage report

## Contributing

Please follow the project's [conventions](https://github.com/castle-dev/le-auth-service/blob/develop/CONTRIBUTING.md) or your changes will not be accepted

## Release History

* 0.1.0 Initial release
