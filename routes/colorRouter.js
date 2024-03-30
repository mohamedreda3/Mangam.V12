const express = require("express");
const Router = express.Router();
const Colors = require("../controllers/color");
const colors = new Colors;
Router.post("/add", (req, res) => colors.add_color(req, res));
Router.post("/edit", (req, res) => colors.edit_color(req, res));
Router.post("/getProducts", (req, res) => colors.getProducts(req, res));
Router.post("/make_offer", (req, res) => colors.make_offer(req, res));

module.exports = Router;