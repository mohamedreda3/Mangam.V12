const ColorPropRepository = require("../../repositories/colorProps");
const colorPropRepository = new ColorPropRepository();

module.exports = class {
  constructor() {}
  async edit(req, res) {
    const rate = await colorPropRepository.edit_value(req.body);

    res.send(
      rate?.affectedRows
        ? { status: 1, message: "Prop Editted Successfully" }
        : { status: 0, message: "Prop Not Editted" }
    );
  }
};
