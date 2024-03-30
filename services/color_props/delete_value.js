const ColorPropRepository = require("../../repositories/colorProps");
const colorPropRepository = new ColorPropRepository();

module.exports = class {
  constructor() {}
  async delete_value(req, res) {
    const rate = await colorPropRepository.delete_value(req?.body?.prop_value_id);
    // console.log(req?.body);
    res.send(
      rate?.affectedRows
        ? { status: 1, message: "DELETED" }
        : { status: 0, message: "Error Occured" }
    );
  }
};
