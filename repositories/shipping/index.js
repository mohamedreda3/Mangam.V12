const doQuery = require("../../config/doQuery");

module.exports = class {
  constructor() {}

  async add(data) {
    const add = await doQuery(
      "INSERT INTO shipping (title, title_ar) VALUES (?, ?)",
      [data?.title, data?.title_ar]
    );
    return add;
  }

  async edit(data) {
    const getShipps = await doQuery("SELECT * FROM shipping WHERE id = ?", [
      data?.id,
    ]);
    const edit = await doQuery(
      "Update shipping SET title= ? , title_ar = ? WHERE id=?",
      [
        data?.title ? data?.title : getShipps[0]?.title,
       
        data?.title_ar ? data?.title_ar : getShipps[0]?.title_ar,
        data?.id,
      ]
    );
    return edit;
  }

  async getById(data) {
    const getShipps = await doQuery("SELECT * FROM shipping WHERE id = ?", [
      data?.id,
    ]);
    return getShipps;
  }

  async getAll() {
    const getShipps = await doQuery("SELECT * FROM shipping");
    return getShipps;
  }
};
