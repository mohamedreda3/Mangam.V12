const OfferRepository = require("../../repositories/offer");
const offerRepository = new OfferRepository();

module.exports = class {
  constructor() {}
  async buy(req, res) {
    const offer = await offerRepository.makeOrder(req.body);

    res.send(offer);
  }
};
