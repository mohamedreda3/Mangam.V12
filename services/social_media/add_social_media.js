const SocialMediaRepository = require("../../repositories/social_media");
const socialMediaRepository = new SocialMediaRepository();

module.exports = class {
  constructor() {}
  async add(req, res) {
    const rate = await socialMediaRepository.add_socialMedia(req.body);

    res.send(
      rate?.affectedRows
        ? { status: 1, message: "Social Media Added Successfully" }
        : { status: 0, message: "Social Media Not Added" }
    );
  }
};
