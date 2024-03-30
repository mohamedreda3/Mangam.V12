const express = require("express");
const Router = express.Router();
const User = require("../controllers/user");
const user = new User();

Router.post("/signup", (req, res) => user.sign_up(req, res));
Router.post("/login", (req, res) => user.login(req, res));
Router.post("/getInfo", (req, res) => user.getInfo(req, res));
Router.post("/updateInformation", (req, res) => user.update(req, res));

module.exports = Router;
