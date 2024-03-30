module.exports = class {
  constructor() {}
  async getAll(req, res) {
    const Infos = require("../../services/info/getAll");
    const infos = new Infos();
    await infos.getAll(req, res);
  }
  async edit_info(req, res) {
    const Infos = require("../../services/info/edit_info");
    const infos = new Infos();
    await infos.edit(req, res);
  }
  async stats(req, res) {
    const Infos = require("../../services/info/stats");
    const infos = new Infos();
    await infos.stats(req, res);
  }
};
