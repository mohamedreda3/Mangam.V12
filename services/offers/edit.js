const OfferRepository = require("../../repositories/offer");
const offerRepository = new OfferRepository();

module.exports = class {
  constructor() {}
  async edit(req, res) {
    const offer = await offerRepository.edit(req.body);

    res.send(offer);
  }
};
