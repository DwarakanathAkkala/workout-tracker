import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Logic: config.get<string> tells TS it's a string. 
      // The '!' tells TS 'Trust me, I checked the .env file, this is not undefined.'
      secretOrKey: config.get<string>('JWT_SECRET')!, 
    });
  }

  async validate(payload: any) {
    // Logic: This payload is the decoded token.
    // We return this so NestJS can attach it to the request (req.user)
    return { userId: payload.sub, email: payload.email };
  }
}