const BannerRepository = require("../../repositories/banners");
const bannerRepository = new BannerRepository();

module.exports = class {
  constructor() {}
  async getAll(req, res) {
    let type = req?.query?.type;
    let { banners } = await bannerRepository.getAll(req, res, type);
    res.send(
      banners.length
        ? { status: 1, message: banners }
        : { status: 0, message: [] }
    );
  }
};
