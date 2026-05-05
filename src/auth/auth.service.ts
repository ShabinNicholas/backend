import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StaffService } from '../staff/staff.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly staffService: StaffService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const staff = await this.staffService.findByEmail(dto.email);
    if (!staff || !staff.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const valid = await bcrypt.compare(dto.password, staff.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const payload = {
      sub: staff.id,
      email: staff.email,
      userRole: staff.userRole,
      fullName: staff.fullName,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: staff.id,
        email: staff.email,
        fullName: staff.fullName,
        userRole: staff.userRole,
        department: staff.department,
        role: staff.role,
      },
    };
  }

  async seedAdmin() {
    const existing = await this.staffService.findByEmail('admin@foxtech.com');
    if (!existing) {
      await this.staffService.create({
        fullName: 'Admin User',
        email: 'admin@foxtech.com',
        password: 'admin123',
        userRole: 'admin',
        status: undefined,
      });
      console.log('✅ Admin seeded: admin@foxtech.com / admin123');
    }
  }
}
