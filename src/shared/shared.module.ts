import { Module } from "@nestjs/common";
import { AuthGuard } from "./guards/auth.guards";

@Module({
    exports: [AuthGuard],
    providers: [AuthGuard]
})
export class SharedModule {}