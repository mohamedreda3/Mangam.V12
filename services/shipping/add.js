const md5 = require("md5");
const ShippingRepository = require("../../repositories/shipping");
const shippingRepository = new ShippingRepository();

module.exports = class {
  constructor() {}
  async addShipping(req, res) {
    
    const shipAdd = await shippingRepository.add(req.body);
    res.send(
      shipAdd?.affectedRows
        ? { status: 1, message: "Shipping method Added Successfully" }
        : { status: 0, message: "Shipping method Not Added" }
    );
  }
};
