const doQuery = require("../../config/doQuery");

module.exports = class {
  constructor() {}
  async getAll(type) {
    const gatCategories =
      type == "user"
        ? await doQuery("SELECT * FROM category WHERE hidden = 0")
        : type == "admin"
        ? await doQuery("SELECT * FROM category")
        : [];
    return gatCategories;
  }

  async updateHidden(data) {
    const update = await doQuery(
      "Update category SET hidden = ? WHERE id = ?",
      [data?.hidden, data?.category_id]
    );
    return update;
  }

  async add({ title, image_url, title_ar }) {
    let addCategory;
    try {
      addCategory = await doQuery(
        "INSERT INTO category SET title = ?, image = ?, title_ar = ?",
        [title, image_url, title_ar]
      );
      return addCategory;
    } catch (err) {
      return err.code;
    }
  }

  async edit({ title, image_url, title_ar, id }) {
    let addCategory;
    let data = await doQuery("SELECT * FROM category WHERE id = ?", [id]);
    try {
      addCategory = await doQuery(
        "UPDATE category SET title = ?, image = ?, title_ar = ? WHERE id = ?",
        [
          title ? title : data[0]?.title,
          image_url ? image_url : data[0]?.image_url,
          title_ar ? title_ar : data[0]?.title_ar,
          id,
        ]
      );

      return addCategory;
    } catch (err) {
      return err.code;
    }
  }
};
