module.exports = class {
  constructor() {}
  async add(req, res) {
    const ColorProps = require("../../services/color_props/add");
    const colorProps = new ColorProps();
    await colorProps.add(req, res);
  }
  async add_value(req, res) {
    const ColorProps = require("../../services/color_props/add_value");
    const colorProps = new ColorProps();
    await colorProps.add_value(req, res);
  }
  async edit(req, res) {
    const ColorProps = require("../../services/color_props/edit");
    const colorProps = new ColorProps();
    await colorProps.edit(req, res);
  }
  async deleteProp(req, res) {
    const ColorProps = require("../../services/color_props/delete");
    const colorProps = new ColorProps();
    await colorProps.delete(req, res);
  }
  async getProp(req, res) {
    const ColorProps = require("../../services/color_props/get_value");
    const colorProps = new ColorProps();
    await colorProps.get_value(req, res);
  }
  async get_values(req, res) {
    const ColorProps = require("../../services/color_props/get_values");
    const colorProps = new ColorProps();
    await colorProps.get_value(req, res);
  }
  async delete_values(req, res) {
    const ColorProps = require("../../services/color_props/delete_value");
    const colorProps = new ColorProps();
    await colorProps.delete_value(req, res);
  }
  async edit_values(req, res) {
    const ColorProps = require("../../services/color_props/edit_value");
    const colorProps = new ColorProps();
    await colorProps.edit(req, res);
  }
};
