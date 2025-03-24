import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TablesModule } from './tables/tables.module';
import { JwtConfigModule } from './common/roles/jwt.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    TablesModule,
    JwtConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
