import express from 'express';
import { ProductsManager } from './dao/productsManager.js';

const PORT = 8080
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const RutaProductos = './src/data/products.json'
const RutaCarrito = './src/data/carrito.json'

const productsManager = new ProductsManager(RutaProductos)

app.get('/', (req, res) => {
  res.send(`Bienvenidos a la tienda online
    /api/products => muestra todos los productos
    /api/carts => muestra todos los productos del carrito`)
})

app.get('/api/products/', async (req, res) => {
    let products = await productsManager.getProducts()

    let {limit} = req.query
    if(limit){
        products = products.slice(0, limit)
    }

    res.status(200).send(products)
})

app.get('/api/products/:pid', async (req, res) => {
    let products = await productsManager.getProducts()
    
    let {pid} = req.params
    pid = Number(pid)

    if(isNaN(pid)){
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).send({error: 'El id debe ser un número'})
    }

    products = products.find(product => product.id === pid)
    if(!products){
        res.setHeader('Content-Type', 'application/json')
        return res.status(404).send({error: 'El producto que buscas no existe'})
    }

    res.status(200).send(products)
})

app.post('/api/products', async (req, res) => {
    let product = req.body

    if(product.title == undefined){
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).send({error: 'El producto no tiene un título'})
    }

    if(product.description == undefined){
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).send({error: 'El producto no tiene una descripción'})
    }

    if(product.code == undefined){
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).send({error: 'El producto no tiene un código'})
    }

    if(product.price == undefined){
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).send({error: 'El producto no tiene un precio'})
    }

    if(product.status == undefined){
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).send({error: 'El producto no tiene un estado'})
    }

    if(product.stock == undefined){
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).send({error: 'El producto no tiene un stock'})
    }

    if(product.category == undefined){
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).send({error: 'El producto no tiene una categoría'})
    }

    if(product.thumbnails == undefined){
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).send({error: 'El producto no tiene una imagen, podes pasar un array vacío'})
    }

    productsManager.addProduct(product)
    console.log('Producto agregado correctamente')

    res.status(200).send('Producto agregado correctamente')
})

app.listen(PORT, () => {
  console.log(`Server corriendo en puerto ${PORT}`)
})

