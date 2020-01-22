const Entidad=require('../constantes')



async function getall(req,res,entityKey){
    try {
       
     const genericos=require(Entidad[entityKey])     
     const queryResult =await genericos.find()   
    res.json(queryResult)    

    } catch (err) {
        res.status(500).json({message:err.message})
    }
    
}


async function getbyID(req,res,next,entityKey) {
    
    let queryResult
    try {
        const generic=require(Entidad[entityKey])   
        queryResult= await generic.findById(req.params.id )
        if (queryResult==null) {
            return res.status(404).json({message:'no se encontro ese id'})
        }
    } catch (error) {
        res.status(500).json({message:err.message})
    }
    res.queryResult=queryResult 
    next()
}

module.exports.getall=getall
module.exports.getbyID=getbyID
