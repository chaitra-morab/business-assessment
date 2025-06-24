import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    let connection;
    try {
      connection = await pool.getConnection();
      const query = `
        SELECT
          q.id,
          q.question_text,
          q.weight,
          d.name as dimension_name,
          qn.name as questionnaire_name
        FROM questions q
        JOIN dimensions d ON q.dimension_id = d.id
        JOIN questionnaires qn ON d.questionnaire_id = qn.id
        ORDER BY q.id ASC
      `;
      const [rows] = await connection.query(query);
      const questions = (rows as unknown[]).map((row) => ({
        id: (row as { id: number }).id,
        question_text: (row as { question_text: string }).question_text,
        weight: (row as { weight: number }).weight,
        dimension_name: (row as { dimension_name: string }).dimension_name,
        questionnaire_name: (row as { questionnaire_name: string }).questionnaire_name,
      }));
      return NextResponse.json({ questions });
    } catch (error) {
      console.error('Error in questions API:', error);
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

// You can add POST, PUT, DELETE as needed, following the dashboard's implementation. 