import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Product } from '../products/product.entity';
import { Shipment } from './shipment.entity';

@Entity()
export class ShipmentItem {
    constructor(partial?: Partial<ShipmentItem>) {
        Object.assign(this, partial);
    }

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        nullable: false
    })
    quantity: number; 
    
    @ManyToOne(() => Product, product => product.shipmentItems)
    product: Product;

    @ManyToOne(() => Shipment, shipment => shipment.items)
    shipment: Shipment;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}