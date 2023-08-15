import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';

export class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.products = [];
    this.productIdCounter = 1;
  }

  async addProduct(productData) {
    if (!this.products.length) {
      await this.readProductsFromFile();
    }

    if (
      !productData.title ||
      !productData.description ||
      !productData.price ||
      !productData.thumbnail ||
      !productData.code ||
      !productData.stock
    ) {
      throw new Error('Faltan campos obligatorios');
    }

    const codigo = productData.code;
    const productoExistente = this.products.find((producto) => producto.code === codigo);
    if (productoExistente) {
      throw new Error('El código del producto ya existe');
    }

    const productoConId = {
      ...productData,
      id: uuidv4(),
    };

    this.products.push(productoConId);

    await this.saveProductsToFile();
  }

  async getProducts(limit = 0) {
    await this.readProductsFromFile();
    return limit ? this.products.slice(0, limit) : this.products;
  }

  async getProductById(id) {
    await this.readProductsFromFile();
    const producto = this.products.find((producto) => producto.id === id);
    if (!producto) {
      console.error('No encontrado');
      return null;
    }    
    return producto;
  }

  async updateProduct(id, updatedData) {
    await this.readProductsFromFile();

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

    await this.saveProductsToFile();

    console.log('Producto actualizado satisfactoriamente');
  }

  async deleteProduct(id) {
    await this.readProductsFromFile();

    const index = this.products.findIndex((producto) => producto.id === id);

    if (index === -1) {
      console.log('Producto no encontrado');
      return;
    }

    this.products.splice(index, 1);

    await this.saveProductsToFile();

    console.log('Producto eliminado satisfactoriamente');
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