const md5 = require("md5");
const UserRepository = require("../../repositories/user");
const userRepository = new UserRepository();

module.exports = class {
  constructor() {}
  async getInfo(req, res) {
    const login = await userRepository.getInfo(req.body);

    res.send(
      login && login.length
        ? { status: 1, message: login }
        : { status: 0, message: "User Not Found" }
    );
  }
};
