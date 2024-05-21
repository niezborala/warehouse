import { In, Repository } from "typeorm";
import { Product } from "./product.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateProductDto } from "./dto/create-product.dto";
import { IPaginationOptions, Pagination, paginate } from "nestjs-typeorm-paginate";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>
    ) { }

    async createProduct(createProductDto: CreateProductDto): Promise<Product> {
        return this.productRepository.save(createProductDto);
    }

    async getProducts(options: IPaginationOptions): Promise<Pagination<Product>> {
        const queryBuilder = this.productRepository.createQueryBuilder('p');

        queryBuilder.orderBy('p.name', 'DESC');

        return paginate<Product>(queryBuilder, options);
    }

    async getProduct(productId: string): Promise<Product> {
        return this.productRepository.findOneBy({
            id: productId
        });
    }

    async getProductsByIds(productIds: string[]): Promise<Product[]> {
        return this.productRepository.find({
            where: {
                id: In(productIds)
            }
        });
    }

    async updateProduct(productId: string, updateProductDto: UpdateProductDto): Promise<Product> {
        await this.productRepository.update({
            id: productId
        }, updateProductDto);

        return this.productRepository.findOneBy({
            id: productId
        });
    }

    async updateProducts(products: Product[]): Promise<Product[]> {
        await this.productRepository.save(products);

        return this.productRepository.find({
            where: {
                id: In(products.map(product => product.id))
            }
        });
    }

    async deleteProduct(productId: string): Promise<void> {
        this.productRepository.delete({
            id: productId
        });
    }
}
