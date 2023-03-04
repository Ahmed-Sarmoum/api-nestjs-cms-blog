import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common'; 
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserLoginDto } from './dto/user-login.dto';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>,
                     private jwtService: JwtService) {}

  async register(createUserDto: CreateUserDto) {

    const { email } = createUserDto
    const checkForUser =  await this.repo.findOne({where: {email: email}})

    if (checkForUser) {
      throw new BadRequestException('email is already chosen, please choose a new one!')
    } else {
      const user = new User()
      Object.assign(user, createUserDto)
      this.repo.create(user)
      await this.repo.save(user)
      delete user.password
      return user
    }
  }

  async login(userLoginDto: UserLoginDto) {
    const user = await this.repo
                                .createQueryBuilder('user')
                                .addSelect('user.password')
                                .where('user.email = :email ', {email: userLoginDto.email}).getOne()

    
    
    if (!user) {
       throw new UnauthorizedException('Bad Credentials')
    } else {
      const check = await this.verifyPassword(userLoginDto.password, user.password)
      if (check) {
        const token = await this.jwtService.signAsync({
          email: user.email,
          id: user.id
        }) 
        
        delete user.password
        return { token, user }
      } else {
        throw new UnauthorizedException('Bad Credentials')
      }
    }
  }
 
  async verifyPassword(password: string, hash: string) {    
    return await bcrypt.compare(password, hash)
  }
}
