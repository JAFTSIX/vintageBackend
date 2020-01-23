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


async function insert (req, res,objeto) {
    
    try {

        const saved = await objeto.save()
        res.status(201).json(saved)

    } catch (err) {
        res.status(400).json({
            message: err.message
        })
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


async function update(req, res) {
    

    try {
        const saved = await res.queryResult.save()

        res.status(200).json(saved)
    } catch (error) {
        res.status(500).json({
            message: err.message
        })
    }
}


async function deletee (req, res) {
    try {
        res.queryResult.remove()
        res.status(200).json({
            message: 'objeto eliminado con éxito'
        })
    } catch (error) {
        res.status(500).json({
            message: err.message
        })
    }

}

module.exports.getall=getall
module.exports.getbyID=getbyID
module.exports.insert=insert
module.exports.update=update
module.exports.deletee=deletee