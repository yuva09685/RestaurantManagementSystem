import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Global() // ✅ This makes it available everywhere without re-importing
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'yuvi',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  exports: [JwtModule], // ✅ Export it so it's available globally
})
export class JwtConfigModule {}
