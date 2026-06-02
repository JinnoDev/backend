"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
const user_schema_1 = require("../users/schemas/user.schema");
const DEFAULT_PASSWORD = '12345678';
let AuthService = class AuthService {
    constructor(userModel, jwtService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
    }
    async register(dto) {
        const exists = await this.userModel.findOne({ email: dto.email });
        if (exists)
            throw new common_1.ConflictException('El email ya está registrado');
        const usernameExists = await this.userModel.findOne({ username: dto.username });
        if (usernameExists)
            throw new common_1.ConflictException('El username ya está en uso');
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.userModel.create({
            email: dto.email, username: dto.username,
            password: hashedPassword, name: dto.username,
        });
        return this.generateTokens(user);
    }
    async login(dto) {
        const user = await this.userModel.findOne({ email: dto.email });
        if (!user)
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        const passwordOk = await bcrypt.compare(dto.password, user.password);
        if (!passwordOk)
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        return this.generateTokens(user);
    }
    async resetPassword(email) {
        const user = await this.userModel.findOne({ email });
        if (!user)
            throw new common_1.NotFoundException('No existe una cuenta con ese email');
        const hashed = await bcrypt.hash(DEFAULT_PASSWORD, 10);
        await this.userModel.findByIdAndUpdate(user._id, { password: hashed });
        return { success: true, message: `Contraseña restablecida a "${DEFAULT_PASSWORD}". Cámbiala pronto.` };
    }
    generateTokens(user) {
        const payload = { sub: user._id.toString(), email: user.email, username: user.username };
        return {
            accessToken: this.jwtService.sign(payload),
            refreshToken: this.jwtService.sign(payload, { expiresIn: '30d' }),
            user: { id: user._id, email: user.email, username: user.username },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map