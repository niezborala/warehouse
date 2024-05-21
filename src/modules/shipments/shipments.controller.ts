import { Body, Controller, DefaultValuePipe, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { ShipmentsService } from "./shipments.service";
import { CreateShipmentDto } from "./dto/create-shipment.dto";
import { ApiQuery } from "@nestjs/swagger";
import { Pagination } from "nestjs-typeorm-paginate";
import { Shipment } from "./shipment.entity";
import { UpdateShipmentDto } from "./dto/update-shipment.dto";

@Controller('shipments')
export class ShipmentsController {
    constructor(private readonly shipmentsService: ShipmentsService) { }

    @Post()
    async createShipment(@Body() createShipmentDto: CreateShipmentDto) {
        return this.shipmentsService.createShipment(createShipmentDto);
    }

    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @Get()
    getShipments(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    ): Promise<Pagination<Shipment>> {
        limit = limit > 100 ? 100 : limit;

        return this.shipmentsService.getShipments({
            page,
            limit,
            route: `${process.env.BASE_URL}/shipments`
        });
    }

    @Get(':shipmentId')
    async getShipment(@Param('shipmentId') shipmentId: string) {
        const shipment = await this.shipmentsService.getShipment(shipmentId);

        if (!shipment) {
            throw new NotFoundException('Shipment not found');
        }

        return shipment;
    }

    @Patch(':shipmentId')
    async updateShipment(
        @Param('shipmentId') shipmentId: string,
        @Body() updateShipmentDto: UpdateShipmentDto
    ) {
        const shipment = await this.shipmentsService.getShipment(shipmentId);

        if (!shipment) {
            throw new NotFoundException('Shipment not found');
        }

        return this.shipmentsService.updateShipment(shipmentId, updateShipmentDto);
    }

    @Delete(':shipmentId')
    async deleteShipment(@Param('shipmentId') shipmentId: string) {
        const shipment = await this.shipmentsService.getShipment(shipmentId);

        if (!shipment) {
            throw new NotFoundException('Shipment not found');
        }

        return this.shipmentsService.deleteShipment(shipmentId);
    }
}
