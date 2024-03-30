const ColorRepository = require("../../repositories/color");
const colorRepository = new ColorRepository();

module.exports = class {
  constructor() {}
  async edit(req, res) {
    const rate = await colorRepository.edit_color(req.body);

    res.send(
      rate?.affectedRows
        ? { status: 1, message: "Color Editted Successfully" }
        : { status: 0, message: "Color Not Editted" }
    );
  }
};
