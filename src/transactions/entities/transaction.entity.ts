import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
  type ValueTransformer,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { User } from '../../users/entities/user.entity';

const numericTransformer: ValueTransformer = {
  to(value: number): number {
    return value;
  },
  from(value: string): number {
    return Number(value);
  },
};

const dateTransformer: ValueTransformer = {
  to(value: string): string {
    return value;
  },
  from(value: Date | string): string {
    if (typeof value === 'string') {
      return value.slice(0, 10);
    }

    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },
};

@Entity('transactions')
@Check('chk_transactions_amount', '"amount" > 0')
export class Transaction {
  @PrimaryColumn({ type: 'uuid', default: () => 'gen_random_uuid()' })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({
    type: 'numeric',
    precision: 14,
    scale: 2,
    transformer: numericTransformer,
  })
  amount: number;

  @Column({
    name: 'transaction_date',
    type: 'date',
    default: () => 'CURRENT_DATE',
    transformer: dateTransformer,
  })
  transactionDate: string;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ name: 'category_id', type: 'uuid' })
  categoryId: string;

  @ManyToOne(() => Category, (category) => category.transactions, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.transactions, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
