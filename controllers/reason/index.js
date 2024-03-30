module.exports = class {
    constructor() { }
    async getAll(req, res) {
        const Reason = require("../../services/reason/getAll");
        const reason = new Reason;
        await reason.getAll(req, res);
    }
    
    async delete(req, res) {
        const Reason = require("../../services/reason/delete");
        const reason = new Reason;
        await reason.edit(req, res);
    }

    async add(req, res) {
        const Reason = require("../../services/reason/add");
        const reason = new Reason;
        // console.log(req);
        await reason.add(req, res);
    }
    async edit(req, res) {
        const Reason = require("../../services/reason/edit");
        const reason = new Reason;
        // console.log(req);
        await reason.edit(req, res);
    }
}