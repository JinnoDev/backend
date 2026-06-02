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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPostsQueryDto = exports.PostFilter = exports.UpdatePostDto = exports.CreatePostDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreatePostDto {
}
exports.CreatePostDto = CreatePostDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Mi primera publicación 🌅' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2200),
    __metadata("design:type", String)
], CreatePostDto.prototype, "caption", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreatePostDto.prototype, "media", void 0);
class UpdatePostDto {
}
exports.UpdatePostDto = UpdatePostDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Caption actualizado ✏️' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(2200),
    __metadata("design:type", String)
], UpdatePostDto.prototype, "caption", void 0);
var PostFilter;
(function (PostFilter) {
    PostFilter["FEED"] = "feed";
    PostFilter["RECOMMENDED"] = "recommended";
})(PostFilter || (exports.PostFilter = PostFilter = {}));
class GetPostsQueryDto {
}
exports.GetPostsQueryDto = GetPostsQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(PostFilter),
    __metadata("design:type", String)
], GetPostsQueryDto.prototype, "filter", void 0);
//# sourceMappingURL=posts.dto.js.map