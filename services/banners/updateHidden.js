const BannerRepository = require("../../repositories/banners");
const bannerRepository = new BannerRepository;

module.exports = class {
    constructor() { }
    async updateHidden(req, res) {
        const updateHidden = await bannerRepository.updateHidden(req?.body);

        res.send(updateHidden.changedRows ? { status: 1, message: "Updated" } : { status: 0, message: "Error Occurred" });
    }
}