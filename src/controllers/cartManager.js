import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';

export class CartManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.carts = [];
  }

  async createCart() {
    await this.readCartsFromFile();

    const newCart = {
      id: uuidv4(),
      products: [],
    };

    this.carts.push(newCart);

    await this.saveCartsToFile();

    return newCart;
  }

  async addProductToCart(cartId, productId) {
    await this.readCartsFromFile();

    const cartIndex = this.carts.findIndex((cart) => cart.id === cartId);
    if (cartIndex === -1) {
      throw new Error('Carrito no encontrado');
    }

    const productToAdd = { id: productId, quantity: 1 };
    const cart = this.carts[cartIndex];
    const existingProduct = cart.products.find((product) => product.id === productId);

    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.products.push(productToAdd);
    }

    await this.saveCartsToFile();

    return 'Producto agregado al carrito satisfactoriamente';
  }

  async getCartProducts(cartId) {
    await this.readCartsFromFile();

    const cart = this.carts.find((cart) => cart.id === cartId);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    const products = await this.readProductsFromFile();

    const cartProducts = cart.products.map((cartProduct) => {
      const product = products.find((product) => product.id === cartProduct.id);
      return {
        ...product,
        quantity: cartProduct.quantity,
      };
    });

    return cartProducts;
  }

  async readCartsFromFile() {
    try {
      const cartsFromJson = await fs.readFile(this.filePath, 'utf-8');
      this.carts = JSON.parse(cartsFromJson);
    } catch (error) {
      console.error('Error al leer los carritos del archivo:', error.message);
      this.carts = [];
    }
  }

  async saveCartsToFile() {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(this.carts, null, 2));
    } catch (error) {
      console.error('Error al guardar los carritos en el archivo:', error.message);
    }
  }

  async readProductsFromFile() {
    try {
      const productsFromJson = await fs.readFile('src/models/product.json', 'utf-8');
      return JSON.parse(productsFromJson);
    } catch (error) {
      console.error('Error al leer los productos del archivo:', error.message);
      return [];
    }
  }
}
