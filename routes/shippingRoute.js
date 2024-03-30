const express = require("express");
const Router = express.Router();
const Shipping = require("../controllers/shipping")
const shipping = new Shipping;

Router.post("/add", (req, res) => shipping.add(req, res));
Router.post("/edit", (req, res) => shipping.edit(req, res));
Router.post("/getbyid", (req, res) => shipping.getbyId(req, res));
Router.post("/getAll", (req, res) => shipping.getAll(req, res));



module.exports = Router;