
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
            throw error; 
            
        }
    }


    async updateById (data, id) { 
        try {
            const res = await this.model.update(data, { where : {id } } );

            // console.log('res => ', res, data , id )
            return res ;

        } catch (error) {
            console.log("something went wrong in Repo curd level (updateById) ")
            throw error; 
        }
    }
   

    async delete (email) { 
        try {
              const res = await this.model.destroy( { where: { email }, } );
                return res;

                
        } catch (error) {
            console.log("something went wrong in Repo curd level (delete) ")
             throw error; 
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
             throw error; 
        }
    }
   
    
    async getAll () { 
        try {
            
            const res = await this.model.findAll();
            return res;

        } catch (error) {
            console.log("something went wrong in Repo curd level (getAll) ")
             throw error; 
        }
    }
   



}

module.exports = CURD_REPO;