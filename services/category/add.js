const CategoryRepo = require("../../repositories/category");
const categoryRepo = new CategoryRepo();
const axios = require("axios");
module.exports = class {
  constructor() {}
  async add(req, res) {
    const { title, image_url, title_ar } = req?.body;
    // let thumbnail = req?.file;
  //  https://res.cloudinary.com/dsqlywnj5/image/upload/v1692194108/erwonud2hs5oj8ecy8bt.png
    const add = await categoryRepo.add({ title, image_url, title_ar });
    // console.log(add);
    res.send(
      add?.affectedRows
        ? { status: 1, message: "Added" }
        : { status: 0, message: "Error Occurred" }
    );
  }
};
