require('dotenv').config()

const express=require('express')
const app=express()
const mongoose= require('mongoose')


/*CONECCION A MONGO*/
mongoose.connect(process.env.DATABASE_URL,{ useNewUrlParser: true })
const db= mongoose.connection
db.on( 'error',(error)=> console.error(error))
db.once('open',()=>console.log('conectado a MongoDb'))
/*FIN CONECCION A MONGO*/


/*USE JSON */
app.use(express.json())






/*RUTEO API*/
const panRuta=require('./routes/pan') 
app.use('/pan',panRuta)
/*FIN RUTEO API*/

const port=6454

app.listen(port,()=> console.log('corre en puerto '+port))