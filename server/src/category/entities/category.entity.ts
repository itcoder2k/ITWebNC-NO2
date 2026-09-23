import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
  } from 'typeorm';
  
  @Entity('categories')
  export class Category {
    @PrimaryGeneratedColumn({ name: 'category_id' })
    category_id: number;
  
    @Column({ type: 'varchar', length: 100 })
    name: string;
  
    @Column({ type: 'varchar', length: 100, unique: true })
    slug: string;
  
    @Column({ type: 'text', nullable: true })
    description: string;
  
    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    created_at: Date;
  }