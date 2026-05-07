const Service = require('./curd.service');
const {BannerRepo} = require('../Repository/index');
const s3service = require('./s3.service');


class BannerService extends Service {
  constructor() {
    super(BannerRepo);
  }

  async deleteById(id,objId){
        try {
          // console.log("id => ", id , " objid => ", objId)
            // 2. delete the s3 key 
            await s3service.deleteObject(objId);
            // 3.delete the banner now  
              const res = await BannerRepo.delete(id);
              return res; 

        } catch (error) {
            console.log("something went wrong in service curd level  (create) ")
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }

            throw new ServiceError()
        }
    }
  

    async updateByid(data,id){
        try {
          await this.updateService(data, id);
          
          const res = await BannerRepo.getById(id);
          // console.log('res => ', res );
          return res; 

        } catch (error) {
            console.log("something went wrong in service curd level  (updateByid) ")
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }

            throw new ServiceError()
        }
    }

}

const bannerService = new BannerService();
module.exports = bannerService;