const ColorPropRepository = require("../../repositories/colorProps");
const colorPropRepository = new ColorPropRepository();

module.exports = class {
  constructor() {}
  async get_value(req, res) {
    const rate = await colorPropRepository.get(req.body);

    res.send(
      rate?.length
        ? { status: 1, message: rate }
        : { status: 0, message:[]}
    );
  }
};
