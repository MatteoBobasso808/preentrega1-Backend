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
        
        let newProduct = {id, ...product}
        products.push(newProduct)
        await fs.promises.writeFile(this.#path, JSON.stringify(products, null, 2))
    }
}