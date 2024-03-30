const express = require("express");
const Router = express.Router();
const Banners = require("../controllers/banner");
const banners = new Banners;

Router.get("/getAll", (req, res) => banners.getAll(req, res));
Router.post("/updateHidden", (req, res) => banners.updateHidden(req, res));
Router.post("/add_banner", (req, res) => banners.add_banner(req, res));
Router.post("/edit_banner", (req, res) => banners.edit_banner(req, res));

module.exports = Router;