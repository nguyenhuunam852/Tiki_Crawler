import { enumProvider } from "src/enum/provider.enum";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('books')
export class Books {

    @PrimaryGeneratedColumn('increment', { type: 'bigint', unsigned: true })
    public id: number;

    @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
    public book_id: string;


    @Column({ type: 'varchar', length: 255, nullable: false })
    public book_name: string;

    @Column({ type: 'enum', enum: enumProvider, nullable: false, default: enumProvider.tiki_light_novel })
    public providers: enumProvider;


    @Column({ type: 'varchar', length: 255, nullable: true })
    public extra_column: string;


    @CreateDateColumn({ name: 'created_at' })
    public created_at: Date;


    @UpdateDateColumn({ name: 'updated_at' })
    public updated_at: Date;


    @DeleteDateColumn({ name: 'deleted_at' })
    public deleted_at: Date;

}


