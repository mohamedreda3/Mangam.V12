const InfoRepository = require("../../repositories/info");
const infoRepository = new InfoRepository();

module.exports = class {
  constructor() {}
  async stats(req, res) {
    const rate = await infoRepository.stats(req?.query?.type, req?.query?.dataName, res);
    res.send(rate)
  }
};
