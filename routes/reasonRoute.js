const express = require("express");
const Router = express.Router();
const Reasons = require("../controllers/reason");
const reasons = new Reasons;
const multer = require("multer")
Router.get("/getAll", (req, res) => reasons.getAll(req, res));
Router.post("/delete", (req, res) => reasons.delete(req, res));
Router.post("/add", (req, res) => reasons.add(req, res));
Router.post("/edit", (req, res) => reasons.edit(req, res));

module.exports = Router; 