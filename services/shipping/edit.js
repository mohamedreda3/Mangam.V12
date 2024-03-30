const md5 = require("md5");
const ShippingRepository = require("../../repositories/shipping");
const shippingRepository = new ShippingRepository();

module.exports = class {
  constructor() {}
  async edit(req, res) {
    
    const shipEdit = await shippingRepository.edit(req.body);
    res.send(
      shipEdit?.affectedRows
        ? { status: 1, message: "Shipping method Updated Successfully" }
        : { status: 0, message: "Shipping method Not Updated" }
    );
  }
};
