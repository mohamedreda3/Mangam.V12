const SocialMediaRepository = require("../../repositories/social_media");
const socialMediaRepository = new SocialMediaRepository;

module.exports = class {
    constructor() { }
    async getAll(req, res) {
        let type = req?.query?.type;
        let { socialMedias } = await socialMediaRepository.getAll(req, res, type);

        res.send(socialMedias?.length ? { status: 1, message: socialMedias } : { status: 0, message: [] });
}
} 