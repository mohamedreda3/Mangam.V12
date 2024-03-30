const OfferRepository = require("../../repositories/offer");
const offerRepository = new OfferRepository();

module.exports = class {
  constructor() {}
  async copy(req, res) {
    const offer = await offerRepository.copy(req.body);

    res.send(offer);
  }
};
