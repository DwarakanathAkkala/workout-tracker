import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { User } from './modules/users/entities/user.entity';

@Module({
  imports: [
    // 1. Setup Environment Variables
    ConfigModule.forRoot({ isGlobal: true }),

    // 2. Setup Database Connection
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
      type: 'mysql',
      host: config.get<string>('DB_HOST'),
      port: 3306,
      username: config.get<string>('DB_USERNAME'),
      password: config.get<string>('DB_PASSWORD'), // ConfigService handles the !! correctly
      database: config.get<string>('DB_NAME'),
      entities: [User],
      synchronize: true,
    }),
  }),

    // 3. Setup Feature Modules
    AuthModule,
  ],
})
export class AppModule {}