const RoomRepository = require("../../repositories/room");
const roomRepository = new RoomRepository();

module.exports = class {
  constructor() {}
  async changeUserQueueStatus(req, res) {
    const room = await roomRepository.changeUserQueueStatus(req.body);
    res.send(room);
  }
};
