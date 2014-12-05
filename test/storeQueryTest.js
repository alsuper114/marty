var expect = require('chai').expect;
var Promise = require('es6-promise').Promise;
var StoreQuery = require('../lib/storeQuery');
var NotFoundError = require('../lib/errors/notFound');

describe('StoreQuery', function () {
  var query, expectedContext, actualContext;

  beforeEach(function () {
    expectedContext = { store: 1 };
  });

  describe('when the local query returns a value', function () {
    var expectedResult;
    beforeEach(function () {
      expectedResult = {foo: 'bar'};

      query = new StoreQuery(expectedContext, function () {
        actualContext = this;
        return expectedResult;
      });
    });

    it('should have a status of done', function () {
      expect(query.status).to.equal('done');
    });

    it('should say it is done', function () {
      expect(query.done).to.be.true;
    });

    it('should have the result', function () {
      expect(query.result).to.equal(expectedResult);
    });

    it('should set the context to the store', function () {
      expect(actualContext).to.equal(expectedContext);
    });
  });

  describe('when the local query throws an exception', function () {
    var expectedError;
    beforeEach(function () {
      expectedError = new Error();

      query = new StoreQuery(expectedContext, function () {
        throw expectedError;
      });
    });

    it('should have a status of failed', function () {
      expect(query.status).to.equal('failed');
    });

    it('should say its failed', function () {
      expect(query.failed).to.be.true;
    });

    it('should have the result', function () {
      expect(query.error).to.equal(expectedError);
    });
  });

  describe('when the local query does not return a value', function () {
    describe('when the remote query returns null', function () {
      beforeEach(function () {
        query = new StoreQuery(expectedContext, noop, noop);
      });

      it('should have a status of failed', function () {
        expect(query.status).to.equal('failed');
      });

      it('should say its failed', function () {
        expect(query.failed).to.be.true;
      });

      it('should have the result', function () {
        expect(query.error).to.be.instanceof(NotFoundError);
      });
    });

    describe('when the remote query returns a value', function () {
      var expectedResult;
      beforeEach(function () {
        expectedResult = {foo: 'bar'};

        query = new StoreQuery(expectedContext, noop, function () {
          actualContext = this;
          return expectedResult;
        });
      });

      it('should have a status of done', function () {
        expect(query.status).to.equal('done');
      });

      it('should say it is done', function () {
        expect(query.done).to.be.true;
      });

      it('should have the result', function () {
        expect(query.result).to.equal(expectedResult);
      });

      it('should set the context to the store', function () {
        expect(actualContext).to.equal(expectedContext);
      });
    });

    describe('when the remote query throws an exception', function () {
      var expectedError;
      beforeEach(function () {
        expectedError = new Error();

        query = new StoreQuery(expectedContext, noop, function () {
          throw expectedError;
        });
      });

      it('should have a status of failed', function () {
        expect(query.status).to.equal('failed');
      });

      it('should say its failed', function () {
        expect(query.failed).to.be.true;
      });

      it('should have the error', function () {
        expect(query.error).to.equal(expectedError);
      });
    });

    describe('when the remote query returns a promise', function () {
      describe('when the promise fails', function () {
        var expectedError;

        beforeEach(function (done) {
          expectedError = new Error();

          query = new StoreQuery(expectedContext, noop, function () {
            return new Promise(function (resolve, reject) {
              reject(expectedError);
            });
          });

          setTimeout(done, 1);
        });

        it('should have a status of failed', function () {
          expect(query.status).to.equal('failed');
        });

        it('should say its failed', function () {
          expect(query.failed).to.be.true;
        });

        it('should have the error', function () {
          expect(query.error).to.equal(expectedError);
        });
      });

      describe('when the promise completes done', function () {
        describe('when the local query then returns a value', function () {
          var expectedResult, localResult;

          beforeEach(function (done) {
            localResult = null;
            expectedResult = { foo: 'bar' };

            query = new StoreQuery(expectedContext, function () {
              return localResult;
            }, function () {
              return new Promise(function (resolve) {
                localResult = expectedResult;
                resolve();
              });
            });

            setTimeout(done, 1);
          });

          it('should have a status of done', function () {
            expect(query.status).to.equal('done');
          });

          it('should say it is done', function () {
            expect(query.done).to.be.true;
          });

          it('should have the result', function () {
            expect(query.result).to.equal(expectedResult);
          });
        });

        describe('when the local query then does not return a value', function () {
          beforeEach(function (done) {
            query = new StoreQuery(expectedContext, noop, function () {
              return new Promise(function (resolve) {
                resolve();
              });
            });

            setTimeout(done, 1);
          });

          it('should have a status of failed', function () {
            expect(query.status).to.equal('failed');
          });

          it('should say its failed', function () {
            expect(query.failed).to.be.true;
          });

          it('should have the error', function () {
            expect(query.error).to.be.instanceof(NotFoundError);
          });
        });
      });
    });
  });

  function noop() {
  }
});