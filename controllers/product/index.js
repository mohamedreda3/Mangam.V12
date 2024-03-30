module.exports = class {
  constructor() {}
  async getAll(req, res) {
    const Products = require("../../services/product/getAll");
    const products = new Products();
    await products.getAll(req, res);
  }

  async getProduct(req, res) {
    const Products = require("../../services/product/getSignleProduct");
    const products = new Products();
    await products.getProduct(req, res);
  }
  async searchProduct(req, res) {
    const Products = require("../../services/product/searchProduct");
    const products = new Products();
    await products.searchProduct(req, res);
  }
  async updateHidden(req, res) {
    const Products = require("../../services/product/updateHidden");
    const products = new Products();
    await products.updateHidden(req, res);
  }
  async getProductsByCategory(req, res) {
    const Products = require("../../services/product/getProductsByCategory");
    const products = new Products();
    await products.getProductsByCategory(req, res);
  }
  async rate(req, res) {
    const Products = require("../../services/product/addRate");
    const products = new Products();
    await products.rate(req, res);
  }

  async getReviews(req, res) {
    const Products = require("../../services/product/getReviews");
    const products = new Products();
    await products.getReviews(req, res);
  }
  async add_product(req, res) {
    const Products = require("../../services/product/add_product");
    const products = new Products();
    await products.add(req, res);
  }
  async edit_product(req, res) {
    const Products = require("../../services/product/edit_product");
    const products = new Products();
    await products.edit(req, res);
  }
  async select_offers(req, res) {
    const Offers = require("../../services/offers/select_offers");
    const offers = new Offers();
    await offers.select_offers(req, res);
  }
};
