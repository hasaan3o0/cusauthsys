import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import * as db from './db';

const secretKey = 'your-secret-key-min-32-chars-long!!!!!';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

export async function decrypt(token: string) {
  try {
    const { payload } = await jwtVerify(token, key);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function verifyAuth(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return null;

  try {
    const verified = await decrypt(token);
    return verified;
  } catch (err) {
    return null;
  }
}

export async function login(formData: { email: string; password: string }) {
  const user = await db.validateCredentials(formData.email, formData.password);
  
  if (!user) {
    return { error: 'Invalid credentials' };
  }

  
  const payload = { email: user.email, id: user.id };
  const token = await encrypt(payload);
  
  cookies().set('token', token, { 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 
  });

  return { success: true };
}

export async function register(formData: { email: string; password: string }) {
  const existingUser = await db.findUserByEmail(formData.email);
  if (existingUser) {
    return { error: 'User already exists' };
  }

  const user = await db.createUser(formData.email, formData.password);
  return { success: true };
}

export async function logout() {
  cookies().delete('token');
}