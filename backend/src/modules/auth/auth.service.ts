import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.userRepository.findOne({ where: { email: dto.email } });
    if (exists) throw new BadRequestException('User already exists with this email');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepository.create({ ...dto, password: hashedPassword });
    
    const savedUser = await this.userRepository.save(user);
    const { password, ...result } = savedUser; 
    return result;
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({ 
        where: { email: dto.email },
        select: ['id', 'name', 'email', 'password']
    });

    // Logic: 1. Check if user exists. 
    // 2. Use bcrypt to compare the plain text 'dto.password' with the hashed 'user.password'
    if (!user || !(await bcrypt.compare(dto.password, user.password!))) {
        throw new UnauthorizedException('Invalid email or password');
    }

    // Logic: If they match, create a 'payload'. 
    // 'sub' is a standard JWT claim for the Subject (the User ID).
    const payload = { sub: user.id, email: user.email };
  
    return {
        user: { id: user.id, name: user.name },
        access_token: this.jwtService.sign(payload),
    };
  }
}