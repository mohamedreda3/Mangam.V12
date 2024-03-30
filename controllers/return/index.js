module.exports = class {
  constructor() {}
  async return(req, res) {
    const Return_item = require("../../services/returns/return_item");
    const return_item = new Return_item();
    await return_item.return_item(req, res);
  }
  async updateStatus(req, res) {
    const Return_item = require("../../services/returns/uodate_return_status");
    const return_item = new Return_item();
    await return_item.return_item(req, res);
  }
  async getReturns(req, res) {
    const Return_item = require("../../services/returns/getReturns");
    const return_item = new Return_item();
    await return_item.getReturns(req, res);
  }
};
