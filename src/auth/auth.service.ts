import { BadRequestException, Injectable, UnauthorizedException, } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service'; // Your Prisma service
import * as bcrypt from 'bcrypt';
import { Response, Request } from 'express';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

import { RegisterDto, LoginDto } from './dto';

@Injectable()
export class AuthService {
  // constructor
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  // methods: auth logic on the backend
  
  async refreshToken(req: Request, res: Response): Promise<string> {
    const refreshToken = req.cookies['refresh_token'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }
    // try to get the payload, payload contains some user detail of the authenticated user
    let payload;
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
    // id is unique, primary key
    const userExists = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!userExists) {
      throw new BadRequestException('User no longer exists');
    }
    // start creating
    const expiresIn = 15000; // seconds
    const expiration = Math.floor(Date.now() / 1000) + expiresIn;
    // accessToken life shorter than refreshToken
    const accessToken = this.jwtService.sign(
      { ...payload, exp: expiration },
      { // .env中的'ACCESS_TOKEN_SECRET'
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      },
    );
    // httpOnly: this token can't be accessed by javascript in the browser
    // 浏览器将禁止通过 JavaScript 访问和修改 Cookie，从而有效地防止一些常见的攻击，例如跨站脚本攻击（XSS）
    res.cookie('access_token', accessToken, { httpOnly: true });

    return accessToken;
  }

  // 
  private async issueTokens(user: User, response: Response) {
    const payload = { username: user.fullname, sub: user.id };

    const accessToken = this.jwtService.sign(
      { ...payload },
      {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: '150sec',
      },
    );

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: '7d',
    });

    response.cookie('access_token', accessToken, { httpOnly: true });
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
    });

    return { user };
  }

  // 验证用户
  async validateUser(loginDto: LoginDto): Promise<any> {
    // try to find user, email是unique的
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });
    // 登录的密码比较
    if (user && (await bcrypt.compare(loginDto.password, user.password))) {
      return user;
    }
    return null;
  }

  // 
  async register(registerDto: RegisterDto, response: Response) {
    console.log('registerDto!!!', registerDto);
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      // throw new Error('Email already in use'); // Provide a proper error response
      throw new BadRequestException({ email: 'Email already in use'});
    }
  
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    // create a new user 
    const user = await this.prisma.user.create({
      data: {
        fullname: registerDto.fullname,
        password: hashedPassword,
        email: registerDto.email,
      },
    });
    console.log('user!!!', user);
    return this.issueTokens(user, response); // Issue tokens on registration
  }

  async login(loginDto: LoginDto, response: Response) {
    const user = await this.validateUser(loginDto);

    if (!user) {
      // throw new Error('Invalid credentials'); // Provide a proper error response
      throw new BadRequestException({invalidCredentials: 'Invalid credentials'});
    }
    
    return this.issueTokens(user, response); // Issue tokens on login
  }

  async logout(response: Response) {
    response.clearCookie('access_token');
    response.clearCookie('refresh_token');
    return 'Successfully logged out';
  }
}
