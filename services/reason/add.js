const ReasonRepo = require("../../repositories/reasons");
const reasonRepo = new ReasonRepo();
const axios = require("axios");
module.exports = class {
  constructor() {}
  async add(req, res) {
    const { text_ar, text } = req?.body;
    
    const add = await reasonRepo.add({ text_ar, text});
    // console.log(add);
    res.send(
      add?.affectedRows
        ? { status: 1, message: "Added" }
        : { status: 0, message: "Error Occurred" }
    );
  }
};
