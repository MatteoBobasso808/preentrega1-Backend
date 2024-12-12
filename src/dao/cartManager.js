import fs from 'fs'

export class CartManager{
    #path = ""

    constructor(ruta) {
        this.#path = ruta
    }

    async getCart(){
        if(fs.existsSync(this.#path)){
            return JSON.parse(await fs.promises.readFile(this.#path, {encoding: "utf-8"}))
        } else{
            throw new Error("El archivo no existe.")
        }
    }

    async createCart(){
        let cart = await this.getCart()

        let id = 1;
        if(cart.length > 0){
            id = Math.max(...cart.map(d => d.id)) + 1
        }

        let newCart = {id, products: []}
        cart.push(newCart)
        await fs.promises.writeFile(this.#path, JSON.stringify(cart, null, 2))
    }

    async addProduct(cid, pid){
        let cart = await this.getCart()
        let quantity = 1

        let index = cart.findIndex(cart => cart.id === cid)

        if(cart[index].products.find(product => product.pid === pid)){
            let product = cart[index].products.find(product => product.pid === pid)
            product.quantity += 1
        } else {
            let newProduct = {pid, quantity}
            cart[index].products.push(newProduct)
        }

        await fs.promises.writeFile(this.#path, JSON.stringify(cart, null, 2))
    }
}