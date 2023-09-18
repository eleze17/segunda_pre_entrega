import { promises as fs } from 'fs'

export class ProductManager {
  constructor (path) {
    this.products = []
    this.path = path
  }

  async addProduct (product) {
    let ok = true
    let mensaje = ''
    // validar tenga todos los campos
    const validadcampos = Object.values(product)
    const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'))
    validadcampos.forEach(element => {
      if (!ok) {
        return
      }

      ok = element ?? false
      if (!ok) {
        mensaje = (element + '  No se permiten campos nulos o indefindos')
      }
    })

    if (ok) {
      // validar code unico
      const validacionCode = product.code

      let encontrado = false
      if (product.id > 0) {
        prods.forEach((p) => {
          if (p.code === validacionCode) {
            encontrado = true
            mensaje = (p.code + '  Codigo Existente')
          }
        })
      }
      console.log(validacionCode)
      console.log(product.id)
      console.log(encontrado)

      if ((ok && encontrado === false) || product.id === 1) {
        const prods = JSON.parse(await fs.readFile(this.path, 'utf-8'))
        prods.push(product)
        await fs.writeFile(this.path, JSON.stringify(prods))
        mensaje = (`producto ${product.title} agregado `)
      }
    }
    return mensaje
  }

  async getProducst () {
    const productos = (await fs.readFile(this.path, 'utf-8'))
    return productos
  }

  async getProducstById (id) {
    const producto = JSON.parse(await fs.readFile(this.path, 'utf-8'))

    const productobuscado = producto.filter(
      p => p.id === id
    )
    return productobuscado.length === 0 ? 'Not Found' : productobuscado[0]
  }

  async deleteProducstById (id) {
    const producto = JSON.parse(await fs.readFile(this.path, 'utf-8'))

    const productobuscado = producto.find(p => p.id === id)

    if (productobuscado) {
      producto.splice(producto.indexOf(productobuscado), 1)

      await fs.writeFile(this.path, JSON.stringify(producto))
    }
    return !productobuscado ? 'Not Found' : 'Producto eliminado'
  }

  async updateProducstById (id, newObject) {
    const producto = JSON.parse(await fs.readFile(this.path, 'utf-8'))

    const productobuscado = producto.find(p => p.id === id)

    if (productobuscado) {
      newObject.id = id
      producto.splice(producto.indexOf(productobuscado), 1, newObject)

      await fs.writeFile(this.path, JSON.stringify(producto))
    }
    return !productobuscado ? 'Not Found' : 'Producto actualizado'
  }
}

export class Product {
  constructor (title, description, price, thumbnail, code, stock, status, category) {
    this.title = title
    this.description = description
    this.price = price
    this.thumbnail = thumbnail
    this.code = code
    this.stock = stock
    this.status = status || true
    this.category = category
    this.id = Product.incrementarId()
  }

  static incrementarId () {
    this.incrementId ? this.incrementId++ : this.incrementId = 1
    return this.incrementId
  }
}

export class CartManager {
  constructor (path) {
    this.carts = []
    this.path = path
  }

  async addCart (cart) {
    const cartarray = JSON.parse(await fs.readFile(this.path, 'utf-8')) // [{products:[{product:1,quantity:1}],id:1}]
    cartarray.push(cart)
    await fs.writeFile(this.path, JSON.stringify(cartarray))
    const mensaje = (`carrito ${cart.id} agregado `)
    return mensaje
  }

  async getCarts () {
    const carts = await fs.readFile(this.path, 'utf-8')
    return carts
  }

  async getCartsById (id) {
    const cart = JSON.parse(await fs.readFile(this.path, 'utf-8'))

    const carritobuscado = cart.filter(
      c => c.id === id
    )
    return carritobuscado.length === 0 ? 'Not Found' : carritobuscado[0]
  }

  async addProductToCart (idcart, idprod) {
    const cart = JSON.parse(await fs.readFile(this.path, 'utf-8')) // [{products:[{product:1,quantity:1}],id:1}]
    cart.forEach((carro) => {
      if (carro.id === idcart) {
        const product = carro.products.find((element, indiceprod) => (element.product === idprod))
        if (!product) {
          const quantity = 1
          carro.products.push({ product: idprod, quantity })
        } else {
          const reemplazo = carro.products.indexOf(product)
          carro.products.splice(reemplazo, 1, { product: idprod, quantity: product.quantity = ++product.quantity || 2 })
        }
      }
    })

    await fs.writeFile(this.path, JSON.stringify(cart))
    const mensaje = (`Se agrego al carro id : ${idcart} el producto id : ${idprod} `)
    return mensaje
  }
}

export class Cart {
  constructor () {
    this.products = []
    this.id = Cart.incrementarCartId()
  }

  static incrementarCartId () {
    this.incrementCartId ? this.incrementCartId++ : this.incrementCartId = 1
    return this.incrementCartId
  }
}
