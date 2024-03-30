module.exports = class {
  constructor() {}
  async getAll(req, res) {
    const SocialMedias = require("../../services/social_media/getAll");
    const socialMedias = new SocialMedias();
    await socialMedias.getAll(req, res);
  }

  async updateHidden(req, res) {
    const SocialMedias = require("../../services/social_media/updateHidden");
    const socialMedias = new SocialMedias();
    await socialMedias.updateHidden(req, res);
  }

  async add_socialMedia(req, res) {
    const SocialMedias = require("../../services/social_media/add_social_media");
    const socialMedias = new SocialMedias();
    await socialMedias.add(req, res);
  }
  async edit_socialMedia(req, res) {
    const SocialMedias = require("../../services/social_media/edit_social_media");
    const socialMedias = new SocialMedias();
    await socialMedias.edit(req, res);
  }
};
