import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Leave } from '../leave/leave.entity';
import { Permission } from '../permission/permission.entity';

export enum StaffStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('staff')
export class Staff {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  role: string;

  @Column({ nullable: true })
  department: string;

  @Column({ type: 'date', nullable: true })
  dateOfJoining: string;

  @Column({ type: 'enum', enum: StaffStatus, default: StaffStatus.ACTIVE })
  status: StaffStatus;

  @Column({ nullable: true })
  passwordHash: string;

  @Column({ default: 'staff' })
  userRole: string;

  @OneToMany(() => Leave, (leave) => leave.staff, { cascade: true })
  leaves: Leave[];

  @OneToMany(() => Permission, (permission) => permission.staff, {
    cascade: true,
  })
  permissions: Permission[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
