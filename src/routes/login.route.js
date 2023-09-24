import { Router } from 'express'
import { userModel } from '../Dao/models/user.model.js'

const loginRouter = Router()

loginRouter.get('/', (req, res) => {
    res.render('login',
    {
        css:'/login.css',
        js: '/login.js'
    })    
})

loginRouter.post('/', async (req, res) => {
    const { email, password } = req.body

    try {
        if (req.session.login) {
            res.status(200).send({ resultado: 'Login ya existente' })
        }
        const user = await userModel.findOne({ email })

        if (user) {
            if (user.password === password) {
                req.session.login = true
                // res.status(200).send({ resultado: 'Login valido', message: user })
                res.redirect('rutaProd,uctos', 200,{user:true}) // Redireccion
              
                res.status(401).send({ resultado: 'Contaseña no valida', message: password })
            }
        } else {
            res.status(404).send({ resultado: 'Not Found', message: user })
        }

    } catch (error) {
        res.status(400).send({ error: `Error en Login: ${error}` })
    }
})

loginRouter.get('/logout', (req, res) => {
    if (req.session.login) {
        req.session.destroy()
    }
    // res.status(200).send({ resultado: 'Usuario deslogueado' })
    res.redirect('rutaLogin', 200, { resultado: 'Usuario deslogueado' })
})




export default loginRouter