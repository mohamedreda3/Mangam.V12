const express = require("express");
const Router = express.Router();
const ColorProps = require("../controllers/colorProp");
const colorProps = new ColorProps;
Router.post("/add", (req, res) => colorProps.add(req, res));
Router.post("/add_value", (req, res) => colorProps.add_value(req, res));
Router.post("/edit", (req, res) => colorProps.edit(req, res));
Router.post("/delete", (req, res) => colorProps.deleteProp(req, res));
Router.post("/get_value", (req, res) => colorProps.getProp(req, res));
Router.post("/get_values", (req, res) => colorProps.get_values(req, res));
Router.post("/delete_value", (req, res) => colorProps.delete_values(req, res));
Router.post("/edit_value", (req, res) => colorProps.edit_values(req, res));

module.exports = Router;