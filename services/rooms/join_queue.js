const RoomRepository = require("../../repositories/room");
const roomRepository = new RoomRepository();

module.exports = class {
  constructor() {}
  async join_queue(req, res) {
    const room = await roomRepository.join_queue(req.body);
    res.send(room);
  }
};
