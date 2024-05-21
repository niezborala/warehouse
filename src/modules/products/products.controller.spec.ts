import { Test, TestingModule } from '@nestjs/testing';

import { ProductsController } from "./products.controller";
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';

describe('ProductsController', () => {
    let productsController: ProductsController;
    let productsService: ProductsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductsController],
            providers: [
                {
                    provide: ProductsService,
                    useValue: {
                        createProduct: jest.fn(),
                        getProducts: jest.fn(),
                        getProduct: jest.fn(),
                        updateProduct: jest.fn(),
                        deleteProduct: jest.fn(),
                    },
                },
            ]
        }).compile();

        productsController = module.get<ProductsController>(ProductsController);
        productsService = module.get<ProductsService>(ProductsService);
    });

    describe('createProduct', () => {
        it('should create a product', async () => {
            const createProductDto = { name: 'Test Product' } as CreateProductDto;
            const expectedProduct = { id: '1', name: 'Test Product' } as Product;

            jest.spyOn(productsService, 'createProduct').mockResolvedValue(expectedProduct);

            const result = await productsController.createProduct(createProductDto);

            expect(result).toEqual(expectedProduct);
        });
    });

    describe('getProducts', () => {
        it('should return all products', async () => {
            const expectedProducts = [
                { id: '1', name: 'Test Product 1' },
            ] as Product[];
            const expectedPagination = paginateHelper(expectedProducts);

            jest.spyOn(productsService, 'getProducts').mockResolvedValue(expectedPagination);

            const result = await productsController.getProducts();

            expect(result.items).toEqual(expectedProducts);
        });
    });

    describe('getProduct', () => {
        it('should return a product by id', async () => {
            const expectedProduct = { id: '1', name: 'Test Product' } as Product;

            jest.spyOn(productsService, 'getProduct').mockResolvedValue(expectedProduct);

            const result = await productsController.getProduct('1');

            expect(result).toEqual(expectedProduct);
        });

        it('should throw an error if product is not found', async () => {
            jest.spyOn(productsService, 'getProduct').mockResolvedValue(null);

            await expect(productsController.getProduct('1')).rejects.toThrowError();
        });
    });

    describe('updateProduct', () => {
        it('should update a product', async () => {
            const updateProductDto = { name: 'Test Product Updated' } as CreateProductDto;
            const expectedProduct = { id: '1', name: 'Test Product Updated' } as Product;

            jest.spyOn(productsService, 'getProduct').mockResolvedValue(expectedProduct);
            jest.spyOn(productsService, 'updateProduct').mockResolvedValue(expectedProduct);

            const result = await productsController.updateProduct('1', updateProductDto);

            expect(result).toEqual(expectedProduct);
        });

        it('should throw an error if product is not found', async () => {
            jest.spyOn(productsService, 'getProduct').mockResolvedValue(null);

            await expect(productsController.updateProduct('1', {} as CreateProductDto)).rejects.toThrowError();
        });
    });

    describe('deleteProduct', () => {
        it('should delete a product', async () => {
            const expectedProduct = { id: '1', name: 'Test Product' } as Product;

            jest.spyOn(productsService, 'getProduct').mockResolvedValue(expectedProduct);
            jest.spyOn(productsService, 'deleteProduct').mockResolvedValue();

            await productsController.deleteProduct('1');

            expect(productsService.deleteProduct).toHaveBeenCalledWith('1');
        });

        it('should throw an error if product is not found', async () => {
            jest.spyOn(productsService, 'getProduct').mockResolvedValue(null);

            await expect(productsController.deleteProduct('1')).rejects.toThrowError();
        });
    });
});


function paginateHelper(items) {
    return {
        items,
        meta: {
            totalItems: 1,
            itemCount: 1,
            itemsPerPage: 10,
            totalPages: 1,
            currentPage: 1
        },
        links: {
            first: "http://localhost:3000/api/v1/products?limit=10",
            previous: "",
            next: "",
            last: "http://localhost:3000/api/v1/products?page=1&limit=10"
        }
    };
}