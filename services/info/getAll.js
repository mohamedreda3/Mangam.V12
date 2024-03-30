const InfoRepository = require("../../repositories/info");
const infoRepository = new InfoRepository;

module.exports = class {
    constructor() { }
    async getAll(req, res) {

        let { infos } = await infoRepository.getAll();

        res.send(infos.length ? { status: 1, message: infos } : { status: 0, message: "Not Found" });
    }
} 