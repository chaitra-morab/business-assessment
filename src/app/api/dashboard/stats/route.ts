import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  const connection = await pool.getConnection();
  try {
    // Total users
    const [usersRows] = await connection.query('SELECT COUNT(*) as totalUsers FROM users');
    const totalUsers = (usersRows as Array<{ totalUsers: number }>)[0]?.totalUsers || 0;
    // Total submissions
    const [subRows] = await connection.query('SELECT COUNT(*) as totalSubmissions FROM submissions');
    const totalSubmissions = (subRows as Array<{ totalSubmissions: number }>)[0]?.totalSubmissions || 0;
    // Total reports (set to 0)
    const totalReports = 0;
    // Active questions
    const [activeQRows] = await connection.query('SELECT COUNT(*) as activeQuestions FROM questions');
    const activeQuestions = (activeQRows as Array<{ activeQuestions: number }>)[0]?.activeQuestions || 0;
    // Business Health submissions
    const [bhRows] = await connection.query('SELECT COUNT(*) as businessHealthSubmissions FROM submissions WHERE questionnaire_id = 1');
    const businessHealthSubmissions = (bhRows as Array<{ businessHealthSubmissions: number }>)[0]?.businessHealthSubmissions || 0;
    // Franchise Readiness submissions
    const [frRows] = await connection.query('SELECT COUNT(*) as franchiseReadinessSubmissions FROM submissions WHERE questionnaire_id = 2');
    const franchiseReadinessSubmissions = (frRows as Array<{ franchiseReadinessSubmissions: number }>)[0]?.franchiseReadinessSubmissions || 0;

    // Business Health dimension-wise average score
    const [businessHealthDimensions] = await connection.query(`
      SELECT d.name, IFNULL(AVG(qom.score), 0) as score
      FROM dimensions d
      LEFT JOIN questions q ON q.dimension_id = d.id
      LEFT JOIN responses r ON r.question_id = q.id
      LEFT JOIN question_option_map qom ON qom.question_id = q.id AND qom.option_id = r.option_id
      WHERE d.questionnaire_id = 1
      GROUP BY d.id
    `);

    // Franchise Readiness dimension-wise average score
    const [franchiseReadinessDimensions] = await connection.query(`
      SELECT d.name, IFNULL(AVG(qom.score), 0) as score
      FROM dimensions d
      LEFT JOIN questions q ON q.dimension_id = d.id
      LEFT JOIN responses r ON r.question_id = q.id
      LEFT JOIN question_option_map qom ON qom.question_id = q.id AND qom.option_id = r.option_id
      WHERE d.questionnaire_id = 2
      GROUP BY d.id
    `);

    return NextResponse.json({
      totalUsers,
      totalSubmissions,
      totalReports,
      activeQuestions,
      businessHealthSubmissions,
      franchiseReadinessSubmissions,
      businessHealthDimensions,
      franchiseReadinessDimensions,
    });
  } finally {
    connection.release();
  }
} 