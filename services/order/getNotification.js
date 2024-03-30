const Get_Order_Details = require("../../repositories/order");
const get_Order_Details = new Get_Order_Details();

module.exports = class {
  constructor() {}

  async getNotification(req, res) {
    await get_Order_Details.getNotification(req, res)
  }
};
