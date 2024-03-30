const OrderRepository = require("../../repositories/order");
const orderRepository = new OrderRepository();

module.exports = class {
  constructor() {}
  async rate(req, res) {
    const rate = await orderRepository.rate(req.body);

    res.send(
      rate?.affectedRows
        ? { status: 1, message: "Review Added Successfully" }
        : { status: 0, message: "Review Not Added" }
    );
  }
};
