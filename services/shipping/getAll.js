const md5 = require("md5");
const ShippingRepository = require("../../repositories/shipping");
const shippingRepository = new ShippingRepository();

module.exports = class {
  constructor() {}
  async getAll(req, res) {
    
    const ships = await shippingRepository.getAll(req.body);
    res.send(
      ships?.length
        ? { status: 1, message: ships }
        : { status: 0, message:[]}
    );
  }
};
