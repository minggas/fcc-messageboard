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
  app.route("/api/threads/:board");

  app.route("/api/replies/:board");
};
