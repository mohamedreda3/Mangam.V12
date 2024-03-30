const CategoryRepo = require("../../repositories/category");
const categoryRepo = new CategoryRepo();
const axios = require("axios");
module.exports = class {
  constructor() {}
  async edit(req, res) {
    const { title, image_url,title_ar,  id } = req?.body;

    const add = await categoryRepo.edit({ title, image_url,title_ar, id });

    res.send(
      add?.affectedRows
        ? { status: 1, message: "Updated" }
        : { status: 0, message: "Error Occurred" }
    );
  }
};
