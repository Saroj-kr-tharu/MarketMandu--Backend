const { AppError, HttpsStatusCodes} = require('../utlis/index')


class CURD_REPO{
    constructor(model){
        this.model = model ;
    }

    async create (data) { 
        try {
            const res = await this.model.create(data);
            return res; 
        } catch (error) {
            console.log("something went wrong in Repo curd level  (create) ", error)
            throw new AppError(
                    'RepositoryError',
                    'Cannot create  ',
                    'Issue in Creating in CURD REPO',
                    HttpsStatusCodes.ServerErrosCodes.INTERNAL_SERVER_ERROR

            );
        }
    }


    async updateById (data, id) { 
        try {
            const res = await this.model.update(data, { where : {id } } );

            // console.log('res => ', res, data , id )
            return res ;

        } catch (error) {
            console.log("something went wrong in Repo curd level (updateById) ")
            throw new AppError(
                'RepositoryError',
                'Cannot update BY ID ',
                'Issue in updating By ID in CURD REPO',
                HttpsStatusCodes.INTERNAL_SERVER_ERROR

            );
        }
    }
   

    async delete (email) { 
        try {
              const res = await this.model.destroy( { where: { email }, } );
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
   

    async getById (id) { 
        try {
            const res = await this.model.findOne({
                where: {id},
            });
            return res; 
        } catch (error) {
            console.log("something went wrong in Repo curd level (getById) ")
            throw new AppError(
                'RepositoryError',
                'Cannot get BY ID ',
                'Issue in fetching By ID in CURD REPO',
                HttpsStatusCodes.INTERNAL_SERVER_ERROR

            );
        }
    }
   
    
    async getAll () { 
        try {
            
            const res = await this.model.findAll();
            return res;

        } catch (error) {
            console.log("something went wrong in Repo curd level (getAll) ")
            throw new AppError(
                    'RepositoryError',
                    'Cannot GetALL  ',
                    'Issue in getting all  in CURD REPO',
                    HttpsStatusCodes.INTERNAL_SERVER_ERROR

                );
        }
    }
   



}

module.exports = CURD_REPO;