const Service = require('./curd.service');
const {BannerRepo} = require('../Repository/index');


class BannerService extends Service {
  constructor() {
    super(BannerRepo);
  }

  


}

const bannerService = new BannerService();
module.exports = bannerService;