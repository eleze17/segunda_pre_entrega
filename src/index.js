import express from 'express'
import mongoose from 'mongoose'
import rutaProduct from './routes/products.route.js'
import rutaCarts from './routes/rutaCarts.route.js'
import rutaMessage from './routes/message.route.js'
import path from 'path'
import __dirname from './utils.js'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import { messageModel } from './Dao/models/mesagges.model.js'
const app = express()
const PORT = 4000
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


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


mongoose.connect('mongodb+srv://eze:floki123@cluster0.4j7mzjp.mongodb.net/?retryWrites=true&w=majority', { dbName: 'ecommerce' })

    .then(() => console.log('BDD conectada'))
    .catch(() => console.log('Error en conexion a BDD'))


app.use(express.static(path.join(__dirname, 'public')))
app.engine('handlebars', engine())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'handlebars')



app.use('/api/products', rutaProduct)
app.use('/api/carts', rutaCarts)
app.use('/api/messages', rutaMessage)
