const Repositorio = require('../DataAccesLayer/repository')
const pan = require('../entidades/pan')
//'../entidades/pan'

async function getall(req, res) {
    try {

        Repositorio.getall(req, res, 'objeto')

    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }

}

async function insert(req, res) {
    const recienhorneado = new pan({
        nombre: req.body.nombre,
        largo: req.body.largo
    })

    try {
        Repositorio.insert(req, res, recienhorneado)


    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }

}

async function getbyID(req, res, next) {


    try {
        Repositorio.getbyID(req, res, next, 'objeto')
    } catch (error) {
        res.status(500).json({
            message: err.message
        })
    }

}


async function update(req, res) {


    try {
        if (req.body.nombre != null) {
            res.queryResult.nombre = req.body.nombre
        }
        if (req.body.largo != null) {
            res.queryResult.largo = req.body.largo
        }

        Repositorio.update(req, res)
    } catch (error) {
        res.status(500).json({
            message: err.message
        })
    }
}


async function deletee(req, res) {

    try {
        Repositorio.deletee(req, res)
    } catch (error) {
        res.status(500).json({
            message: err.message
        })
    }
}

module.exports.getall = getall
module.exports.getbyID = getbyID
module.exports.insert = insert
module.exports.update = update
module.exports.deletee = deletee