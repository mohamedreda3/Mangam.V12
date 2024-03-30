module.exports = class {
  constructor() {}
  async getOrderDetails(req, res) {
    const Order = require("../../services/order/getOrderDetails");
    const order = new Order();
    await order.getDetails(req, res);
  }
  async changeStatus(req, res) {
    const Order = require("../../services/order/changeStatus");
    const order = new Order();
    await order.changeStatus(req, res);
  }
  async getAll(req, res) {
    const Order = require("../../services/order/getAll");
    const order = new Order();
    await order.getAll(req, res);
  }
  async getLogs(req, res) {
    const Order = require("../../services/order/orderLog");
    const order = new Order();
    await order.getLogs(req, res);
  }
  async makeOrder(req, res) {
    const Order = require("../../services/order/makeOrder");
    const order = new Order();
    await order.makeOrder(req, res);
  }
  async rate(req, res) {
    const Order = require("../../services/order/rateOrder");
    const order = new Order();
    await order.rate(req, res);
  }
  async orderPayUpdating(req, res) {
    const Order = require("../../services/order/orderPayUpdate");
    const order = new Order();
    await order.orderPayUpdate(req, res);
  }
  async getNotification(req, res) {
    const Order = require("../../services/order/getNotification");
    const order = new Order();
    await order.getNotification(req, res);
  }
};
