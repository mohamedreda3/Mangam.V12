const express = require("express");
const roomsRoute = express.Router();
const Rooms = require("../controllers/room");
const rooms = new Rooms;


roomsRoute.post("/make", (req, res) => rooms.make(req, res));
roomsRoute.post("/Select_Offer_Rooms", (req, res) => rooms.Select_Offer_Rooms(req, res));
roomsRoute.post("/join", (req, res) => rooms.join(req, res));
roomsRoute.post("/join_queue", (req, res) => rooms.join_queue(req, res));
roomsRoute.post("/Select_Offer_Rooms_Queue", (req, res) => rooms.Select_Offer_Rooms_Queue(req, res));
roomsRoute.post("/changeUserQueueStatus", (req, res) => rooms.changeUserQueueStatus(req, res));
// changeUserQueueStatus
// Select_Offer_Rooms_Queue
// join_queue
roomsRoute.post("/updateOfferPrice", (req, res) => rooms.updateOfferPrice(req, res));
// updateOfferPrice
// join
// Select_Offer_Rooms




module.exports = roomsRoute;