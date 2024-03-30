const ReasonRepository = require("../../repositories/reasons");
const reasonRepository = new ReasonRepository();
module.exports = class {
  constructor() {}
  async getAll(req, res) {
    const reason = await reasonRepository.getAll();
    res.send(
      reason.length
        ? { status: 1, message: reason }
        : { status: 0, message: [] }
    );
  }
};
