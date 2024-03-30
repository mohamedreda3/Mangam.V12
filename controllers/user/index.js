module.exports = class {
  constructor() {}
  async sign_up(req, res) {
    const User = require("../../services/user/sign_up");
    const user = new User();
    await user.sign_up(req, res);
  }
  async login(req, res) {
    const User = require("../../services/user/login");
    const user = new User();
    await user.login(req, res);
  }
  async getInfo(req, res) {
    const User = require("../../services/user/get_info");
    const user = new User();
    await user.getInfo(req, res);
  }
  async update(req, res) {
    const User = require("../../services/user/update");
    const user = new User();
    await user.update(req, res);
  }
};
