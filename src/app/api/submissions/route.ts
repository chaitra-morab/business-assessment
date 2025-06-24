import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    let connection;
    try {
      connection = await pool.getConnection();
      const [submissions] = await connection.query(
        `SELECT
            s.id,
            s.user_id,
            s.questionnaire_id,
            s.total_score,
            s.created_at,
            u.name AS applicantName,
            q.name AS questionnaireName
        FROM submissions s
        JOIN users u ON s.user_id = u.id
        JOIN questionnaires q ON s.questionnaire_id = q.id
        ORDER BY s.id ASC`
      );
      return NextResponse.json({ submissions });
    } catch (error) {
      console.error('Error in submissions API:', error);
      return NextResponse.json(
        { message: 'Internal server error' },
        { status: 500 }
      );
    } finally {
      if (connection) connection.release();
    }
  } catch (error) {
    console.error('Request parsing error:', error);
    return NextResponse.json(
      { message: 'Invalid request format' },
      { status: 400 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { message: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { message: 'Token format is "Bearer [token]"' },
        { status: 401 }
      );
    }

    const { user_id, questionnaire_id, total_score } = await request.json();

    if (!user_id || !questionnaire_id || typeof total_score === 'undefined') {
      return NextResponse.json(
        { message: 'Missing required fields for submission' },
        { status: 400 }
      );
    }

    let connection;
    try {
      connection = await pool.getConnection();

      const [result] = await connection.query(
        'INSERT INTO submissions (user_id, questionnaire_id, total_score) VALUES (?, ?, ?)',
        [user_id, questionnaire_id, total_score]
      );

      // Fetch user name for the socket event
      // const [userRows] = await connection.query('SELECT name FROM users WHERE id = ?', [user_id]);
      // const userName = userRows[0]?.name || 'Unknown User';

      // Note: Socket.IO implementation would go here
      // For now, we'll just return the success response

      return NextResponse.json(
        { message: 'Submission created successfully', id: (result as { insertId: number }).insertId },
        { status: 201 }
      );
    } catch (error) {
      console.error('Error in submissions API:', error);
      return NextResponse.json(
        { message: 'Internal server error' },
        { status: 500 }
      );
    } finally {
      if (connection) connection.release();
    }
  } catch (error) {
    console.error('Request parsing error:', error);
    return NextResponse.json(
      { message: 'Invalid request format' },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const idNum = Number(id);
    if (!id || isNaN(idNum)) {
      return NextResponse.json(
        { message: 'Missing or invalid submission id' },
        { status: 400 }
      );
    }
    let connection;
    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();
      // Delete responses for this submission
      await connection.query('DELETE FROM responses WHERE submission_id = ?', [idNum]);
      // Delete the submission
      const [result] = await connection.query(
        'DELETE FROM submissions WHERE id = ?',
        [idNum]
      );
      await connection.commit();
      if ((result as { affectedRows: number }).affectedRows === 0) {
        return NextResponse.json(
          { message: 'Submission not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ message: 'Submission and related responses deleted successfully' });
    } catch (error) {
      if (connection) await connection.rollback();
      console.error('Error deleting submission:', error);
      return NextResponse.json(
        { message: 'Internal server error' },
        { status: 500 }
      );
    } finally {
      if (connection) connection.release();
    }
  } catch (error) {
    console.error('Request parsing error:', error);
    return NextResponse.json(
      { message: 'Invalid request format' },
      { status: 400 }
    );
  }
} 