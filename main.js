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
    products = [];
    productIdCounter = 1;
  
    constructor() {
      this.products = [];
      this.productIdCounter = 1;
    }
  
    addProduct(product) {
      if (this.products.find((p) => p.code === product.code)) {
        throw new Error("Product code already exists");
      }
  
      if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
        throw new Error("All fields are required");
      }
  
      // Asignar un id autoincrementable al producto
      const productWithId = {
        ...product,
        id: this.productIdCounter,
      };
      this.productIdCounter++;
  
      this.products.push(productWithId);
    }
  
    getProducts() {
      return this.products;
    }
  
    getProductById(id) {
      const product = this.products.find((p) => p.id === id);
  
      if (!product) {
        console.error("Product not found");
        throw new Error("Product not found");
      }
  
      return product;
    }
  }
  
  // Ejemplo de uso con prompts:
  
  const productManager = new ProductManager();
  
  while (true) {
    const title = prompt("Enter product title:");
    const description = prompt("Enter product description:");
    const price = parseFloat(prompt("Enter product price:"));
    const thumbnail = prompt("Enter product thumbnail URL:");
    const code = prompt("Enter product code:");
    const stock = parseInt(prompt("Enter product stock:"));
  
    try {
      const newProduct = new Product(title, description, price, thumbnail, code, stock);
      productManager.addProduct(newProduct);
      console.log("Product added successfully!");
    } catch (error) {
      console.error(error.message);
    }
  
    const continueAdding = confirm("Do you want to add another product?");
    if (!continueAdding) {
      break;
    }
  }
  
  console.log("All products:");
  console.log(productManager.getProducts());
  
  const searchById = parseInt(prompt("Enter product id to search:"));
  try {
    const product = productManager.getProductById(searchById);
    console.log("Product found:");
    console.log(product);
  } catch (error) {
    console.error(error.message);
  }
  