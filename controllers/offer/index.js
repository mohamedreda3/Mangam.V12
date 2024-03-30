module.exports = class {
  constructor() { }

  async make(req, res) {
    const Offers = require("../../services/offers/make");
    const offers = new Offers();
    await offers.make(req, res);
  }
  async edit(req, res) {
    const Offers = require("../../services/offers/edit");
    const offers = new Offers();
    await offers.edit(req, res);
  }
  async copy(req, res) {
    const Offers = require("../../services/offers/copy");
    const offers = new Offers();
    await offers.copy(req, res);
  }
  async buy(req, res) {
    const Offers = require("../../services/offers/buy");
    const offers = new Offers();
    await offers.buy(req, res);
  }
  async select_offers(req, res) {
    const Offers = require("../../services/offers/select_offers");
    const offers = new Offers();
    await offers.select_offers(req, res);
  }
  async stop(req, res) {
    const Offers = require("../../services/offers/stop");
    const offers = new Offers();
    await offers.stop(req, res);
  }
  async notifyMe(req, res) {
    const Offers = require("../../services/offers/notifyMe");
    const offers = new Offers();
    await offers.notifyMe(req, res);
  }
  async selectOfferById(req, res) {
    const Offers = require("../../services/offers/select_offer_by_id");
    const offers = new Offers();
    await offers.select_offer_by_id(req, res);
  }
  async updateOfferHold(req, res) {
    const Offers = require("../../services/offers/updateOfferHold");
    const offers = new Offers();
    await offers.updateOfferHold(req, res);
  }
  async archive(req, res) {
    const Rooms = require("../../services/offers/archive");
    const rooms = new Rooms();
    await rooms.edit(req, res);
  }
};