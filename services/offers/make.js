const OfferRepository = require("../../repositories/offer");
const offerRepository = new OfferRepository();

module.exports = class {
  constructor() {}
  async make(req, res) {
    const offer = await offerRepository.make(req.body);
    res.send(offer);
  }
};
