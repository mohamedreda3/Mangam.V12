const doQuery = require("../../config/doQuery");
const Return_itemRepository = require("../../repositories/returns");
const return_itemRepository = new Return_itemRepository();
const Get_Order_Details = require("../../repositories/order");
const get_Order_Details = new Get_Order_Details();
const Group = require("../../functions/groupProducts");

module.exports = class {
  constructor() {}
  async return_item(req, res) {

    const return_item = await return_itemRepository.updateStatus(req.body);

    res.send(return_item);
  }
};
