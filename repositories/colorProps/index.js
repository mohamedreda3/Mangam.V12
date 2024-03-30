const doQuery = require("../../config/doQuery");

module.exports = class {
  constructor() {}
  async add(data) {
    const add = await doQuery(
      "INSERT INTO product_props (color_id, label, label_ar) VALUES (?, ?, ?)",
      [data?.color_id, data?.label, data?.label_ar]
    );

    return add;
  }
  async get(data) {
    const get = await doQuery(
      "SELECT * from product_props where color_id = ?",
      [data?.color_id]
    );
    return get;
  }

  async get_values(data) {
    const get = await doQuery(
      "SELECT * from product_props_value where prop_id = ?",
      [data?.prop_id]
    );
    return get;
  }

  async add_value(data) {
    const add = await doQuery(
      "INSERT INTO product_props_value (prop_id, label, label_ar) VALUES (?, ?, ?)",
      [
        data?.prop_id,
        data?.label,
        data?.label_ar,
      ]
    );
    // console.log(add);
    return add;
  }

  async edit_value(data) {
    const get = await doQuery(
      "SELECT * from product_props_value where id = ?",
      [data?.prop_value_id]
    );

    if (!get || !get.length) {
      return { affectedRows: 0 };
    }

    const add = await doQuery(
      "UPDATE product_props_value SET label=?, label_ar =? WHERE id = ?",
      [
        data?.label ? data?.label : get[0]?.label,
        data?.label_ar ? data?.label_ar : get[0]?.label_ar,
        data?.prop_value_id,
      ]
    );
    // console.log(add)
    return add;
  }

  async delete_value(prop_value_id) {
    const add = await doQuery("DELETE FROM product_props_value WHERE id = ?", [
      prop_value_id,
    ]);
    return add;
  }

  async edit(data) {
    const oldData = await doQuery("SELECT * FROM product_props WHERE id = ?", [
      data?.prop_id,
    ]);

    if (!oldData || !oldData.length) {
      return { affectedRows: 0 };
    }

    const update = await doQuery(
      "UPDATE product_props SET label = ?, label_ar = ? WHERE id = ?",
      [
        data?.label ? data?.label : oldData[0]?.label,
        data?.label_ar ? data?.label_ar : oldData[0]?.label_ar,
        data?.prop_id,
      ]
    );

    return update;
  }

  async delete_props(data) {
    const oldData = await doQuery("SELECT * FROM product_props WHERE id = ?", [
      data?.prop_id,
    ]);

    if (!oldData || !oldData.length) {
      return { affectedRows: 0 };
    }

    const update = await doQuery("DELETE FROM product_props WHERE id = ?", [
      data?.prop_id,
    ]);

    return update;
  }
};
