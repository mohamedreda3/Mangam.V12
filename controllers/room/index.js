module.exports = class {
  constructor() { }

  async make(req, res) {
    const Rooms = require("../../services/rooms/make");
    const rooms = new Rooms();
    await rooms.make(req, res);
  }

  async Select_Offer_Rooms(req, res) {
    const Rooms = require("../../services/rooms/Select_Offer_Rooms");
    const rooms = new Rooms();
    await rooms.Select_Offer_Rooms(req, res);
  }

  async join(req, res) {
    const Rooms = require("../../services/rooms/join");
    const rooms = new Rooms();
    await rooms.join(req, res);
  }
  
  async join_queue(req, res) {
    const Rooms = require("../../services/rooms/join_queue");
    const rooms = new Rooms();
    await rooms.join_queue(req, res);
  }
  async Select_Offer_Rooms_Queue(req, res) {
    const Rooms = require("../../services/rooms/Select_Offer_Rooms_Queue");
    const rooms = new Rooms();
    await rooms.Select_Offer_Rooms_Queue(req, res);
  } 
   async changeUserQueueStatus(req, res) {
    const Rooms = require("../../services/rooms/changeUserQueueStatus");
    const rooms = new Rooms();
    await rooms.changeUserQueueStatus(req, res);
  } 
  async updateOfferPrice(req, res) {
    const Rooms = require("../../services/rooms/updateOfferPrice");
    const rooms = new Rooms();
    await rooms.updateOfferPrice(req, res);
  }
};
