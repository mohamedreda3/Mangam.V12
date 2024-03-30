const CategoryRepository = require("../../repositories/category");
const categoryRepository = new CategoryRepository;
module.exports = class {
    constructor() { }
    async updateHidden(req, res) {
        const category = await categoryRepository.updateHidden(req?.body)
        res.send(category.changedRows ? { status: 1, message: "Updated" } : { status: 0, message: "Error Occurred" })
    }
}