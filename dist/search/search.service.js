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
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../users/schemas/user.schema");
const post_schema_1 = require("../posts/schemas/post.schema");
let SearchService = class SearchService {
    constructor(userModel, postModel) {
        this.userModel = userModel;
        this.postModel = postModel;
    }
    async search(query, page, limit) {
        const skip = (page - 1) * limit;
        const regex = new RegExp(query, 'i');
        const [users, posts] = await Promise.all([
            this.userModel.find({
                $or: [{ username: regex }, { name: regex }],
            }).select('-password -email').limit(limit),
            this.postModel.find({ caption: regex }).limit(limit),
        ]);
        const allResults = [
            ...users.map((u) => ({ type: 'user', ...u.toObject() })),
            ...posts.map((p) => ({ type: 'post', ...p.toObject() })),
        ];
        return {
            query,
            data: allResults.slice(skip, skip + limit),
            page, limit,
            total: allResults.length,
        };
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(post_schema_1.Post.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], SearchService);
//# sourceMappingURL=search.service.js.map