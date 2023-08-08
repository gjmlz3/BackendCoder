import express from 'express';
import { ProductManager } from './productManager.js'; // Cambia la ruta según la ubicación de tu archivo ProductManager

const app = express();
const PORT = 4000;

app.use(express.urlencoded({ extended: true }))

const productFilePath = 'src/product.txt';
const productManager = new ProductManager(productFilePath);

// Ruta de inicio
app.get('/', (req, res) => {
  res.send('¡Bienvenido a la página de inicio!');
});

// Ruta para obtener productos con posible límite
app.get('/products', async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : 0;

  const products = await productManager.getProducts(limit);
  res.json(products);
});

// Ruta para obtener un producto por su id
app.get('/products/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  const product = await productManager.getProductById(id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
