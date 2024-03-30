module.exports = class {
    constructor() { }
    async getAll(req, res) {
        const Categories = require("../../services/category/getAll");
        const categories = new Categories;
        await categories.getAll(req, res);
    }
    
    async updateCategoryHidden(req, res) {
        const Categories = require("../../services/category/updateCategoryHidden");
        const categories = new Categories;
        // console.log(req.body);
        await categories.updateHidden(req, res);
    }

    async add(req, res) {
        const Categories = require("../../services/category/add");
        const categories = new Categories;
        // console.log(req);
        await categories.add(req, res);
    }
    async edit(req, res) {
        const Categories = require("../../services/category/edit");
        const categories = new Categories;
        // console.log(req);
        await categories.edit(req, res);
    }
}