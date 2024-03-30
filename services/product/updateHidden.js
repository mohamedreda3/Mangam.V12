const ProductRepository = require("../../repositories/product");
const productRepository = new ProductRepository;
const Group = require("../../functions/groupProducts");

module.exports = class {
    constructor() { }
    async updateHidden(req, res) {
        const updateHidden = await productRepository.updateHidden(req?.body);

        res.send(updateHidden.changedRows ? { status: 1, message: "Updated" } : { status: 0, message: "Error Occurred" });
    }
}