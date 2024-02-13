import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtSecret } from 'src/utils/constants';

// ExtractJwt.fromAuthHeaderAsBearerToken(),
// JwtStrategy.extractJWT,
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: jwtSecret,
    });
  }

  // private static extractJWT(req: Request): string | null {
  //   if (req.cookies && 'access_token' in req.cookies) {
  //     return req.cookies.access_token;
  //   }
  //   return null;
  // }
  async validate(payload: { sub: string; email: string; role: string }) {
    return payload;
  }
}
