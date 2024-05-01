import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [AuthService, JwtService, PrismaService, ConfigService],
  exports: [JwtService, AuthService],
})
export class AuthModule {}
