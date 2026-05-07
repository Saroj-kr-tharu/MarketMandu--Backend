const { Banner } = require("../models/index");
const CurdRepo = require('./curd.repo');

class BannerRepo extends CurdRepo {
  constructor() {
    super(Banner);
  }


}


const bannerRepo = new BannerRepo();
module.exports = bannerRepo;