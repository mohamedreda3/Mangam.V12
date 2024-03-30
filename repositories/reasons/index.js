const doQuery = require("../../config/doQuery");

module.exports = class {
  constructor() {}
  async getAll() {
    const gatReasons = await doQuery("SELECT * FROM reason");
    return gatReasons;
  }

  async add({ text, text_ar }) {
    let addReason;
    // try {
      addReason = await doQuery(
        "INSERT INTO reason SET text = ?, text_ar = ?",
        [text, text_ar]
      );
      // console.log(text, text_ar);
      return addReason;
    // } catch (err) {
    //   return err.code;
    // }
  }

  async delete({ id }) {
    let addReason;
    try {
      addReason = await doQuery(
        "DELETE FROM reason WHERE id = ?",
        [id]
      );
      return addReason;
    } catch (err) {
      return err.code;
    }
  }

  async edit({ text, text_ar, id }) {
    let addReason;
    let data = await doQuery("SELECT * FROM reason WHERE id = ?", [id]);
    try {
      addReason = await doQuery(
        "UPDATE reason SET text = ?, text_ar = ? WHERE id = ?",
        [
          text ? text : data[0]?.text,
          text_ar ? text_ar : data[0]?.text_ar,
          id,
        ]
      );
      return addReason;
    } catch (err) {
      return err.code;
    }
  }
};
