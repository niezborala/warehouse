import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinTable,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ShipmentsStatus } from './shipments.interfaces';
import { ShipmentItem } from './shipment-item.entity';

@Entity()
export class Shipment {
    constructor(partial?: Partial<Shipment>) {
        Object.assign(this, partial);
    }

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        nullable: false
    })
    companyName: string;

    @Column({
        nullable: false
    })
    scheduledDate: Date;

    @Column({
        nullable: false,
        default: ShipmentsStatus.CREATED
    })
    status: ShipmentsStatus;

    @OneToMany(() => ShipmentItem, item => item.shipment)
    items: ShipmentItem[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}