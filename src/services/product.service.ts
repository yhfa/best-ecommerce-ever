import { Repository } from 'typeorm';

import { Product } from '../entity/Product';
import { User } from '../entity/User';
import { IProduct } from '../models/interfaces';

import productRepository from '../repositories/product.repository';
import userRepository from '../repositories/user.repository';

export class ProductService {
  productRepository: Repository<Product>;
  userRepository: Repository<User>;
  constructor() {
    this.productRepository = productRepository;
    this.userRepository = userRepository;
  }

  async getProducts() {
    const products = await this.productRepository.find({
      relations: {
        user: true,
      },
    });

    products.forEach(product => delete product.user.password);

    return products;
  }

  async createProduct(productData: IProduct, userId: string) {
    const newProduct = new Product();
    newProduct.image = productData.image;
    newProduct.price = productData.price;
    newProduct.title = productData.title;

    const user = await this.userRepository.findOneBy({ id: userId });

    newProduct.user = user;

    const savedProduct = await this.productRepository.save(newProduct);

    delete savedProduct.user.password;

    return savedProduct;
  }

  async updateProduct(
    productId: string,
    productData: IProduct,
    userId: string
  ) {
    const savedProduct = await this.productRepository.findOne({
      where: [
        {
          id: productId,
        },
      ],
      relations: ['user'],
    });

    const user = await this.userRepository.findOneBy({ id: userId });

    if (user.id != savedProduct.user.id) {
      throw new Error('You do not have permission to perform this action.');
    }

    savedProduct.image = productData.image;
    savedProduct.price = productData.price;
    savedProduct.title = productData.title;

    const updatedProduct = await this.productRepository.save(savedProduct);

    delete updatedProduct.user.password;

    return updatedProduct;
  }
}
