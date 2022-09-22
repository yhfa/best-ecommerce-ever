import { Response, Request, NextFunction } from 'express';

import { Methods } from '../models/interfaces';
import { ProductService } from '../services/product.service';
import Controller from '../models/controller';
import { checkAuth } from '../middlewares/check-auth';
import { HttpError } from './../models/errors';

class ProductController extends Controller {
  path = '/products';

  productService: ProductService;

  constructor() {
    super();
    this.productService = new ProductService();
  }

  handleGetProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log(this.productService);
      const products = await this.productService.getProducts();

      res.status(200).json({ status: 'success', data: { products } });
    } catch (error) {
      console.error('Error 💥', error);
      return next(new HttpError(404, error.message));
    }
  };

  handleCreateProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const product = req.body;

      const savedProduct = await this.productService.createProduct(
        product,
        req['userId']
      );

      res
        .status(201)
        .json({ status: 'success', data: { product: savedProduct } });
    } catch (error) {
      console.error('Error 💥', error);
      return next(new HttpError(403, error.message));
    }
  };

  handleUpdateProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const product = req.body;
      const productId = req.params.id;

      const updatedProduct = await this.productService.updateProduct(
        productId,
        product,
        req['userId']
      );

      res
        .status(201)
        .json({ status: 'success', data: { product: updatedProduct } });
    } catch (error) {
      console.error('Error 💥', error);
      return next(new HttpError(403, error.message));
    }
  };

  routes = [
    {
      path: '/', // Will become /products/
      method: Methods.GET,
      handler: this.handleGetProducts,
      localMiddleware: [checkAuth],
    },
    {
      path: '/', // Will become /products/
      method: Methods.POST,
      handler: this.handleCreateProduct,
      localMiddleware: [checkAuth],
    },
    {
      path: '/:id', // Will become /products/
      method: Methods.PUT,
      handler: this.handleUpdateProduct,
      localMiddleware: [checkAuth],
    },
  ];
}

export default ProductController;
