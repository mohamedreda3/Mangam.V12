const doQuery = require("../../config/doQuery");
const Return_itemRepository = require("../../repositories/returns");
const return_itemRepository = new Return_itemRepository();

module.exports = class {
  constructor() {}
  async getReturns(req, res) {
    const getReturns = await return_itemRepository.getReturns(req.body);

    res.send(getReturns);
  }
};
