import { Router } from 'express'
// import {CartManager } from '../Dao/fs/coder.js'
import {productModel} from '../Dao/models/products.model.js'
import {cartModel} from '../Dao/models/carts.model.js'

const rutaCarts = Router()

// const manejador = new CartManager('../desafio_mongo/src/carritos.json')

rutaCarts.get('/', async (req, res) => {
  // const carros = await manejador.getCarts()
  const carros = await cartModel.find()
  res.send(carros)
})

rutaCarts.get('/:id', async (req, res) => {
  // const carro = await manejador.getCartsById(parseInt(req.params.id))
  const { id } = req.params

  try {
      const cart = await cartModel.findById(id)
      if (cart)
          res.status(200).send({ respuesta: 'OK', mensaje: cart })
      else
          res.status(404).send({ respuesta: 'Error en consultar Carrito', mensaje: 'Not Found' })
  } catch (error) {
      res.status(400).send({ respuesta: 'Error en consulta carrito', mensaje: error })
  }


 // res.send(carro)
})
rutaCarts.post('/', async (req, res) => {
  /* const { products } = req.body // en el body viene un obj con prop products que es un array {"products": [{"product":1},{"product":3}   }
  const carrito = new Cart()
  carrito.products = products.slice()
  const respuesta = await manejador.addCart(carrito)
 */
  try {
    const cart = await cartModel.create({})
    res.status(200).send({ respuesta: 'OK', mensaje: cart })
} catch (error) {
    res.status(400).send({ respuesta: 'Error en crear Carrito', mensaje: error })
}

})
rutaCarts.post('/:cid/product/:pid', async (req, res) => {
  const { pid, cid } = req.params
  const { quantity } = req.body
  //const resp = await manejador.addProductToCart(parseInt(id), parseInt(pid))
  try {
    const cart = await cartModel.findById(cid)
    if (cart) {
        const prod = await productModel.findById(pid) //buscar el producto q se esta pasando en la base

        if (prod) {
          console.log(cart)
            const indice = cart.products.findIndex(item => item.id_prod == pid) //Busco si existe en el carrito
            if (indice != -1) {
                cart.products[indice].quantity = quantity //Si existe en el carrito modifico la cantidad
            } else {
                cart.products.push({ id_prod: pid, quantity: quantity }) //Si no existe, lo agrego al carrito
            }
            const respuesta = await cartModel.findByIdAndUpdate(cid, cart) //Actualizar el carrito
            res.status(200).send({ respuesta: 'OK', mensaje: respuesta })
        } else {
            res.status(404).send({ respuesta: 'Error en agregar producto Carrito', mensaje: 'Produt Not Found' })
        }
    } else {
        res.status(404).send({ respuesta: 'Error en agregar producto Carrito', mensaje: 'Cart Not Found' })
    }

} catch (error) {
    console.log(error)
    res.status(400).send({ respuesta: 'Error en agregar producto Carrito', mensaje: error })
}


})

rutaCarts.delete('/:cid', async (req, res) => {
  const { cid } = req.params
  try {
    const cartDelete = await cartModel.findByIdAndDelete(cid)
    if (cartDelete)
        res.status(200).send({ respuesta: 'OK', mensaje: 'Carro eliminado' })
    else
        res.status(404).send({ respuesta: 'Error en eliminar carro', mensaje: 'Not Found' })
} catch (error) {
    res.status(400).send({ respuesta: 'Error en eliminar carro', mensaje: error })
}
  
})



rutaCarts.put('/:id', async (req, res) => {
    // const carro = await manejador.getCartsById(parseInt(req.params.id))
    const { id } = req.params
   
    
    try {
        const cart = await cartModel.findById(id)
        if (cart){
            const prod = await productModel.findById(req.body.id_prod)
            const cantidad = req.body.quantity
                
            if(prod && cantidad){

            cart.products.push(req.body)
                    try{
                    const cartupdateado=  await cartModel.findOneAndUpdate({_id: id},cart)
                    res.status(200).send({ respuesta: 'OK', mensaje: cartupdateado })
                    }
                    catch (error){ res.status(400).send({ respuesta: 'Error en consulta carrito', mensaje: error }) }
                
            }
         else {res.status(404).send({ respuesta: 'Error en consultar Producto', mensaje: 'Revisar producto y cantidad' })}

        }else {res.status(404).send({ respuesta: 'Error en consultar Carrito', mensaje: 'Not Found' })}
        }
        catch (error) {
        res.status(400).send({ respuesta: 'Error en consulta carrito', mensaje: error })
    }
  
  
   // res.send(carro)
  })

export default rutaCarts
