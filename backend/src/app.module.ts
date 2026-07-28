import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { FarmModule } from './farm/farm.module';
import { QueryModule } from './common/query/query.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    QueryModule,
    AuthModule,
    AuthorizationModule,
    FarmModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
