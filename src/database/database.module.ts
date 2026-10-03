import { Module } from "@nestjs/common";
import { databaseProvider } from "./database.provider";

@Module({
    providers: [databaseProvider],
    exports: ["PG_POOL"]
})
export class DatabaseModule{}