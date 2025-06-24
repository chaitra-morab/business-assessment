import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      'SELECT id, name, email, created_at FROM users ORDER BY id ASC'
    ) as unknown[];
    return NextResponse.json({ users: rows });
  } finally {
    connection.release();
  }
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return NextResponse.json({ message: 'User ID required' }, { status: 400 });
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    // Find all submission ids for this user
    const [subs] = (await connection.query('SELECT id FROM submissions WHERE user_id = ?', [id]) as unknown as [unknown[]]);
    const submissionIds = (subs as { id: number }[]).map((s) => s.id);
    if (submissionIds.length > 0) {
      // Delete responses for these submissions
      await connection.query('DELETE FROM responses WHERE submission_id IN (?)', [submissionIds]);
      // Delete submissions
      await connection.query('DELETE FROM submissions WHERE id IN (?)', [submissionIds]);
    }
    // Delete user
    await connection.query('DELETE FROM users WHERE id = ?', [id]);
    await connection.commit();
    return NextResponse.json({ success: true });
  } catch {
    await connection.rollback();
    return NextResponse.json({ message: 'Failed to delete user and related data' }, { status: 500 });
  } finally {
    connection.release();
  }
}

export async function PUT(request: Request) {
  const { id, name, email } = await request.json();
  if (!id || !name || !email) return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
  const connection = await pool.getConnection();
  try {
    await connection.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id]);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: 'Failed to update user' }, { status: 500 });
  } finally {
    connection.release();
  }
} 