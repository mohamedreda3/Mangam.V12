const md5 = require("md5");
const UserRepository = require("../../repositories/user");
const userRepository = new UserRepository();

module.exports = class {
  constructor() {}
  async update(req, res) {
    req.body.password = md5(req.body.password);
    const sign_up = await userRepository.update(req.body);

    res.send(
      sign_up?.affectedRows
        ? { status: 1, message: "User Updated Successfully" }
        : { status: 0, message: "User Not Updated" }
    );
  }
};
