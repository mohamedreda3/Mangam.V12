const ProductRepository = require("../../repositories/product");
const productRepository = new ProductRepository();

module.exports = class {
  constructor() {}
  async edit(req, res) {
    const rate = await productRepository.edit_product(req.body);

    res.send(
      rate?.affectedRows
        ? { status: 1, message: "Product Editted Successfully" }
        : { status: 0, message: "Product Not Editted" }
    );
  }
};
