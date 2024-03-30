const OfferRepository = require("../../repositories/offer");
const offerRepository = new OfferRepository();

module.exports = class {
  constructor() {}
  async select_offers(req, res) {
    const offer =
      req?.body?.type == "admin"
        ? await offerRepository.select_offers(req.body)
        : req?.body?.type == "user"
        ? await offerRepository.select_user_offers(req.body)
        : { status: 0, message: "Offer Not Found in this store" };

    res.send(offer);
  }
};
