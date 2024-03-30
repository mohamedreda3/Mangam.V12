const ColorRepository = require("../../repositories/color");
const colorRepository = new ColorRepository();

module.exports = class {
  constructor() {}
  async add(req, res) {
    const rate = await colorRepository.add_color(req.body);

    res.send(
      rate?.insertId
        ? { status: 1, message: rate?.insertId }
        : { status: 0, message: "Color Not Added" }
    );
  }
};
