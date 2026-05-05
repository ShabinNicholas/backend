import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Staff } from '../staff/staff.entity';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  staffId: string;

  @ManyToOne(() => Staff, (staff) => staff.permissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'staffId' })
  staff: Staff;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'decimal', precision: 4, scale: 2 })
  hours: number;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @CreateDateColumn()
  createdAt: Date;
}
