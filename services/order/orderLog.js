const Get_Order_Details = require("../../repositories/order");
const get_Order_Details = new Get_Order_Details();

module.exports = class {
  constructor() {}
  async getLogs(req, res) {
    const user_id = req?.query?.user_id;
    let { order, shipping } = await get_Order_Details.getAll(user_id, {
      type: null,
    });
    if (order && order.length) {
      order[0].shipping = shipping;
      res.send(
        order.length
          ? { status: 1, message: order }
          : { status: 0, message:[] }
      );
    } else {
      res.status(404).send({ status: 0, message: "Order not found" });
    }
  }
  catch(error) {
    console.error(error);
    res.status(500).send({ status: 0, message: "Internal Server Error" });
  }
};
