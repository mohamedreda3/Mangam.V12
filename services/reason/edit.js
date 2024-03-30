const ReasonRepo = require("../../repositories/reasons");
const reasonRepo = new ReasonRepo();
const axios = require("axios");
module.exports = class {
  constructor() {}
  async edit(req, res) {
    const { text, text_ar, id } = req?.body;

    const add = await reasonRepo.edit({ text, text_ar, id });

    res.send(
      add?.affectedRows
        ? { status: 1, message: "Updated" }
        : { status: 0, message: "Error Occurred" }
    );
  }
};
