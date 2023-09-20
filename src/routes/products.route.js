import { Router } from 'express'
// import { ProductManager, Product } from '../Dao/fs/coder.js'
import {productModel} from '../Dao/models/products.model.js'

// const manejador = new ProductManager('../desafio_mongo/src/productos.json')

/*
const producto1 = new Product(undefined, 'Comestible', 800, 'fotomanzana.jpg', 'ACB123', 151)
const producto2 = new Product('Coca-Cola', 'Bebible', 600, 'fotococa.jpg', 'ADK485', 300)
const producto3 = new Product('Aspirina', 'Salud', 500, 'fotoaspirina.jpg', 'JKL620', 1200)
const producto4 = new Product('Lavandina', 'Limpieza', 450, 'fotolavandina.jpg', 'ACB123', 800)
const producto5 = new Product('Pescado', 'Comestible', null, 'fotopescado.jpg', 'WER420', 80)
const producto6 = new Product('Papas fritas', 'Snack', 700, 'papitas.jpg', 'JKL620', 458)

await manejador.addProduct(producto1)
await manejador.addProduct(producto2)
await manejador.addProduct(producto3)
await manejador.addProduct(producto4)
await manejador.addProduct(producto5)
await manejador.addProduct(producto6)
*/
const rutaProduct = Router()

rutaProduct.get('/', async (req, res) => {
 
 const limit = req.query.limit || 10
 const page = req.query.page || 1
 const query = req.query.query
 const sort = req.query.sort
/* desc = -1
asc = 1 */
let sortpagination
switch (sort) {
  case 'desc':
    sortpagination = {price:-1}
    break
  case 'asc':
    sortpagination = {price:1}
    break
    default:
      sortpagination = undefined
}
let filtroobject

if(query){
const filtroarray =  query.split('=',2)

 filtroobject = Object.fromEntries([filtroarray])
}
let prods

 try {
    
    prods = await productModel.paginate(filtroobject,{limit,
    page,
    sort : sortpagination || ''
    ,lean:true})

   prods.status = 'Succes' 
   prods.payload = prods.docs 

 } catch (error) {
  
  prods.status = 'error'
  prods.payload = error
 } 
 
                                                          


console.log(prods)

res.render('products', {
  productos: prods.docs,
  title:'Productos',
  css: '/product.css',
  js: '/product.js'
})

})

rutaProduct.get('/:pid', async (req, res) => {
  const { pid } = req.params
  try {
  //  const respuesta1 = await manejador.getProducstById(parseInt(pid))
    const prod = await productModel.findById(pid)
    if (prod)
        res.status(200).send({ respuesta: 'OK', mensaje: JSON.stringify(prod) })
    else
        res.status(404).send({ respuesta: 'Error en consultar Producto', mensaje: 'Not Found' })
} catch (error) {
    res.status(400).send({ respuesta: 'Error en consulta producto', mensaje: error })
}


 
})

rutaProduct.post('/', async (req, res) => {
  try {
    const { title, description, price , code, stock,  category } = req.body
    //   const producPost = new Product(title, description, price, code, stock,  category)
    //  const respPost = await manejador.addProduct(producPost)
    const prod = await productModel.create({ title, description, stock, code, price, category })
    res.status(200).send({ respuesta: 'OK', mensaje:  JSON.stringify(prod)  + 'Ingresado a DB' })
} catch (error) {
    res.status(400).send({ respuesta: 'Error en crear productos', mensaje: error })
}
})

rutaProduct.put('/:pid', async (req, res) => {
  const { title, description, price, thumbnail, code, stock, status, category } = req.body
  const { pid } = req.params
// const producPut = await manejador.updateProducstById(parseInt(pid), { title, description, price, thumbnail, code, stock, status, category })
  
try {
  const prodput = await productModel.findByIdAndUpdate(pid , { title, description, price, thumbnail, code, stock, status, category })
  if (prodput)
      res.status(200).send({ respuesta: 'OK', mensaje: 'Producto actualizado' })
  else
      res.status(404).send({ respuesta: 'Error en actualizar Producto', mensaje: 'Not Found' })
} catch (error) {
console.log(error)

  res.status(400).send({ respuesta: 'Error en actualizar producto', mensaje: error })
}


})

rutaProduct.delete('/:pid', async (req, res) => {
  const { pid } = req.params
  try {
    const producDelete = await productModel.findByIdAndDelete(pid)
    if (producDelete)
        res.status(200).send({ respuesta: 'OK', mensaje: 'Producto eliminado' })
    else
        res.status(404).send({ respuesta: 'Error en eliminar Producto', mensaje: 'Not Found' })
} catch (error) {
    res.status(400).send({ respuesta: 'Error en eliminar producto', mensaje: error })
}
 // const producDelete = await manejador.deleteProducstById(parseInt(pid))
  
})
export default rutaProduct
