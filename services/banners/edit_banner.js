const BannerRepository = require("../../repositories/banners");
const bannerRepository = new BannerRepository();

module.exports = class {
  constructor() {}
  async edit(req, res) {
    const rate = await bannerRepository.edit_banner(req.body);

    res.send(
      rate?.affectedRows
        ? { status: 1, message: "Banner Editted Successfully" }
        : { status: 0, message: "Banner Not Editted" }
    );
  }
};
