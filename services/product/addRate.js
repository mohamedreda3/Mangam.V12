const ProductRepository = require("../../repositories/product");
const productRepository = new ProductRepository();

module.exports = class {
  constructor() {}
  async rate(req, res) {
    const rate = await productRepository.rate(req.body);

    res.send(
      rate?.affectedRows
        ? { status: 1, message: "Review Added Successfully" }
        : { status: 0, message: "Review Not Added" }
    );
  }
};
