const OfferRepository = require("../../repositories/offer");
const offerRepository = new OfferRepository();

module.exports = class {
  constructor() {}
  async stop(req, res) {
    const offer = await offerRepository.stopOffer(req?.body);
    // console.log(offer);
    res.send(offer)
  }
};
