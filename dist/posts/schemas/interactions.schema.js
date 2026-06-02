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
exports.SaveSchema = exports.Save = exports.RepostSchema = exports.Repost = exports.LikeSchema = exports.Like = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Like = class Like {
};
exports.Like = Like;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Like.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Post', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Like.prototype, "postId", void 0);
exports.Like = Like = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Like);
exports.LikeSchema = mongoose_1.SchemaFactory.createForClass(Like);
exports.LikeSchema.index({ userId: 1, postId: 1 }, { unique: true });
let Repost = class Repost {
};
exports.Repost = Repost;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Repost.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Post', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Repost.prototype, "postId", void 0);
exports.Repost = Repost = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Repost);
exports.RepostSchema = mongoose_1.SchemaFactory.createForClass(Repost);
exports.RepostSchema.index({ userId: 1, postId: 1 }, { unique: true });
let Save = class Save {
};
exports.Save = Save;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Save.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Post', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Save.prototype, "postId", void 0);
exports.Save = Save = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Save);
exports.SaveSchema = mongoose_1.SchemaFactory.createForClass(Save);
exports.SaveSchema.index({ userId: 1, postId: 1 }, { unique: true });
//# sourceMappingURL=interactions.schema.js.map