/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function() {
  suite("API ROUTING FOR /api/threads/:board", function() {
    suite("POST", function() {
      test("all fields fill", function(done) {
        chai
          .request(server)
          .post("/api/threads/test-board")
          .send({
            text: "  This is my first test message board - 54321   ",
            delete_password: "02$del*&2",
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.property(res, "body", "Body error");
            done();
          });
      });

      test("text fields not filled", function(done) {
        chai
          .request(server)
          .post("/api/threads/test-board")
          .send({
            text: "      ",
            delete_password: "02$del*&2",
          })
          .end(function(err, res) {
            assert.equal(res.text, "text field is required");
            assert.equal(res.status, 401);
            done();
          });
      });

      test("delete_password fields not filled", function(done) {
        chai
          .request(server)
          .post("/api/threads/test-board")
          .send({
            text: "  This is my first test message board - 54321   ",
            delete_password: "",
          })
          .end(function(err, res) {
            assert.equal(res.text, "delete_password field is required");
            assert.equal(res.status, 402);
            done();
          });
      });
    });

    suite('GET', function() {
      
    });

    /*suite("DELETE", function() {});

    suite("PUT", function() {}); */
  });

  suite("API ROUTING FOR /api/replies/:board", function() {
    suite("POST", function() {
      test("all fields fill", function(done) {
        chai
          .request(server)
          .post("/api/replies/test-board")
          .send({
            thread_id: "5d17d37af205d2493dc39e5b",
            text: "This is my first reply to message board - 54321",
            delete_password: "0d&2",
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.property(res, "body", "Body error");
            done();
          });
      });

      test("invalid thread_id", function(done) {
        chai
          .request(server)
          .post("/api/replies/test-board")
          .send({
            thread_id: "Th1si2aInval1d",
            text: "  This is my first reply to message board - 54321   ",
            delete_password: "02$d&2",
          })
          .end(function(err, res) {
            assert.equal(res.status, 500);
            assert.equal(
              res.text,
              'Cannot update thread. error: CastError: Cast to ObjectId failed for value "Th1si2aInval1d" at path "_id" for model "Thread"',
              "Invalid thread id error",
            );
            done();
          });
      });
    });
    /*
    suite("GET", function() {});

    suite("PUT", function() {});

    suite("DELETE", function() {});*/
  });
});
