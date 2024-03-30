const Get_Order_Details = require("../../repositories/order");
const get_Order_Details = new Get_Order_Details();

module.exports = class {
  constructor() {}
  async getAll(req, res) {
    const user_id = req?.query?.user_id;
    const type = req?.query?.type;
    let { order } = await get_Order_Details.getAll(user_id, { type });
    res.send(
      order.length
        ? { status: 1, message: order }
        : { status: 0, message:[]}
    );
  }
};
