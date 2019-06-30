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
let test_thread_id = "";

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

    suite("GET", function() {
      test("Show recent threads", function(done) {
        chai
          .request(server)
          .get("/api/threads/test-board")
          .end(function(err, res) {
            test_thread_id = res.body[0]._id;
            assert.equal(res.status, 200);
            assert.isArray(res.body, "res should be an array");
            assert.isObject(res.body[0]);
            assert.notProperty(res.body[0], "delete_password");
            assert.notProperty(res.body[0], "reported");
            done();
          });
      });
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
            thread_id: test_thread_id,
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
            assert.equal(res.status, 403);
            assert.equal(
              res.text,
              "invalid Thread id",
              "Invalid thread id error",
            );
            done();
          });
      });
    });

    suite("GET", function() {
      test("Show entire test-board thread with all its replies", function(done) {
        chai
          .request(server)
          .get("/api/replies/test-board")
          .query({
            thread_id: test_thread_id,
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.notProperty(res.body, "delete_password");
            assert.notProperty(res.body, "reported");
            assert.property(res.body, "text");
            assert.property(res.body, "_id");
            assert.isArray(res.body.replies, "Replies should be an array");
            done();
          });
      });
    });
    /*
    suite("PUT", function() {});

    suite("DELETE", function() {});*/
  });
});
