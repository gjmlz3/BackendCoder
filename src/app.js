import express from 'express';
import { CartManager } from './controllers/cartManager.js';
import { ProductManager } from './controllers/productManager.js';
import cartRouter from './routes/cartRoutes.js';
import productRouter from './routes/productRoutes.js'

const app = express();
const PORT = 4000;

app.use(express.urlencoded({ extended: true }));

app.use('/api/carts', cartRouter);
app.use('/api/products', productRouter);

const productFilePath = 'src/models/product.json';
const cartFilePath = 'src/models/cart.json';

const productManager = new ProductManager(productFilePath);
const cartManager = new CartManager(cartFilePath);

app.get('/', (req, res) => {
  res.send('¡Bienvenido a la página de inicio!');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
