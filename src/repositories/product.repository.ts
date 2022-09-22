import { AppDataSource } from '../data-source';
import { Product } from '../entity/Product';

export default AppDataSource.getRepository(Product);
