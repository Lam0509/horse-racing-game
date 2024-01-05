import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CacheService } from 'src/providers/cache/cache.service';
import { TokenService } from 'src/providers/token/token.service';
import { UserService } from '../user/user.service';
import { UserDocument } from '../user/user.schema';
import { SocketService } from 'src/providers/socket/socket.service';

@Injectable()
export class HorseraceGuard implements CanActivate {
  private readonly logger = new Logger(HorseraceGuard.name);
  constructor(
    private readonly tokenService: TokenService,
    private readonly cacheService: CacheService,
    private readonly userService: UserService,
    private readonly socketService: SocketService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const token: string = client.handshake.query.token as string;
    if (!token) {
      this.logger.log('No token provided!');
      return false;
    }
    // Verify token
    const data = await this.tokenService.verifyJwt(token);

    if (!data) {
      this.logger.log('Can not verify token!');
      return false;
    }

    const realToken = await this.cacheService.get(data.address);

    if (token !== realToken) {
      this.logger.log('Wrong token!');
      return false;
    }

    let user: UserDocument = this.cacheService.getUser(data.address);

    if (!user) {
      user = await this.userService.findByAddress(data.address);
      if (!user) {
        this.logger.log('No user found!');
        return false;
      }
      // Save to cache
      this.cacheService.addUser(user.toObject());
    }

    this.logger.log(`Address ${user.address} connected!`);

    client['address'] = user.address;
    this.socketService.handleConnection(client);
    return true;
  }
}
