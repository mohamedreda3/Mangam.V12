const express = require("express");
const Router = express.Router();
const Order = require("../controllers/order")
const order = new Order;

Router.get("/order_details", (req, res) => order.getOrderDetails(req, res));
Router.post("/changeStatus", (req, res) => order.changeStatus(req, res));
Router.post("/getAll", (req, res) => order.getAll(req, res));
Router.post("/getLogs", (req, res) => order.getLogs(req, res));
Router.post("/make", (req, res) => order.makeOrder(req, res));
Router.post("/rate", (req, res) => order.rate(req, res));
Router.post("/orderPayUpdating", (req, res) => order.orderPayUpdating(req, res));
Router.post("/notification", (req, res) => order.getNotification(req, res));


module.exports = Router;