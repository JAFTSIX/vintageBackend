const mongoose = require('mongoose')

const panesschema = new mongoose.Schema({

    nombre: {
        type: String,
        required: true
    },

    largo: {
        type: Number,
        required: true
    },

    fecha_de_horneado: {
        type: Date,
        required: true,
        default: Date.now
    }

})
module.exports=mongoose.model('panes',panesschema)