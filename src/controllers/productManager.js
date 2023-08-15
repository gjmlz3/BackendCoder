import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { CartManager } from './cartManager.js';

export class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.products = [];
  }

  async addProduct(productData) {
    await this.readProductsFromFile();

    if (
      !productData.title ||
      !productData.description ||
      !productData.price ||
      !productData.thumbnail ||
      !productData.code ||
      !productData.stock
    ) {
      return 'Faltan campos obligatorios';
    }

    const codigo = productData.code;
    const productoExistente = this.products.find((producto) => producto.code === codigo);
    if (productoExistente) {
      return 'El código del producto ya existe';
    }

    const productoConId = {
      ...productData,
      id: uuidv4(),
    };

    this.products.push(productoConId);

    await this.saveProductsToFile();

    return 'Producto agregado satisfactoriamente';
  }

  async getProducts(limit = 0) {
    await this.readProductsFromFile();
    return limit > 0 ? this.products.slice(0, limit) : this.products;
  }

  async getProductById(id) {
    await this.readProductsFromFile();
    const producto = this.products.find((producto) => producto.id === id);
    return producto;
  }

  async updateProduct(id, updatedData) {
    await this.readProductsFromFile();

    const index = this.products.findIndex((producto) => producto.id === id);
    if (index === -1) {
      return 'Producto no encontrado';
    }

    const productoActualizado = {
      ...this.products[index],
      ...updatedData,
      id,
    };

    this.products[index] = productoActualizado;

    await this.saveProductsToFile();

    return 'Producto actualizado satisfactoriamente';
  }

  async deleteProduct(id) {
    await this.readProductsFromFile();

    const index = this.products.findIndex((producto) => producto.id === id);
    if (index === -1) {
      return 'Producto no encontrado';
    }

    this.products.splice(index, 1);

    await this.saveProductsToFile();

    return 'Producto eliminado satisfactoriamente';
  }

  async readProductsFromFile() {
    try {
      const productsFromJson = await fs.readFile(this.filePath, 'utf-8');
      this.products = JSON.parse(productsFromJson);
    } catch (error) {
      console.error('Error al leer los productos del archivo:', error.message);
      this.products = [];
    }
  }

  async saveProductsToFile() {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(this.products, null, 2));
    } catch (error) {
      console.error('Error al guardar los productos en el archivo:', error.message);
    }
  }
}
