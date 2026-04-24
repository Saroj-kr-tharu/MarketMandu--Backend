const {  ServiceError} = require('../utlis/index');


class CurdService { 
    constructor(repo){
        this.repo = repo;
    }

    async createService(data){
        try {
            const res = await this.repo.create(data);
            
            return res; 

        } catch (error) {
            console.log("something went wrong in service curd level  (create) ", error)
            
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }

            throw new ServiceError()
        }
    }

    async deleteService(data){
        try {
            const res = await this.repo.delete(data);
            return res; 

        } catch (error) {
            console.log("something went wrong in service curd level  (create) ")
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }

            throw new ServiceError()
        }
    }

    async updateService(data,id){
        try {
            console.log(`data => ${data} id => ${id}`)
            const res = await this.repo.updateById(data, id );
            return res; 

        } catch (error) {
            console.log("something went wrong in service curd level  (update) ")
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }

            throw new ServiceError()
        }
    }

    

    async getByIdService(data){
        try {
            const res = await this.repo.getbyId(data);
            return res; 

        } catch (error) {
            console.log("something went wrong in service curd level  (getById) ")
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }

            throw new ServiceError()
        }
    }
    
    async getAll(){
        try {
            const res = await this.repo.getAll();
            console.log('from repo => ',res)
            return res; 

        } catch (error) {
            console.log("something went wrong in service curd level  (getAll) ")
            if (error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }

            throw new ServiceError()
        }
    }

}


module.exports = CurdService;