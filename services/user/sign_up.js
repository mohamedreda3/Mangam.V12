const md5 = require("md5");
const UserRepository = require("../../repositories/user");
const userRepository = new UserRepository();

module.exports = class {
  constructor() {}
  async sign_up(req, res) {
    req.body.password = md5(req.body.password);
    const sign_up = await userRepository.sign_up(req.body);

    res.send(
      sign_up?.affectedRows
        ? { status: 1, message: "User Added Successfully" }
        : { status: 0, message: "User Not Added" }
    );
  }
};
