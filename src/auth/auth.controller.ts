import { Controller, Post, Get, Param, Body, Res, Req, UseGuards, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto } from "./auth.dto";
import type { Response, Request } from "express"
import { AuthGuard } from "../shared/guards/auth.guards";


@Controller('auth')
export class AuthController{
    constructor(private readonly authService: AuthService){}
    
    @Post("register")
    async register(@Body() data: RegisterDto, @Res({ passthrough: true }) res: Response){
        const {user, access, refresh} = await this.authService.register(data.name, data.password, data.email)

        res.cookie("refreshToken", refresh, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return {status: "ok", user: user, access: access}
    }

    @Post("login")
    async login(@Body() data: LoginDto, @Res({ passthrough: true }) res: Response){
        const {user, access, refresh} = await this.authService.login(data.name, data.password)

        res.cookie("refreshToken", refresh, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return {status: "ok", user: user, access: access}
    }

    @Get("me")
    @UseGuards(AuthGuard)
    async me(@Req() req: Request){
        const user = await this.authService.me(req.user.id)

        return {status: "ok", user: user}
    }

    @Get("refresh")
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response){
        const oldRefresh = req.cookies.refreshToken

        if(!oldRefresh) throw new UnauthorizedException("no refresh token")

        const { access, refresh } = await this.authService.refresh(oldRefresh)

        res.cookie("refreshToken", refresh, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        return {status: "ok", access: access}
    }

    @Post("logout")
    async logout(@Req() req: Request){
        const refresh = req.cookies.refreshToken

        await this.authService.logOut(refresh)

        return {status: "ok"}
    }
}