import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';   
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    try {
      // Create user through UsersService
      const user = await this.usersService.create(registerDto);

      // Generate JWT token
      const payload = { 
        sub: user.id, 
        email: user.email, 
        role: user.role 
      };
      
      const access_token = this.jwtService.sign(payload);

      return {
        access_token,
        user,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error('Registration failed');
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role 
    };
    
    const access_token = this.jwtService.sign(payload);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return {
      access_token,
      user: userWithoutPassword,
    };
  }

  async validateUser(id: number): Promise<any> {
    const user = await this.usersService.findOne(id);
    if (user) {
      return user;
    }
    return null;
  }
}