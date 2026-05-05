import { JwtService } from '@nestjs/jwt';
import { StaffService } from '../staff/staff.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly staffService;
    private readonly jwtService;
    constructor(staffService: StaffService, jwtService: JwtService);
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            fullName: string;
            userRole: string;
            department: string;
            role: string;
        };
    }>;
    seedAdmin(): Promise<void>;
}
