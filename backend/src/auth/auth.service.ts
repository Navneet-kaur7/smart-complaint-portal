import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';   
import * as bcrypt from 'bcrypt';
import { User, PasswordReset } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
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

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      // To prevent email enumeration, we don't reveal that the user doesn't exist.
      // We'll just return a success message.
      return { message: 'If your email is registered, you will receive a password reset link.' };
    }

    const token = randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // Token expires in 1 hour

    await this.prisma.passwordReset.create({
      data: {
        email,
        token,
        expires,
      },
    });

    // In a real application, you would send an email with the reset link.
    // For this example, we'll just return the token in the response for simplicity.
    console.log(`Password reset token for ${email}: ${token}`);

    return { message: 'If your email is registered, you will receive a password reset link.' };
  }

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    const passwordReset = await this.prisma.passwordReset.findUnique({
      where: { token },
    });

    if (!passwordReset || passwordReset.expires < new Date()) {
      throw new UnauthorizedException('Invalid or expired password reset token');
    }

    const user = await this.usersService.findByEmail(passwordReset.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const newPassword = salt + '.' + hash.toString('hex');

    await this.usersService.update(user.id, { password: newPassword });

    await this.prisma.passwordReset.delete({ where: { token } });

    return { message: 'Password has been reset successfully.' };
  }
}