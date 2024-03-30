const express = require("express");
const Router = express.Router();
const Return_item = require("../controllers/return")
const return_item = new Return_item;

Router.post("/orderReturn", (req, res) => return_item.return(req, res));
Router.post("/updateStatus", (req, res) => return_item.updateStatus(req, res));
Router.post("/getReturns", (req, res) => return_item.getReturns(req, res));



module.exports = Router;