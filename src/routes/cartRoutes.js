import express from 'express';
import { CartManager } from '../controllers/cartManager.js';
import { ProductManager } from '../controllers/productManager.js'; // Asegúrate de importar ProductManager

const cartRouter = express.Router();

const cartFilePath = 'src/models/cart.json';
const cartManager = new CartManager(cartFilePath);
const productManager = new ProductManager('src/models/product.json'); // Crear instancia de ProductManager

// Obtiene todos los carritos
cartRouter.get('/', async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.send(carts);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los carritos' });
  }
});

// Obtiene un carrito por su id
cartRouter.get('/:cid', async (req, res) => {
  const cid = req.params.cid;
  try {
    const cart = await cartManager.getCartById(cid);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
});

// Crea un nuevo carrito
cartRouter.post('/', async (req, res) => {
  try {
    const cart = await cartManager.createCart();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el carrito' });
  }
});

// Agrega un producto a un carrito
cartRouter.post('/:cid/product/:pid', async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  try {
    const product = await productManager.getProductById(pid);
    if (!product) {
      res.status(404).json({ error: 'Producto no encontrado' });
      return;
    }
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      res.status(404).json({ error: 'Carrito no encontrado' });
      return;
    }
    await cartManager.addProductToCart(cart.id, product);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto al carrito' });
  }
});

// Actualiza la cantidad de un producto en un carrito
cartRouter.put('/:cid/product/:pid', async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const quantity = req.body.quantity;
  try {
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      res.status(404).json({ error: 'Carrito no encontrado' });
      return;
    }
    await cartManager.updateProductQuantity(cart.id, pid, quantity);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito' });
  }
});

// Elimina un producto de un carrito
cartRouter.delete('/:cid/product/:pid', async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  try {
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      res.status(404).json({ error: 'Carrito no encontrado' });
      return;
    }
    await cartManager.removeProductFromCart(cart.id, pid);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
  }
});

export default cartRouter;
