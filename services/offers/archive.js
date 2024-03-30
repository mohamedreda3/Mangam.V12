const OfferRepository = require("../../repositories/room");
const offerRepository = new OfferRepository();

module.exports = class {
  constructor() {}
  async edit(req, res) {
    const offer = await offerRepository.archive(req.body);

    res.send(offer);
  }
};
