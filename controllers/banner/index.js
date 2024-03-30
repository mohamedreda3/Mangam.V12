module.exports = class {
  constructor() {}
  async getAll(req, res) {
    const Banners = require("../../services/banners/getAll");
    const banners = new Banners();
    await banners.getAll(req, res);
  }

  async updateHidden(req, res) {
    const Banners = require("../../services/banners/updateHidden");
    const banners = new Banners();
    await banners.updateHidden(req, res);
  }

  async add_banner(req, res) {
    const Banners = require("../../services/banners/add_banner");
    const banners = new Banners();
    await banners.add(req, res);
  }
  async edit_banner(req, res) {
    const Banners = require("../../services/banners/edit_banner");
    const banners = new Banners();
    await banners.edit(req, res);
  }
};
