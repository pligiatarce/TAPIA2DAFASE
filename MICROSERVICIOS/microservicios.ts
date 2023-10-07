import express, { Request, Response } from 'express';

const app = express();
app.use(express.json());

class Producto {
  constructor(public id: number, public nombre: string, public precio: number, public stock: number) {}
}

class ProductService {
  private productos: Producto[] = [];

  agregarProducto(nombre: string, precio: number, stock: number): Producto {
    const id = this.productos.length + 1;
    const producto = new Producto(id, nombre, precio, stock);
    this.productos.push(producto);
    return producto;
  }

  obtenerProductos(): Producto[] {
    return this.productos;
  }

  obtenerProductoPorId(id: number): Producto | undefined {
    return this.productos.find((producto) => producto.id === id);
  }
}

const productService = new ProductService();

app.get('/productos', (req: Request, res: Response) => {
  const productos = productService.obtenerProductos();
  res.json(productos);
});

app.get('/productos/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const producto = productService.obtenerProductoPorId(id);
  if (producto) {
    res.json(producto);
  } else {
    res.status(404).json({ mensaje: 'Producto no encontrado' });
  }
});

app.post('/productos', (req: Request, res: Response) => {
  const { nombre, precio, stock } = req.body;
  if (!nombre || isNaN(precio) || isNaN(stock)) {
    res.status(400).json({ mensaje: 'Datos de producto no válidos' });
  } else {
    const producto = productService.agregarProducto(nombre, precio, stock);
    res.status(201).json(producto);
  }
});

app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});