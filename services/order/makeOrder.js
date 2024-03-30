const Order = require("../../repositories/order");
const order = new Order();

module.exports = class {
  constructor() {}
  makeOrder = async (req, res) => {
    const makeOrder = await order.makeOrder(req?.body);
    res.send(
      makeOrder?.affectedRows
        ? { status: 1, message: "Order Created Successfully" }
        : { status: 0, message: makeOrder?.message }
    );
  };
};
