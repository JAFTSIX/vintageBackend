const express = require('express')
const router = express.Router()
const pan = require('../entidades/pan')
const bs = require('../BussinesLogic/pan')

//get all
//http://localhost:6454/pan
router.get('/', async (req, res) => {
    bs.getall(req, res)
})



//get one
//http://localhost:6454/pan/1

router.get('/:id',
    (req, res, next) => {
        
        bs.getbyID(req, res, next, 'objeto')
    }, (req, res) => {
        res.send(res.queryResult)
    })




//insert
//http://localhost:6454/pan
router.post('/', async (req, res) => {
    bs.insert(req,res)
})


//update
router.patch('/:id', (req, res, next) => {
        
    bs.getbyID(req, res, next, 'objeto')
}, async (req, res) => {
    bs.update(req, res)
    
})



//delete
router.delete('/:id', (req, res, next) => {
        
    bs.getbyID(req, res, next, 'objeto')
},
   (req, res) => {
   bs.deletee(req, res)

})


async function getpan(req, res, next) {
    let panini
    try {
        panini = await pan.findById(req.params.id)
        if (panini == null) {
            return res.status(404).json({
                message: 'no se encontro ese id'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: err.message
        })
    }
    res.panini = panini
    next()
}


module.exports = router