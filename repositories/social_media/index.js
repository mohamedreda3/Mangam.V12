const doQuery = require("../../config/doQuery");

module.exports = class {
  constructor() {}
  async getAll(req, res, type) {
    const socialMedias =
      type == "user"
        ? await doQuery("SELECT * FROM social_media WHERE hidden = 0")
        : type == "admin"
        ? await doQuery("SELECT * FROM social_media")
        : null;
    return { socialMedias };
  }

  async updateHidden(data) {
    const socialMediaOldData = await doQuery(
      "SELECT * FROM social_media WHERE id = ?",
      [data?.social_media_id]
    );

    if (!socialMediaOldData || !socialMediaOldData.length) {
      return { affectedRows: 0 };
    }
    
    const update = await doQuery(
      "Update social_media SET hidden = ? WHERE id = ?",
      [data?.status, data?.social_media_id ]
    );
    return update;
  }

  async add_socialMedia(data) {
    const add = await doQuery(
      "INSERT INTO social_media (name, image, link, name_ar) VALUES (?, ?, ?, ?)",
      [data?.name, data?.image, data?.link, data?.name_ar]
    );
    return add;
  }

  async edit_socialMedia(data) {
    const socialMediaOldData = await doQuery(
      "SELECT * FROM social_media WHERE id = ?",
      [data?.social_media_id]
    );

    if (!socialMediaOldData || !socialMediaOldData.length) {
      return { affectedRows: 0 };
    }

    const update = await doQuery(
      "UPDATE social_media SET name = ?, image = ?, link = ?, name_ar = ? WHERE id = ?",
      [
        data?.name ? data?.name : socialMediaOldData[0]?.name,
        data?.image ? data?.image : socialMediaOldData[0]?.image,
        data?.link ? data?.link : socialMediaOldData[0]?.link,
        data?.name_ar ? data?.name_ar : socialMediaOldData[0]?.name_ar,
        data?.social_media_id,
      ]
    );

    return update;
  }
};
