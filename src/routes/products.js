import { Router } from 'express';
import { ProductsManager } from '../dao/productsManager.js';

const router = Router();
const RutaProductos = './src/data/products.json';
const productsManager = new ProductsManager(RutaProductos);

router.get('/', async (req, res) => {
    let products = await productsManager.getProducts();
    let { limit } = req.query;
    if (limit) {
        products = products.slice(0, limit);
    }
    res.status(200).send(products);
});

router.get('/:pid', async (req, res) => {
    let products = await productsManager.getProducts();
    let { pid } = req.params;
    pid = Number(pid);

    if (isNaN(pid)) {
        return res.status(400).send({ error: 'El id debe ser un número' });
    }

    let product = products.find(product => product.id === pid);
    if (!product) {
        return res.status(404).send({ error: 'El producto que buscas no existe' });
    }

    res.status(200).send(product);
});

router.post('/', async (req, res) => {
    let product = req.body;

    if (!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category) {
        return res.status(400).send({ error: 'Todos los campos son obligatorios' });
    }

    productsManager.addProduct(product);
    res.status(201).send({ success: 'Producto agregado correctamente' });
});

router.put('/:pid', async (req, res) => {
    let products = await productsManager.getProducts();
    let { pid } = req.params;
    pid = Number(pid);
    let productEdit = req.body;

    if (isNaN(pid)) {
        return res.status(400).send({ error: 'El id debe ser un número' });
    }

    let product = products.find(product => product.id === pid);
    if (!product) {
        return res.status(404).send({ error: 'El producto que buscas no existe' });
    }

    productsManager.editProduct(pid, productEdit);
    res.status(200).send({ success: 'Producto editado correctamente' });
});

router.delete('/:pid', async (req, res) => {
    let products = await productsManager.getProducts();
    let { pid } = req.params;
    pid = Number(pid);

    if (isNaN(pid)) {
        return res.status(400).send({ error: 'El id debe ser un número' });
    }

    let product = products.find(product => product.id === pid);
    if (!product) {
        return res.status(404).send({ error: 'El producto que buscas no existe' });
    }

    productsManager.removeProduct(pid);
    res.status(200).send({ success: 'Producto eliminado correctamente' });
});

export default router;
