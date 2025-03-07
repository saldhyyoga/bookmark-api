import { describe, test, expect, vi, beforeEach } from 'vitest';
import { registerUser, loginUser } from '../auth/auth.service.js';
import prisma from '../prisma/index.js';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs'

vi.mock('bcrypt', async () => {
    const actual = await vi.importActual<typeof import('bcrypt')>('bcrypt');
    return {
      ...actual,
      hash: vi.fn(() => 'hashed_password'),
      compare: vi.fn((pw, hash) => hash === 'hashed_password'),
    };
});
  
describe('Auth Service', () => {
  beforeEach(() => {
    vi.restoreAllMocks(); // Reset mocks before each test
  });

  const id = faker.string.uuid()
  const email = faker.internet.email()
  test('registerUser should create a new user', async () => {
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
    vi.spyOn(prisma.user, 'create').mockResolvedValue({
      id,
      email,
      password: 'hashed_password',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const user = await registerUser('test@example.com', 'password123');

    expect(user.email).toEqual(email);
    expect(prisma.user.create).toHaveBeenCalled();
  });

  test('loginUser should return tokens on successful login', async () => {
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: 'user-123',
      email: 'test@example.com',
      password: 'hashed_password',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  
    vi.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
  
    const tokens = await loginUser('test@example.com', 'password123');
  
    expect(tokens).toHaveProperty('accessToken');
    expect(tokens).toHaveProperty('refreshToken');
  });
  
  test('loginUser should throw error if password is incorrect', async () => {
    vi.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id,
      email,
      password: 'hashed_password',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(loginUser('test@example.com', 'wrongpassword')).rejects.toThrow('Invalid email or password');
  });
});
