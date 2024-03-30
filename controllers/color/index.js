module.exports = class {
  constructor() {}
  async add_color(req, res) {
    const Colors = require("../../services/color/add_color");
    const colors = new Colors();
    await colors.add(req, res);
  }
  async edit_color(req, res) {
    const Colors = require("../../services/color/edit_color");
    const colors = new Colors();
    await colors.edit(req, res);
  }
  async getProducts(req, res) {
    const Colors = require("../../services/color/getProductColor");
    const colors = new Colors();
    await colors.add(req, res);
  }
  async getProps(req, res) {
    const Colors = require("../../services/color/getProductColor");
    const colors = new Colors();
    await colors.add(req, res);
  }
  async make_offer(req, res) {
    const Colors = require("../../services/color/make_offer");
    const colors = new Colors();
    await colors.make_offer(req, res);
  }
};
