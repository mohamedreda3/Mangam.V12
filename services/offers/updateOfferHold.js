const OfferRepository = require("../../repositories/offer");
const offerRepository = new OfferRepository();

module.exports = class {
  constructor() {}
  async updateOfferHold(req, res) {
    const offer = await offerRepository.updateOfferHold(req.body);
    res.send(offer);
  }
};
