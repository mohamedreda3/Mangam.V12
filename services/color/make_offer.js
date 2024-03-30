const ColorRepository = require("../../repositories/color");
const colorRepository = new ColorRepository();

module.exports = class {
  constructor() {}
  async make_offer(req, res) {
    const rate = await colorRepository.make_offer(req.body);

    res.send(rate);
  }
};
