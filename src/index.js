import express from 'express'
import mongoose from 'mongoose'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import rutaProduct from './routes/products.route.js'
import rutaCarts from './routes/rutaCarts.route.js'
import rutaMessage from './routes/message.route.js'
import userRouter from './routes/users.route.js'
import loginRouter from './routes/login.route.js'
import path from 'path'
import __dirname from './utils.js'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import { messageModel } from './Dao/models/mesagges.model.js'
import 'dotenv/config'


const app = express()
const PORT = 4000
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL, 
        dbName: process.env.MONGO_DB,
        mongoOptions: {
            useNewUrlParser: true, // Establezco que la conexion sea mediante URL
            useUnifiedTopology: true // Manego de clusters de manera dinamica
        },
        ttl: 60 // Duracion de la sesion en la BDD en segundos

    }),
    secret: 'foo',
    resave: false, // Fuerzo a que se intente guardar a pesar de no tener modificacion en los datos
    saveUninitialized: false // Fuerzo a guardar la session a pesar de no tener ningun dato
}))


const Serverexp = app.listen(PORT, () => {

console.log(PORT)
console.log(PORT)

    console.log(`Server on Port ${PORT}`)
})
const io = new Server(Serverexp)

io.on('connection', (socket) => {
    console.log('Socket.io conectado')
    socket.on('mensajes', async () => {
        const mensajes = await messageModel.find()


        socket.emit('respuestamensajes', mensajes)
    })

})


 mongoose.connect(process.env.MONGO_URL, { dbName: process.env.MONGO_DB })

    .then(() => console.log('BDD conectada'))
    .catch(() => console.log('Error en conexion a BDD'))


app.use(express.static(path.join(__dirname, 'public')))
app.engine('handlebars', engine())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'handlebars')



app.use('/api/products', rutaProduct)
app.use('/api/carts', rutaCarts)
app.use('/api/messages', rutaMessage)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)