import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";

import { Observable } from "rxjs";
import jwt from "jsonwebtoken"

@Injectable()
export class AuthGuard implements CanActivate{
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest()
        const authHeader = request.headers.authorization
        if (!authHeader) {
            throw new UnauthorizedException('No authorization header');
        }
        const token = authHeader.split(" ")[1]
        if(!token) throw new UnauthorizedException("no token")
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET!);

            request.user = payload;

            return true;

        } catch {
            throw new UnauthorizedException('Invalid token');
        }
    }
}