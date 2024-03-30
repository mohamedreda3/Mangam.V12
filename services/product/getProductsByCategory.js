const ProductRepository = require("../../repositories/product");
const productRepository = new ProductRepository();
const Group = require("../../functions/groupProducts");

module.exports = class {
  constructor() { }
  async getProductsByCategory(req, res) {
    const { products, images, colors, customerReviews, props, props_values } =
      await productRepository.getProductsByCategory(req?.query?.id);
    const product = Group({
      products,
      colors: colors ? colors : [],
      images: images ? images : [],
      customerReviews: customerReviews ? customerReviews : [],
      props: props ? props : [],
      props_values: props_values ? props_values : [],
    });
    res.send(
      product.length
        ? { status: 1, message: product }
        : { status: 0, message: [] }
    );
  }
};
