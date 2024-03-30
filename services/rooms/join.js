const RoomRepository = require("../../repositories/room");
const roomRepository = new RoomRepository();

module.exports = class {
  constructor() {}
  async join(req, res) {
    const room = await roomRepository.join(req.body);
    res.send(room);
  }
};
