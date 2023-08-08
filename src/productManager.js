import { promises as fs } from 'fs';

export class ProductManager {
  // Constructor de la clase ProductManager
  constructor(filePath) {
    this.filePath = filePath;      // Ruta del archivo de productos
    this.products = [];            // Arreglo para almacenar los productos
    this.productIdCounter = 1;     // Contador para generar IDs únicos
  }

  // Método para agregar un nuevo producto
  async addProduct(productData) {
    if (
      !productData.title ||
      !productData.description ||
      !productData.price ||
      !productData.thumbnail ||
      !productData.code ||
      !productData.stock
    ) {
      console.log('Faltan campos obligatorios');
      return;
    }

    const codigo = productData.code;
    const productoExistente = this.products.find((producto) => producto.code === codigo);
    if (productoExistente) {
      console.log('El código del producto ya existe');
      return;
    }

    const productoConId = {
      ...productData,
      id: this.productIdCounter,
    };
    this.productIdCounter++;

    this.products.push(productoConId);

    await this.saveProductsToFile();  // Guardar los productos en el archivo
  }

  // Método para obtener la lista de productos, opcionalmente con un límite
  async getProducts(limit = 0) {
    await this.readProductsFromFile();  // Leer los productos desde el archivo
    return limit ? this.products.slice(0, limit) : this.products;
  }

  // Método para obtener un producto por su ID
  async getProductById(id) {
    await this.readProductsFromFile();  // Leer los productos desde el archivo
    const producto = this.products.find((producto) => producto.id === id);
    if (!producto) {
      console.error('No encontrado');
      return null;
    }
    return producto;
  }

  // Método para actualizar un producto por su ID
  async updateProduct(id, updatedData) {
    await this.readProductsFromFile();  // Leer los productos desde el archivo

    const productoExistente = this.products.find((producto) => producto.id === id);
    if (!productoExistente) {
      console.log('Producto no encontrado');
      return;
    }

    const productoActualizado = {
      ...productoExistente,
      ...updatedData,
      id,
    };

    this.products = this.products.map((producto) =>
      producto.id === id ? productoActualizado : producto
    );

    await this.saveProductsToFile();  // Guardar los productos actualizados en el archivo

    console.log('Producto actualizado satisfactoriamente');
  }

  // Método para eliminar un producto por su ID
  async deleteProduct(id) {
    await this.readProductsFromFile();  // Leer los productos desde el archivo

    const index = this.products.findIndex((producto) => producto.id === id);

    if (index === -1) {
      console.log('Producto no encontrado');
      return;
    }

    this.products.splice(index, 1);

    await this.saveProductsToFile();  // Guardar los productos actualizados en el archivo

    console.log('Producto eliminado satisfactoriamente');
  }

  // Método para leer los productos desde el archivo
  async readProductsFromFile() {
    try {
      const productsFromTxt = await fs.readFile(this.filePath, 'utf-8');
      this.products = JSON.parse(productsFromTxt);
    } catch (error) {
      console.error('Error al leer los productos del archivo:', error.message);
      this.products = [];
    }
  }

  // Método para guardar los productos en el archivo
  async saveProductsToFile() {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(this.products));
    } catch (error) {
      console.error('Error al guardar los productos en el archivo:', error.message);
    }
  }
}
