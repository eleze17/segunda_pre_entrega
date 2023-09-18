import { Router } from 'express'
import {messageModel} from '../Dao/models/mesagges.model.js'
const rutaMessage = Router()


rutaMessage.get('/', async (req, res) =>{
    res.render('chats', {
        css: '/style.css',
        js: '/chat.js',
        })
})

rutaMessage.post('/',async(req,res)=>{
    try {
        const { email, message } = req.body
        console.log(email,message)

        const mesagges = await messageModel.create({ email,message })
        res.status(200).send({ respuesta: 'OK', mensaje: JSON.stringify(mesagges)  })
    } catch (error) {
        res.status(400).send({ respuesta: 'Error en crear mensajes', mensaje: error })
    }
})




export default rutaMessage
