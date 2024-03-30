const doQuery = require("../../config/doQuery");
const Return_itemRepository = require("../../repositories/returns");
const return_itemRepository = new Return_itemRepository();

module.exports = class {
  constructor() {}
  async return_item(req, res) {
    const return_item = await return_itemRepository.add(req.body);

    res.send(return_item);
  }
};
