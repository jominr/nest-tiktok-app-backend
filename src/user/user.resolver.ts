// user.resolver.ts
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BadRequestException, UseFilters, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { RegisterDto, LoginDto } from '../auth/dto';
import { Response, Request } from 'express';
import { LoginResponse, RegisterResponse } from 'src/auth/types';
import { UserService } from './user.service';
import { GraphQLErrorFilter } from 'src/filters/custom-exception.filter';

@Resolver('User')
export class UserResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseFilters(GraphQLErrorFilter)
  @Mutation(() => RegisterResponse)
  async register(
    @Args('registerInput') registerDto: RegisterDto,
    @Context() context: { res: Response },
  ): Promise<RegisterResponse> {
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException({
        confirmPassword: 'Password and confirm password are not the same.',
      });
    }
    try {
      const { user } = await this.authService.register(
        registerDto,
        context.res,
      );
      console.log('user!', user);
      return { user };
    } catch (error) {
      // Handle the error, for instance if it's a validation error or some other type
      return {
        error: {
          message: error.message,
          // code: 'SOME_ERROR_CODE' // If you have error codes
        },
      };
    }
  }

  @Mutation(() => LoginResponse) // Adjust this return type as needed
  async login(
    @Args('loginInput') loginDto: LoginDto,
    @Context() context: { res: Response },
  ) {
    return this.authService.login(loginDto, context.res);
  }

  @Mutation(() => String)
  async logout(@Context() context: { res: Response }) {
    return this.authService.logout(context.res);
  }

  @Mutation(() => String)
  async refreshToken(@Context() context: { req: Request; res: Response }) {
    try {
      return this.authService.refreshToken(context.req, context.res);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Query(() => String)
  async hello() {
    return 'hello world';
  }

}
