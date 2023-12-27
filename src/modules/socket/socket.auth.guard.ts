import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class SocketAuthGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const socket = context.switchToWs().getClient();
        console.log('socket guard')
        console.log(socket['user']);
                
        if (!socket['user']) return false;
        return true;
    }
}