module.exports = class {
    constructor() { }

    async add(req, res) {
        const Shipping = require("../../services/shipping/add");
        const shipping = new Shipping;
        // console.log(req);
        await shipping.addShipping(req, res);
    }

    async edit(req, res) {
        const Shipping = require("../../services/shipping/edit");
        const shipping = new Shipping;
        // console.log(req);
        await shipping.edit(req, res);
    }


    async getbyId(req, res) {
        const Shipping = require("../../services/shipping/getById");
        const shipping = new Shipping;
        // console.log(req);
        await shipping.getById (req, res);
    }


    async getAll(req, res) {
        const Shipping = require("../../services/shipping/getAll");
        const shipping = new Shipping;
        // console.log(req);
        await shipping.getAll(req, res);
    }
}