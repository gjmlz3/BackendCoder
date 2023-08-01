import { promises as fs } from 'fs';

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

  async addProduct(productData) {
    // Validar que todos los campos sean obligatorios
    if (
      !productData.title ||
      !productData.description ||
      !productData.price ||
      !productData.thumbnail ||
      !productData.code ||
      !productData.stock
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

    // Agregar el producto al arreglo local
    this.products.push(productoConId);

    // Guardar los productos en el archivo txt
    await this.saveProductsToFile();
  }

  async getProducts() {
    // Leer los productos del archivo txt al inicio
    await this.readProductsFromFile();
    return this.products;
  }

  async getProductById(id) {
    // Leer los productos del archivo txt al inicio
    await this.readProductsFromFile();
    const producto = this.products.find((producto) => producto.id === id);
    if (!producto) {
      console.error("No encontrado");
      return null;
    }
    return producto;
  }

  async updateProduct(id, updatedData) {
    // Leer los productos del archivo txt al inicio
    await this.readProductsFromFile();

    // Buscar el producto por id
    const productoExistente = this.products.find((producto) => producto.id === id);
    if (!productoExistente) {
      console.log("Producto no encontrado");
      return;
    }

    // Actualizar el producto
    const productoActualizado = {
      ...productoExistente,
      ...updatedData,
      id, // No se debe borrar el id existente
    };

    // Reemplazar el producto en el arreglo
    this.products = this.products.map((producto) =>
      producto.id === id ? productoActualizado : producto
    );

    // Guardar los productos actualizados en el archivo txt
    await this.saveProductsToFile();

    console.log("Producto actualizado satisfactoriamente");
  }

  async deleteProduct(id) {
    // Leer los productos del archivo txt al inicio
    await this.readProductsFromFile();

    // Encontrar el índice del producto con el id proporcionado
    const index = this.products.findIndex((producto) => producto.id === id);

    if (index === -1) {
      console.log("Producto no encontrado");
      return;
    }

    // Eliminar el producto del arreglo
    this.products.splice(index, 1);

    // Guardar los productos actualizados en el archivo txt
    await this.saveProductsToFile();

    console.log("Producto eliminado satisfactoriamente");
  }

  async readProductsFromFile() {
    try {
      const productsFromTxt = await fs.readFile('./product.txt', 'utf-8');
      this.products = JSON.parse(productsFromTxt);
    } catch (error) {
      console.error("Error al leer los productos del archivo:", error.message);
      this.products = [];
    }
  }

  async saveProductsToFile() {
    try {
      await fs.writeFile('./product.txt', JSON.stringify(this.products));
    } catch (error) {
      console.error("Error al guardar los productos en el archivo:", error.message);
    }
  }
}

// Ejemplo de uso:

const productManager = new ProductManager();

(async () => {
  await productManager.addProduct({
    title: "Potus",
    description: "Variegado",
    price: 10.99,
    thumbnail: "imagen no disponible",
    code: "p1",
    stock: 100,
  });

  await productManager.addProduct({
    title: "Monstera Deliciosa",
    description: "Cuidado Fácil",
    price: 19.99,
    thumbnail: "imagen no disponible",
    code: "p2",
    stock: 50,
  });

  await productManager.addProduct({
    title: "Flor de la paz",
    description: "Cuidado Moderado",
    price: 200,
    thumbnail: "imagen no disponible",
    code: "p3",
    stock: 250,
  });

  // Ejemplo de actualización de un producto
  await productManager.updateProduct(1, {
    title: "Nuevo título",
    price: 15.99,
  });

  // Ejemplo de eliminación de un producto
  await productManager.deleteProduct(2);

  const producto = await productManager.getProductById(1);
  console.log(producto);
})();
