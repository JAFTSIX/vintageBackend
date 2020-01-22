require('dotenv').config()

const express=require('express')
const app=express()
const mongoose= require('mongoose')


/*CONECCION A MONGO*/
mongoose.connect(process.env.DATABASE_URL,{ useNewUrlParser: true })
const db= mongoose.connection
db.on( 'error',(error)=> console.error(error))
db.once('open',()=>console.log('conectado'))
/*FIN CONECCION A MONGO*/


/*USAR JSON */
app.use(express.json())






/*RUTEO API*/
const panruters=require('./routes/pan') 
app.use('/pan',panruters)
/*FIN RUTEO API*/


app.listen(6454,()=> console.log('corre looool'))