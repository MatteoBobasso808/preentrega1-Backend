import express from 'express';

const PORT = 8080
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const RutaProductos = './src/data/productos.json'
const RutaCarrito = './src/data/carrito.json'

app.listen(PORT, () => {
  console.log(`Server corriendo en puerto ${PORT}`)
})