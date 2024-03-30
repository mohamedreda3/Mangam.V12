const ReasonRepo = require("../../repositories/reasons");
const reasonRepo = new ReasonRepo();

module.exports = class {
  constructor() {}
  async edit(req, res) {
    const { id } = req?.body;

    const add = await reasonRepo.delete({ id });

    res.send(
      add?.affectedRows
        ? { status: 1, message: "Deleted" }
        : { status: 0, message: "Error Occurred" }
    );
  }
};
