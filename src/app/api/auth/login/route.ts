import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  // Only allow admin login
  if (email !== 'admin@gmail.com' || password !== 'admin') {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // Check admin in DB
  const [rows] = await pool.query('SELECT * FROM admin WHERE email = ?', [email]);
  const user = (rows as Array<{ id: number; name: string; email: string; password: string }>)[0];
  if (!user || user.password !== password) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // Set a simple session cookie (for demo, not secure for production)
  const res = NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });
  res.cookies.set('admin_auth', 'true', { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 });
  return res;
} 