import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy{
    private static pool: Pool;

    constructor() {
        if(!PrismaService.pool) {
            PrismaService.pool = new Pool({
                connectionString: process.env.DATABASE_URL,
            });
        }

        const adapter = new PrismaPg(PrismaService.pool);

        super({ adapter });
    }

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
        await PrismaService.pool.end();
    }
}