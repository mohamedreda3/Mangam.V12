const doQuery = require("../../config/doQuery");

module.exports = class {
  constructor() {}
  async getAll(req, res, type) {
    const banners =
      type == "user"
        ? await doQuery("SELECT * FROM home_banners WHERE hidden = 0")
        : type == "admin"
        ? await doQuery("SELECT * FROM home_banners")
        : null;
    //  console.log(banners);
    return { banners };
  }

  async updateHidden(data) {
    const bannerOldData = await doQuery(
      "SELECT * FROM home_banners WHERE id = ?",
      [data?.banner_id]
    );

    if (!bannerOldData || !bannerOldData.length) {
      return { affectedRows: 0 };
    }

    const update = await doQuery(
      "Update home_banners SET hidden = ? WHERE id = ?",
      [data?.status, data?.banner_id]
    );
    return update;
  }

  async add_banner(data) {
    const add = await doQuery(
      "INSERT INTO home_banners (title, text, imageLink, link, title_ar, text_ar) VALUES (?, ?, ?, ?,?,?)",
      [
        data?.title,
        data?.text,
        data?.imageLink,
        data?.link,
        data?.title_ar,
        data?.text_ar,
      ]
    );
    // console.log(data, add);
    return add;
  }

  async edit_banner(data) {
    const bannerOldData = await doQuery(
      "SELECT * FROM home_banners WHERE id = ?",
      [data?.banner_id]
    );

    if (!bannerOldData || !bannerOldData.length) {
      return { affectedRows: 0 };
    }

    const update = await doQuery(
      "UPDATE home_banners SET title = ?, text = ?, imageLink = ?, link = ?, title_ar = ?, text_ar=?  WHERE id = ?",
      [
        data?.title ? data?.title : bannerOldData[0]?.title,
        data?.text ? data?.text : bannerOldData[0]?.text,
        data?.imageLink ? data?.imageLink : bannerOldData[0]?.imageLink,
        data?.link ? data?.link : bannerOldData[0]?.link,
        data?.title_ar ? data?.title_ar : bannerOldData[0]?.title_ar,
        data?.text_ar ? data?.text_ar : bannerOldData[0]?.text_ar,
        data?.banner_id,
      ]
    );

    return update;
  }
};
