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
let test_thread_id2 = "";
let test_reply_id = "";

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

      test("all fields fill - post to be deleted", function(done) {
        chai
          .request(server)
          .post("/api/threads/test-board")
          .send({
            text:
              "  This is my second test message board - this must be deleted   ",
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
            test_thread_id2 = res.body[1]._id;
            assert.equal(res.status, 200);
            assert.isArray(res.body, "res should be an array");
            assert.isObject(res.body[0]);
            assert.notProperty(res.body[0], "delete_password");
            assert.notProperty(res.body[0], "reported");
            assert.property(res.body[0], "_id");
            assert.property(res.body[0], "created_on");
            assert.property(res.body[0], "bumped_on");
            assert.property(res.body[0], "text");
            assert.property(res.body[0], "board");
            assert.equal(res.body[0].board, "test-board");
            done();
          });
      });
    });

    suite("DELETE", function() {
      test("Delete thread with incorrect delete_password", function(done) {
        chai
          .request(server)
          .delete("/api/threads/test-board")
          .send({
            thread_id: test_thread_id2,
            delete_password: "incorrect",
          })
          .end(function(err, res) {
            assert.equal(res.status, 500, "status error");
            assert.equal(res.text, "incorrect password");
            done();
          });
      });

      test("Delete thread with correct thread_id and delete_password", function(done) {
        chai
          .request(server)
          .delete("/api/threads/test-board")
          .send({
            thread_id: test_thread_id2,
            delete_password: "02$del*&2",
          })
          .end(function(err, res) {
            assert.equal(res.status, 200, "status error");
            assert.equal(res.text, "success");
            done();
          });
      });
    });
    suite("PUT", function() {
      test("report a thread passing valid thread_id", function(done) {
        chai
          .request(server)
          .put("/api/threads/test-board")
          .send({ thread_id: test_thread_id })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "success");
            done();
          });
      });
    });
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
            test_reply_id = res.body.replies[0]._id;
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.notProperty(res.body, "delete_password");
            assert.notProperty(res.body, "reported");
            assert.property(res.body, "_id");
            assert.property(res.body, "created_on");
            assert.property(res.body, "bumped_on");
            assert.property(res.body, "text");
            assert.property(res.body, "board");
            assert.equal(res.body.board, "test-board");
            assert.isArray(res.body.replies, "Replies should be an array");
            done();
          });
      });
    });

    suite("PUT", function() {
      test("report a reply passing valid reply_id", function(done) {
        chai
          .request(server)
          .put("/api/replies/test-board")
          .send({ thread_id: test_thread_id, reply_id: test_reply_id })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "success");
            done();
          });
      });
    });

    suite("DELETE", function() {
      test("Delete reply with correct thread_id and delete_password", function(done) {
        chai
          .request(server)
          .delete("/api/replies/test-board")
          .send({
            thread_id: test_thread_id,
            reply_id: test_reply_id,
            delete_password: "0d&2",
          })
          .end(function(err, res) {
            assert.equal(res.status, 200, "status error");
            assert.equal(res.text, "success");
            done();
          });
      });
    });
  });
});
