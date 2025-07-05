import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvParams } from '@app/shared/enums';
import { UserPayloadDto } from '@app/shared/dtos';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.getOrThrow<string>(EnvParams.JWT_SECRET),
      ignoreExpiration: false,
    });
  }

  public validate(payload: UserPayloadDto): UserPayloadDto {
    return payload;
  }
}
