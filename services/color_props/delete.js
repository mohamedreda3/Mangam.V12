const ColorPropRepository = require("../../repositories/colorProps");
const colorPropRepository = new ColorPropRepository();

module.exports = class {
  constructor() {}
  async delete(req, res) {
    const deleteProp = await colorPropRepository.delete_props(req.body);
    res.send(
      deleteProp?.affectedRows
        ? { status: 1, message: "deleted" }
        : { status: 0, message: "Error Occured" }
    );
  }
};
