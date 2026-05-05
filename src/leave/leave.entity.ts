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

export enum LeaveType {
  SICK = 'sick',
  CASUAL = 'casual',
  PAID = 'paid',
  UNPAID = 'unpaid',
}

export enum LeaveStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum HalfDayPeriod {
  FIRST_HALF = 'first_half',
  SECOND_HALF = 'second_half',
}

@Entity('leaves')
export class Leave {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  staffId: string;

  @ManyToOne(() => Staff, (staff) => staff.leaves, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'staffId' })
  staff: Staff;

  @Column({ type: 'enum', enum: LeaveType })
  leaveType: LeaveType;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({ type: 'boolean', default: false })
  isHalfDay: boolean;

  @Column({ type: 'enum', enum: HalfDayPeriod, nullable: true })
  halfDayPeriod: HalfDayPeriod;

  @Column({ type: 'enum', enum: LeaveStatus, default: LeaveStatus.PENDING })
  status: LeaveStatus;

  @CreateDateColumn()
  createdAt: Date;
}
