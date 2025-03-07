import prisma from '../prisma/index.js';
import bcrypt from 'bcryptjs'
import { sign, verify } from 'hono/jwt';

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'secretkey';

export const registerUser = async (email: string, password: string) => {
  const existingUser = await prisma.user.findFirst({ where: { email } });

  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: { email, password: hashedPassword },
  });
};

export const loginUser = async (email: string, password: string) => {
  console.log('JWTSECRET', JWT_SECRET)
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new Error('Invalid email or password');

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) throw new Error('Invalid email or password');

  const payload = { sub: user.id, email: user.email };

  const accessToken = await sign(
    { ...payload, exp: Math.floor(Date.now() / 1000) + 60 * 60 },
    JWT_SECRET
  );

  const refreshToken = await sign(
    { ...payload, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 },
    REFRESH_SECRET
  );

  return { accessToken, refreshToken };
};

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const decoded = await verify(refreshToken, REFRESH_SECRET);
    const user = await prisma.user.findUnique({ where: { email: String(decoded.email) } });

    if (!user) throw new Error('Invalid refresh token');

    const newAccessToken = await sign(
      { sub: user.id, email: user.email, exp: Math.floor(Date.now() / 1000) + 60 * 60 },
      JWT_SECRET
    );

    return newAccessToken;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};
