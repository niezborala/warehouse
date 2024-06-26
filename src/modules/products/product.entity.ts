import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ShipmentItem } from '../shipments/shipment-item.entity';

@Entity()
export class Product {
    constructor(partial?: Partial<Product>) {
        Object.assign(this, partial);
    }

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        nullable: false
    })
    name: string;

    @Column({
        nullable: false,
        default: 0
    })
    price: number;

    @Column({
        nullable: false,
        default: 0
    })
    quantity: number;

    @OneToMany(() => ShipmentItem, item => item.product)
    shipmentItems: ShipmentItem[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}
