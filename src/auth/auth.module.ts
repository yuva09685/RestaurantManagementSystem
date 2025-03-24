import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'your_secret_key', // Replace with a secure secret key
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, UsersService],
  controllers: [AuthController],
  exports:[AuthService]
})
export class AuthModule {}
