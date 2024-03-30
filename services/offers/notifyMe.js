const OfferRepository = require("../../repositories/offer");
const offerRepository = new OfferRepository();

module.exports = class {
  constructor() {}
  async notifyMe(req, res) {
    const offer = await offerRepository.notifyMe(req?.body);
    // console.log(offer);
    res.send(offer)
  }
};
