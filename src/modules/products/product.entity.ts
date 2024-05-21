import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

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

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt?: Date;

    @DeleteDateColumn()
    deletedAt?: Date;
}
