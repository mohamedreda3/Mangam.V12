const OrderRepository = require("../../repositories/order");
const orderRepository = new OrderRepository();
module.exports = class {
  constructor() {}
  async changeStatus(req, res) {
    const order = await orderRepository.changeStatus(req?.body);
    res.send(
      order.changedRows
        ? { status: 1, message: "Updated" }
        : {
            status: 0,
            message: order.message ? order.message : "Error Occurred",
          }
    );
  }
};
