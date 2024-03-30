const doQuery = require("../../config/doQuery");

module.exports = class {
  constructor() {}

  async sign_up(data) {
    const add = await doQuery(
      "INSERT INTO user (name, email, phone, avatar, password, type) VALUES (?, ?, ?, ?, ?, ?)",
      [
        data?.name,
        data?.email,
        data?.phone,
        data?.avatar,
        data?.password,
        ["user"],
      ]
    );
    return add;
  }

  async update(data) {
    const get = await doQuery(
      "SELECT * FROM user WHERE email = ? AND type = ?",
      [data?.id, data?.type]
    );
    if (!get && !get.length) {
      return { affectedRows: 0 };
    }
    const add = await doQuery(
      "UPDATE user SET name = ?, email =?, phone = ?, avatar=?, password=? WHERE id = ? AND type = ?",
      [
        data?.name ? data?.name : get[0]?.name,
        data?.email ? data?.email : get[0]?.email,
        data?.phone ? data?.phone : get[0]?.phone,
        data?.avatar ? data?.avatar : get[0]?.avatar,
        data?.password ? data?.password : get[0]?.password,
        data?.id,
        data?.type,
      ]
    );
    return add;
  }

  async login(data) {
    const add = await doQuery(
      "SELECT * FROM user WHERE email = ? AND password = ? AND type = ?",
      [data?.email, data?.password, data?.type]
    );
    return add[0]?.name
      ? [
          {
            name: add[0]?.name,
            type: add[0]?.type,
            id: add[0]?.id,
            email: add[0]?.email,
            phone: add[0]?.phone,
            avatar: add[0]?.avatar,
          },
        ]
      : [];
  }

  async getInfo(data) {
    const add = await doQuery("SELECT * FROM user WHERE id = ? AND type = ?", [
      data?.id,
      data?.type,
    ]);
    return add[0]?.name
      ? [
          {
            name: add[0]?.name,
            type: add[0]?.type,
            id: add[0]?.id,
            email: add[0]?.email,
            phone: add[0]?.phone,
            avatar: add[0]?.avatar,
          },
        ]
      : [];
  }
};
