import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { User, UserDocument } from '../users/schemas/user.schema';

const DEFAULT_PASSWORD = '12345678';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.userModel.findOne({ email: dto.email });
    if (exists) throw new ConflictException('El email ya está registrado');
    const usernameExists = await this.userModel.findOne({ username: dto.username });
    if (usernameExists) throw new ConflictException('El username ya está en uso');
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userModel.create({
      email: dto.email, username: dto.username,
      password: hashedPassword, name: dto.username,
    });
    return this.generateTokens(user);
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) throw new UnauthorizedException('Credenciales inválidas');
    const passwordOk = await bcrypt.compare(dto.password, user.password);
    if (!passwordOk) throw new UnauthorizedException('Credenciales inválidas');
    return this.generateTokens(user);
  }

  async resetPassword(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('No existe una cuenta con ese email');
    const hashed = await bcrypt.hash(DEFAULT_PASSWORD, 10);
    await this.userModel.findByIdAndUpdate(user._id, { password: hashed });
    return { success: true, message: `Contraseña restablecida a "${DEFAULT_PASSWORD}". Cámbiala pronto.` };
  }

  private generateTokens(user: UserDocument) {
    const payload = { sub: user._id.toString(), email: user.email, username: user.username };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '30d' }),
      user: { id: user._id, email: user.email, username: user.username },
    };
  }
}
