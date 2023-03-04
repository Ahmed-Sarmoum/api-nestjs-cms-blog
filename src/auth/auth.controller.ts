import { Controller, Post, Body, Res, Get, UseGuards, Req} from '@nestjs/common';
import { AuthService } from './auth.service'; 
import { UserLoginDto } from './dto/user-login.dto';
import { Request, Response } from 'express'
import { CreateUserDto } from './dto/create-user.dto';
import { CurrentUser } from './user.decorator';
import { User } from './entities/user.entity';
import { CurrentUserGuard } from './current-user.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register') 
  async register(@Body() createUserDto:CreateUserDto) {
    return this.authService.register(createUserDto)
  }

  @Post('login')
  async login(@Body() userLoginDto: UserLoginDto, @Res() res: Response) {
    const {token, user} = await this.authService.login(userLoginDto)
    
    res.cookie('IsAuthenticated', true, { maxAge: 2*60*60*1000 })
    res.cookie('Authentication', token, {
      httpOnly: true,
      maxAge: 2*60*60*1000
    })

    return res.send({ success: true, user })
  }

  @Get('authstatus')
  @UseGuards(CurrentUserGuard)
  authStatus(@CurrentUser() user: User) {
    return { status: !!user, user}
  }

  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('Authentication')
    res.clearCookie('IsAuthenticated')

    return res.status(200).send({ success: true })
  }
}
