import fs from "fs"

export class ProductsManager{
    #path=""

    constructor(ruta){
        this.#path=ruta
    }

    async getProducts(){
        if(fs.existsSync(this.#path)){
            return JSON.parse(await fs.promises.readFile(this.#path, {encoding: "utf-8"}))
        } else{
            throw new Error("El archivo no existe.")
        }
    }

    async addProduct(product){
        let products = await this.getProducts()
        
        let id = 1
        if(products.length > 0){
            id = Math.max(...products.map(d => d.id)) + 1
        }

        let newProduct = {id, ...product, status: true, thumbnails: []}
        products.push(newProduct)
        await fs.promises.writeFile(this.#path, JSON.stringify(products, null, 2))
    }

    async editProduct(id, product){
        let products = await this.getProducts()
        
        let index = products.findIndex(product => product.id === id)
        
        products[index] = {...products[index], ...product}
        await fs.promises.writeFile(this.#path, JSON.stringify(products, null, 2))
    }

    async removeProduct(id){
        let products = await this.getProducts()
        
        products = products.filter(product => product.id !== id)
        await fs.promises.writeFile(this.#path, JSON.stringify(products, null, 2))
    }
}