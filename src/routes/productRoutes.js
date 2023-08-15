import express from 'express';
import { ProductManager } from '../controllers/productManager.js';

const productRouter = express.Router();
const productFilePath = 'src/models/product.json';
const productManager = new ProductManager(productFilePath);

// Obtiene todos los productos
productRouter.get('/', async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : 0;
  
  try {
    const products = await productManager.getProducts(limit);
    res.send(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

// Obtiene un producto por su id
productRouter.get('/:pid', async (req, res) => {
  const pid = req.params.pid;
  try {
    const product = await productManager.getProductById(pid);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

// Crea un nuevo producto
productRouter.post('/', async (req, res) => {
  const productData = req.body;
  try {
    await productManager.addProduct(productData);
    res.status(201).json({ message: 'Producto agregado satisfactoriamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto' });
  }
});

// Actualiza un producto
productRouter.put('/:pid', async (req, res) => {
  const pid = req.params.pid;
  const updatedData = req.body;
  try {
    await productManager.updateProduct(pid, updatedData);
    res.status(200).json({ message: 'Producto actualizado satisfactoriamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

// Elimina un producto
productRouter.delete('/:pid', async (req, res) => {
  const pid = req.params.pid;
  try {
    await productManager.deleteProduct(pid);
    res.status(200).json({ message: 'Producto eliminado satisfactoriamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

export default productRouter;
