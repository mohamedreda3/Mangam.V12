const md5 = require("md5");
const UserRepository = require("../../repositories/user");
const userRepository = new UserRepository();

module.exports = class {
  constructor() {}
  async login(req, res) {
    req.body.password = md5(req.body.password);
    const login = await userRepository.login(req.body);

    res.send(
      login && login.length
        ? { status: 1, message: login }
        : { status: 0, message: "User Not Found Or Wrong Password" }
    );
  }
};
