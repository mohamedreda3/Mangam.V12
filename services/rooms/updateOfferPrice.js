const RoomRepository = require("../../repositories/room");
const roomRepository = new RoomRepository();

module.exports = class {
  constructor() {}
  async updateOfferPrice(req, res) {
    const room = await roomRepository.updateOfferPrice(req.body);

    res.send(room);
  }
};
