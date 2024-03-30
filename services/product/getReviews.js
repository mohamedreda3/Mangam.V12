const ProductRepository = require("../../repositories/product");
const productRepository = new ProductRepository();

module.exports = class {
  constructor() {}
  async getReviews(req, res) {
    let { reviews, user_data } = await productRepository.getReviews(
      req?.query?.user_id,
      req?.query?.id
    );
    reviews.user_data = [];
    reviews.map((item) => {
      user_data.map((u_item) => {
        if (u_item?.id == item?.user_id) {
          item.user_data = u_item;
        }
      });
    });
    res.send(
      reviews.length
        ? { status: 1, message: reviews }
        : { status: 0, message:  [] }
    );
  }
};
