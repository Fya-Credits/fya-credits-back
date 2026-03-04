import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../../config/database';
import { env } from '../../config/env';
import { AppError } from '../../middleware/errorHandler';
import { RegisterInput, LoginInput } from './auth.schema';

export const authService = {
  async register(data: RegisterInput) {
    console.log('[Auth:Register] Starting registration', { email: data.email });

    const existingUser = await db('users').where({ email: data.email }).first();

    if (existingUser) {
      const error: AppError = new Error('User already exists');
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const [user] = await db('users')
      .insert({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role || 'client',
        document: data.document || null,
      })
      .returning(['id', 'name', 'email', 'role', 'document', 'created_at']);

    const token = jwt.sign({ userId: user.id }, env.jwt.secret, {
      expiresIn: env.jwt.expiresIn,
    });

    console.log('[Auth:Register] Registration successful', { userId: user.id });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'client',
      },
      token,
    };
  },

  async login(data: LoginInput) {
    console.log('[Auth:Login] Starting login', { email: data.email });

    const user = await db('users').where({ email: data.email }).first();

    if (!user) {
      const error: AppError = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password);

    if (!isValidPassword) {
      const error: AppError = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({ userId: user.id }, env.jwt.secret, {
      expiresIn: env.jwt.expiresIn,
    });

    console.log('[Auth:Login] Login successful', { userId: user.id });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'client',
      },
      token,
    };
  },
};
