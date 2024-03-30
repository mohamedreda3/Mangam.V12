const SocialMediaRepository = require("../../repositories/social_media");
const socialMediaRepository = new SocialMediaRepository();

module.exports = class {
  constructor() {}
  async edit(req, res) {
    const rate = await socialMediaRepository.edit_socialMedia(req.body);

    res.send(
      rate?.affectedRows
        ? { status: 1, message: "Social Media Editted Successfully" }
        : { status: 0, message: "Social Media Not Editted" }
    );
  }
};
