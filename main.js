class Product {
    constructor(title, description, price, thumbnail, code, stock) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}

class ProductManager {
    constructor() {
        this.products = [];
        this.productIdCounter = 1;
    }

    addProduct(productData) {
        // Validar que todos los campos sean obligatorios
        if (
            !productData.title || !productData.description || !productData.price || !productData.thumbnail || !productData.code || !productData.stock
        ) {
            console.log("Faltan campos obligatorios");
            return;
        }

        // Validar que el campo "code" no se repita
        const codigo = productData.code;
        const productoExistente = this.products.find((producto) => producto.code === codigo);
        if (productoExistente) {
            console.log("El código del producto ya existe");
            return;
        }

        // Agregar el producto al arreglo con un id autoincrementable
        const productoConId = {
            ...productData,
            id: this.productIdCounter,
        };
        this.productIdCounter++;

        this.products.push(productoConId);
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const producto = this.products.find((producto) => producto.id === id);
        if (!producto) {
            console.error("No encontrado");
            return null;
        }
        return producto;
    }
}

// Ejemplo de uso:

const productManager = new ProductManager();

productManager.addProduct({
    title: "Potus",
    description: "Variegado",
    price: 10.99,
    thumbnail: "imagen no disponible",
    code: "p1",
    stock: 100,
});

productManager.addProduct({
    title: "Monstera Deliciosa",
    description: "Cuidado Fácil",
    price: 19.99,
    thumbnail: "imagen no disponible",
    code: "p2",
    stock: 50,
});

productManager.addProduct({
    title: "Flor de la paz",
    description: "Cuidado Moderado",
    price: 200,
    thumbnail: "imagen no disponible",
    code: "p3",
    stock: 250,
});

console.log(productManager.getProducts());
console.log(productManager.getProductById(1));
console.log(productManager.getProductById(2));
console.log(productManager.getProductById(3)); 
console.log(productManager.getProductById(4)); // Esto mostrará "No encontrado"
