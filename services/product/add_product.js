const ProductRepository = require("../../repositories/product");
const productRepository = new ProductRepository();

module.exports = class {
  constructor() {}
  async add(req, res) {
    const rate = await productRepository.add_product(req.body);

    res.send(
      rate?.affectedRows
        ? { status: 1, message: rate?.insertId }
        : { status: 0, message: "Product Not Added" }
    );
  }
};
