const { Banner } = require("../models/index");
const CurdRepo = require('./curd.repo');

class BannerRepo extends CurdRepo {
  constructor() {
    super(Banner);
  }

  async delete (id) { 
        try {
              const res = await Banner.destroy( { where: { id }, } );
              return res;
        } catch (error) {
            console.log("something went wrong in Repo curd level (delete) ")
            throw new AppError(
                    'RepositoryError',
                    'Cannot delete BY Email ',
                    'Issue in deleting By Email in CURD REPO',
                    HttpsStatusCodes.INTERNAL_SERVER_ERROR
                );
        }
    }

}


const bannerRepo = new BannerRepo();
module.exports = bannerRepo;