import express from 'express';
import { ProductManager } from '../controllers/productManager.js';

const productRouter = express.Router();
const productFilePath = './models/product.txt';
const productManager = new ProductManager(productFilePath);

productRouter.get('/', async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : 0;
  
  try {
    const products = await productManager.getProducts(limit);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

productRouter.get('/:pid', async (req, res) => {
  const pid = parseInt(req.params.pid, 10);
  
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

productRouter.post('/', async (req, res) => {
  const productData = req.body;
  
  try {
    await productManager.addProduct(productData);
    res.status(201).json({ message: 'Producto agregado satisfactoriamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto' });
  }
});

productRouter.put('/:pid', async (req, res) => {
  const pid = parseInt(req.params.pid, 10);
  const updatedData = req.body;
  
  try {
    await productManager.updateProduct(pid, updatedData);
    res.status(200).json({ message: 'Producto actualizado satisfactoriamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

productRouter.delete('/:pid', async (req, res) => {
  const pid = parseInt(req.params.pid, 10);
  
  try {
    await productManager.deleteProduct(pid);
    res.status(200).json({ message: 'Producto eliminado satisfactoriamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

export default productRouter;
