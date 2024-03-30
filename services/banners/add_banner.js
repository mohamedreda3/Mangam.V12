const BannerRepository = require("../../repositories/banners");
const bannerRepository = new BannerRepository();

module.exports = class {
  constructor() {}
  async add(req, res) {
    const rate = await bannerRepository.add_banner(req.body);

    res.send(
      rate?.affectedRows
        ? { status: 1, message: "Banner Added Successfully" }
        : { status: 0, message: "Banner Not Added" }
    );
  }
};
