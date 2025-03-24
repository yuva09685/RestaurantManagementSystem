import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module'; // ✅ Circular dependency fix

@Module({
  imports: [forwardRef(() => AuthModule)], // ✅ Use forwardRef to prevent circular dependency
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
