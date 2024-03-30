const express = require("express");
const Router = express.Router();
const Categories = require("../controllers/category");
const categories = new Categories;
const multer = require("multer")
Router.get("/getAll", (req, res) => categories.getAll(req, res));
Router.post("/updateHidden", (req, res) => categories.updateCategoryHidden(req, res));
Router.post("/add", (req, res) => categories.add(req, res));
Router.post("/edit", (req, res) => categories.edit(req, res));

module.exports = Router; 