import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { db } from '../../config/database';
import { AppError } from '../../middleware/errorHandler';
import { CreateUserInput, UpdateUserInput } from './users.schema';

export type UserRole = 'client' | 'commercial' | 'admin';

export const usersService = {
  async findByRole(role: UserRole) {
    const users = await db('users')
      .select('id', 'name', 'email', 'document', 'role', 'created_at')
      .where({ role })
      .orderBy('name');
    return users;
  },

  async findClients() {
    return this.findByRole('client');
  },

  async findCommercials() {
    return this.findByRole('commercial');
  },

  async findAll() {
    return db('users')
      .select('id', 'name', 'email', 'document', 'role', 'created_at')
      .orderBy('role')
      .orderBy('name');
  },

  async create(data: CreateUserInput) {
    const existingUser = await db('users').where({ email: data.email }).first();

    if (existingUser) {
      const error: AppError = new Error('User already exists');
      error.statusCode = 409;
      throw error;
    }

    const password = data.password || (data.role === 'client' ? crypto.randomUUID().replace(/-/g, '').slice(0, 12) : null);
    if (!password) {
      const error: AppError = new Error('Password is required');
      error.statusCode = 400;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const [user] = await db('users')
      .insert({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        document: data.document || null,
      })
      .returning(['id', 'name', 'email', 'document', 'role', 'created_at']);

    return user;
  },

  async update(id: string, data: UpdateUserInput) {
    const existingUser = await db('users').where({ id }).first();
    if (!existingUser) {
      const error: AppError = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) {
      const emailTaken = await db('users').where({ email: data.email }).whereNot({ id }).first();
      if (emailTaken) {
        const error: AppError = new Error('Email already in use');
        error.statusCode = 409;
        throw error;
      }
      updateData.email = data.email;
    }
    if (data.password !== undefined && data.password.length > 0) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }
    if (data.role !== undefined) updateData.role = data.role;
    if (data.document !== undefined) updateData.document = data.document ?? null;

    const [user] = await db('users')
      .where({ id })
      .update(updateData)
      .returning(['id', 'name', 'email', 'document', 'role', 'created_at']);

    return user;
  },
};
