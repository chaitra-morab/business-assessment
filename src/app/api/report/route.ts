import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const name = searchParams.get('name');
  const date = searchParams.get('date'); // dd mmm yyyy
  let connection;
  try {
    connection = await pool.getConnection();
    if (id) {
      // Download PDF for a specific report
      const [rows] = (await connection.query(
        'SELECT pdf_data, file_name FROM reports WHERE id = ?',
        [id]
      ) as unknown as [unknown[]]);
      if (!(rows as unknown[]).length) {
        return new NextResponse('Report not found', { status: 404 });
      }
      const pdf = (rows as { pdf_data: Buffer }[])[0].pdf_data;
      const fileName = (rows as { file_name: string }[])[0].file_name;
      return new NextResponse(pdf, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${fileName}"`,
        },
      });
    } else {
      // List all reports with username and type, with optional filters
      let query = `
        SELECT r.id, u.name as username, qn.name as type, r.sent_to_email, r.created_at
        FROM reports r
        JOIN submissions s ON r.submission_id = s.id
        JOIN users u ON s.user_id = u.id
        JOIN questionnaires qn ON s.questionnaire_id = qn.id
        WHERE 1=1
      `;
      const params: unknown[] = [];
      if (name) {
        query += ' AND u.name LIKE ?';
        params.push(`%${name}%`);
      }
      if (date) {
        query += ' AND DATE_FORMAT(r.created_at, "%d %b %Y") = ?';
        params.push(date);
      }
      query += ' ORDER BY r.created_at DESC';
      const [rows] = await connection.query(query, params);
      return NextResponse.json({ reports: rows });
    }
  } catch (error) {
    console.error('Error in report API:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
} 