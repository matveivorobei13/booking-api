import { Module } from "@nestjs/common";

import { authRepository } from "./auth.repository";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { DatabaseModule } from "../database/database.module";
import { SharedModule } from "../shared/shared.module";
import { UserModule } from "../users/user.module";

@Module({
    imports: [DatabaseModule, SharedModule, UserModule],
    controllers: [AuthController],
    providers: [AuthService, authRepository],
    
})
export class AuthModule{}