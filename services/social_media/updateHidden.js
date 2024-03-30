const SocialMediaRepository = require("../../repositories/social_media");
const socialMediaRepository = new SocialMediaRepository;

module.exports = class {
    constructor() { }
    async updateHidden(req, res) {
        const updateHidden = await socialMediaRepository.updateHidden(req?.body);

        res.send(updateHidden.changedRows ? { status: 1, message: "Updated" } : { status: 0, message: "Error Occurred" });
    }
}