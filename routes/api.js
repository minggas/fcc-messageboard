/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const expect = require("chai").expect;
const mongoose = require("mongoose");
const Reply = require("../models/Reply").Reply;
const Thread = require("../models/Thread").Thread;

mongoose.connect(process.env.DB, { useNewUrlParser: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

module.exports = function(app) {
  app
    .route("/api/threads/:board")
    .post((req, res) => {
      if (!req.body.text.trim())
        return res.status(401).send("text field is required");
      if (!req.body.delete_password.trim())
        return res.status(402).send("delete_password field is required");

      const board = req.params.board;
      const text = req.body.text;
      const delete_password = req.body.delete_password;
      const newThread = new Thread({ board, text, delete_password });
      newThread.save((err, result) => {
        if (err)
          return res.status(500).send(`Cannot save thread. error: ${err}`);
        return res.redirect(`/b/${board}`);
      });
    })

  app
    .route("/api/replies/:board")
    .post((req, res) => {
    if (!req.body.text.trim())
      return res.status(401).send("text field is required");
    if (!req.body.delete_password.trim())
      return res.status(402).send("delete_password field is required");
      if (!mongoose.Types.ObjectId.isValid(req.body.thread_id))
        return res.status(403).send("invalid Thread id");

    const board = req.params.board;
    const text = req.body.text;
    const delete_password = req.body.delete_password;
    const thread_id = req.body.thread_id;
    const newReply = new Reply({ text, delete_password });
    Thread.updateOne(
      { _id: thread_id },
      {
        $set: { bumped_on: new Date() },
        $push: { replies: newReply },
      },
      (err, result) => {
        if (err)
          return res.status(500).send(`Cannot update thread. error: ${err}`);
        res.redirect(`/b/${board}`);
      },
    );
  });
};
