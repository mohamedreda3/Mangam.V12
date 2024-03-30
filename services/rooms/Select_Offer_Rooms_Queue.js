const RoomRepository = require("../../repositories/room");
const roomRepository = new RoomRepository();

module.exports = class {
  constructor() {}
  async Select_Offer_Rooms_Queue(req, res) {
    const room = await roomRepository.Select_Offer_Rooms_Queue(req.body);
    res.send(room);
  }
};
