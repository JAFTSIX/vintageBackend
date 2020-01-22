const express = require('express')
const router = express.Router()
const pan = require('../entidades/pan')
const bs = require('../DataAccesLayer/repository')

//get all
//http://localhost:6454/pan
router.get('/', async (req, res) => {
    bs.getall(req, res, 'objeto')
})



//get one
//http://localhost:6454/pan/1

router.get('/:id',
    (req, res, next) => {
        bs.getpan(req, res, next, 'objeto')
    }, (req, res) => {
        res.send(res.queryResult.nombre)
    })





//insert
//http://localhost:6454/pan
router.post('/', async (req, res) => {
    const recienhorneado = new pan({
        nombre: req.body.nombre,
        largo: req.body.largo
    })

    try {
        const pancitogurdado = await recienhorneado.save()
        res.status(201).json(pancitogurdado)
    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }

})


//update
router.patch('/:id', getpan, async (req, res) => {
    if (req.body.nombre != null) {
        res.panini.nombre = req.body.nombre
    }
    if (req.body.largo != null) {
        res.panini.largo = req.body.largo
    }
    try {
        const panelo = await res.panini.save()

        res.status(200).json(panelo)
    } catch (error) {
        res.status(500).json({
            message: err.message
        })
    }
})
//delete
router.delete('/:id', getpan, (req, res) => {
    try {
        res.panini.remove()
        res.status(200).json({
            message: 'pan eliminado'
        })
    } catch (error) {
        res.status(500).json({
            message: err.message
        })
    }

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