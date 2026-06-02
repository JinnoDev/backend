"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const posts_controller_1 = require("./posts.controller");
const posts_service_1 = require("./posts.service");
const post_schema_1 = require("./schemas/post.schema");
const interactions_schema_1 = require("./schemas/interactions.schema");
const notifications_module_1 = require("../notifications/notifications.module");
const follow_schema_1 = require("../users/schemas/follow.schema");
const gridfs_module_1 = require("../common/gridfs/gridfs.module");
let PostsModule = class PostsModule {
};
exports.PostsModule = PostsModule;
exports.PostsModule = PostsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: post_schema_1.Post.name, schema: post_schema_1.PostSchema },
                { name: interactions_schema_1.Like.name, schema: interactions_schema_1.LikeSchema },
                { name: interactions_schema_1.Repost.name, schema: interactions_schema_1.RepostSchema },
                { name: interactions_schema_1.Save.name, schema: interactions_schema_1.SaveSchema },
                { name: follow_schema_1.Follow.name, schema: follow_schema_1.FollowSchema },
            ]),
            notifications_module_1.NotificationsModule,
            gridfs_module_1.GridFsModule,
        ],
        controllers: [posts_controller_1.PostsController],
        providers: [posts_service_1.PostsService],
        exports: [posts_service_1.PostsService, mongoose_1.MongooseModule],
    })
], PostsModule);
//# sourceMappingURL=posts.module.js.map