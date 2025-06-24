import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export async function authenticateToken(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    throw new Error('Access token missing');
  }
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET as string);
    return user;
  } catch {
    throw new Error('Invalid token');
  }
} 