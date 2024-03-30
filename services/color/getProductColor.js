const groupProducts = require("../../functions/groupProducts");
const ColorRepository = require("../../repositories/color");
const colorRepository = new ColorRepository();

module.exports = class {
  constructor() { }
  async add(req, res) {
    const { products, images, colors } = await colorRepository.getProducts(
      req.body
    );
    groupProducts({
      products, colors: colors ? colors : [],
      images: images ? images : []
    });

    res.send(
      colors?.length
        ? { status: 1, message: products }
        : { status: 0, message: [] }
    );
  }
};
