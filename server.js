/**
 * Este file configura algunos aspectos del entorno
 * los cuales son:
 *     -la conexion a la base de datos
 *     -poner en acción a Express js y el puerto
 *     -declarar los controllers y sus rutas
 *     
 * 
 */

require('dotenv').config()

const express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    port = 6454


/*CONECCION A MONGO*/
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true
})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('conectado a MongoDb'))
/*FIN CONECCION A MONGO*/


/*USA JSON */
app.use(express.json())






/*RUTEO API*/
const panRuta = require('./routes/pan')

app.use('/pan', panRuta)

/*FIN RUTEO API*/



app.listen(port, () => console.log('ejecución en el puerto: ' + port))