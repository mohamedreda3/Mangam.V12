const express = require("express");
const Router = express.Router();
const Products = require("../controllers/product");
const products = new Products;
Router.get("/getAll", (req, res) => products.getAll(req, res));
Router.get("/getProductsByCategory", (req, res) => products.getProductsByCategory(req, res));
Router.get("/getById", (req, res) => products.getProduct(req, res));
Router.get("/getProduct", (req, res) => products.getProduct(req, res));
Router.get("/getReviews", (req, res) => products.getReviews(req, res));
Router.post("/searchProduct", (req, res) => products.searchProduct(req, res));
Router.post("/updateHidden", (req, res) => products.updateHidden(req, res));
Router.post("/rate", (req, res) => products.rate(req, res));
Router.post("/add_product", (req, res) => products.add_product(req, res));
Router.post("/edit_product", (req, res) => products.edit_product(req, res));
Router.post("/select_offers", (req, res) => products.select_offers(req, res));

module.exports = Router;