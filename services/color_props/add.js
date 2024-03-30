const ColorPropRepository = require("../../repositories/colorProps");
const colorPropRepository = new ColorPropRepository();

module.exports = class {
  constructor() {}
  async add(req, res) {
    const rate = await colorPropRepository.add(req.body);

    res.send(
      rate?.affectedRows
        ? { status: 1, message: rate?.insertId }
        : { status: 0, message: "Prop Not Added" }
    );
  }
};
