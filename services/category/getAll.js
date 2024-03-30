const CategoryRepository = require("../../repositories/category");
const categoryRepository = new CategoryRepository();
module.exports = class {
  constructor() {}
  async getAll(req, res) {
    const category = await categoryRepository.getAll(req?.query?.type);
    res.send(
      category.length
        ? { status: 1, message: category }
        : { status: 0, message: [] }
    );
  }
};
