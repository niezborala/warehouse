import { Body, Controller, DefaultValuePipe, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { ApiQuery } from "@nestjs/swagger";
import { Pagination } from "nestjs-typeorm-paginate";
import { Product } from "./product.entity";
import { UpdateProductDto } from "./dto/update-product.dto";

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    async createProduct(@Body() createProductDto: CreateProductDto) {
        return this.productsService.createProduct(createProductDto);
    }

    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @Get()
    getProducts(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    ): Promise<Pagination<Product>> {
        limit = limit > 100 ? 100 : limit;

        return this.productsService.getProducts({
            page,
            limit,
            route: `${process.env.BASE_URL}/products`
        });
    }

    @Get(':productId')
    async getProduct(@Param('productId') productId: string) {
        const product = await this.productsService.getProduct(productId);

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return product;
    }

    @Patch(':productId')
    async updateProduct(
        @Param('productId') productId: string,
        @Body() updateProductDto: UpdateProductDto
    ) {
        const product = await this.productsService.getProduct(productId);

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return this.productsService.updateProduct(productId, updateProductDto);
    }

    @Delete(':productId')
    async deleteProduct(@Param('productId') productId: string) {
        const product = await this.productsService.getProduct(productId);

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return this.productsService.deleteProduct(productId);
    }
}
