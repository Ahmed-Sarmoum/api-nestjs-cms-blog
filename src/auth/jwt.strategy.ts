import  { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";

export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(@InjectRepository(User) private readonly repo: Repository<User>) {
        super({
            ignoreExpiration: false,
            secretOrKey: 'secretKey',
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
                return request.cookies?.Authentication
            }])
        })
    }

    async validate(payload: any, req: Request) {
        if (!payload) {           
            throw new UnauthorizedException()
        }

        const user = await this.repo.findOne({where: {email: payload.email}})
        if (!user) {
            throw new UnauthorizedException()
        }
        req.user = user
        return req.user
    }
}