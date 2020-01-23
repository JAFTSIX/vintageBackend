const express = require('express')
const router = express.Router()

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


module.exports = router