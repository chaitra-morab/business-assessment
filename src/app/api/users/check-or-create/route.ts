import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email } = body;
  try {
    const [existingRows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]) as unknown as [Record<string, unknown>[], unknown];
    if (existingRows.length > 0) {
      return NextResponse.json({ message: 'User already exists', userId: existingRows[0].id }, { status: 200 });
    }
    const [result] = await pool.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]) as unknown as [Record<string, unknown>, unknown];
    return NextResponse.json({ message: 'User registered successfully', userId: (result as { insertId: number }).insertId }, { status: 201 });
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
} 