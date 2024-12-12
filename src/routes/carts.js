import { Router } from 'express';
import { ProductsManager } from '../dao/productsManager.js';
import { CartManager } from '../dao/cartManager.js';

const router = Router();
const RutaProductos = './src/data/products.json';
const RutaCarrito = './src/data/carrito.json';
const productsManager = new ProductsManager(RutaProductos);
const cartsManager = new CartManager(RutaCarrito);

router.post('/', async (req, res) => {
    cartsManager.createCart()
    res.status(201).send({ success: 'Carrito creado correctamente' });
})

router.get('/:cid', async (req, res) => {
    let carts = await cartsManager.getCart();
    let { cid } = req.params;
    cid = Number(cid);

    if (isNaN(cid)) {
        return res.status(400).send({ error: 'El id debe ser un número' });
    }

    let cart = carts.find(cart => cart.id === cid);
    if (!cart) {
        return res.status(404).send({ error: 'El carrito que buscas no existe' });
    }

    res.status(200).send(cart);
})

router.post('/:cid/products/:pid', async (req, res) => {
    let carts = await cartsManager.getCart();
    let { cid, pid } = req.params;
    cid = Number(cid);
    pid = Number(pid);

    if (isNaN(cid)) {
        return res.status(400).send({ error: 'El id del carrito debe ser un número' });
    }

    if (isNaN(pid)) {
        return res.status(400).send({ error: 'El id del producto debe ser un número' });
    }

    let cart = carts.find(cart => cart.id === cid);
    if (!cart) {
        return res.status(404).send({ error: 'El carrito que buscas no existe' });
    }

    let products = await productsManager.getProducts();
    let product = products.find(product => product.id === pid);
    if (!product) {
        return res.status(404).send({ error: 'El producto que buscas no existe' });
    }

    cartsManager.addProduct(cid, pid);
    res.status(201).send({ success: 'Producto agregado correctamente' });
})

export default router;