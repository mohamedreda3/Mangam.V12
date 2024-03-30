const OfferRepository = require("../../repositories/offer");
const offerRepository = new OfferRepository();

module.exports = class {
  constructor() {}
  async select_offer_by_id(req, res) {
    const offer = await offerRepository.select_offer_by_id(req.body);
    res.send(offer);
  }
};
