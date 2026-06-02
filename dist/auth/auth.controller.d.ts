import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
declare class ResetPasswordDto {
    email: string;
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            email: string;
            username: string;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            email: string;
            username: string;
        };
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    logout(user: any): {
        success: boolean;
        message: string;
    };
}
export {};
