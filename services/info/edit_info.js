const InfoRepository = require("../../repositories/info");
const infoRepository = new InfoRepository();

module.exports = class {
  constructor() {}
  async edit(req, res) {
    const rate = await infoRepository.edit_info(req.body);

    res.send(
      rate?.affectedRows
        ? { status: 1, message: "Info Editted Successfully" }
        : { status: 0, message: "Info Not Editted" }
    );
  }
};
