import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupBodyDto } from './dto/signup-body.dto';
import { SignupResponseDto } from './dto/signup-response.dto';
import { UsersService } from '../users/users.service';
import { UserRoles } from '@app/shared/enums';
import { JwtService } from '@nestjs/jwt';
import { UserDto, UserPayloadDto } from '@app/shared/dtos';
import * as bcrypt from 'bcrypt';
import { toUserDto } from '@app/shared/utils';
import { SigninResponseDto } from './dto/signin-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  public async signup(signupDto: SignupBodyDto): Promise<SignupResponseDto> {
    const foundAdmin = await this.usersService.findAllAdmins();

    if (foundAdmin.length) {
      throw new ForbiddenException();
    }

    const createdUser = await this.usersService.createUser({
      ...signupDto,
      role: UserRoles.ADMIN,
    });

    const authToken = await this.jwtService.signAsync({ ...createdUser });

    return { auth_token: authToken, user: createdUser };
  }

  public async signin(userDto: UserPayloadDto): Promise<SigninResponseDto> {
    const authToken = await this.jwtService.signAsync({ ...userDto });

    return { auth_token: authToken, user: userDto };
  }

  public async validateUser(email: string, password: string): Promise<UserDto> {
    const user = await this.usersService.getUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const pwMatch = await bcrypt.compare(password, user.password);

    if (!pwMatch) {
      throw new UnauthorizedException();
    }

    return toUserDto(user);
  }
}
