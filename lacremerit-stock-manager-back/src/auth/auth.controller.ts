import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Request, Response, CookieOptions } from 'express';

const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax', 
  maxAge: 7 * 24 * 60 * 60 * 1000,
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  path: '/',
};

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() credentials: CreateAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(
      credentials.email,
      credentials.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const tokens = await this.authService.login(user);

    res.cookie('refreshToken', tokens.refresh_token, COOKIE_OPTIONS);

    return { access_token: tokens.access_token, user };
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token');
    }
    const tokens = await this.authService.refreshToken(refreshToken);

    // Réactualisation du cookie refreshToken avec une durée de 7 jours
    res.cookie('refreshToken', tokens.refresh_token, COOKIE_OPTIONS);

    const user = await this.authService.getUserFromToken(tokens.access_token);

    return { access_token: tokens.access_token, user };
  }
}
