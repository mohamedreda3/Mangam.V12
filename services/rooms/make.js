const RoomRepository = require("../../repositories/room");
const roomRepository = new RoomRepository();

module.exports = class {
  constructor() {}
  async make(req, res) {
    const room = await roomRepository.make(req.body);

    res.send(room);
  }
};
