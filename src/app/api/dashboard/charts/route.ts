import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  const connection = await pool.getConnection();
  try {
    // 1. Average Score Per Tool (Questionnaire)
    const [avgScoreRows] = await connection.query(
      `SELECT q.name AS tool, AVG(s.total_score) AS avg_score
       FROM submissions s
       JOIN questionnaires q ON s.questionnaire_id = q.id
       GROUP BY s.questionnaire_id`
    );

    // 2. Weakest Categories (lowest avg dimension scores, top 5)
    const [weakestCategoriesRows] = await connection.query(
      `SELECT d.name AS category, AVG(qom.score) AS avg_score
       FROM responses r
       JOIN questions q ON r.question_id = q.id
       JOIN dimensions d ON q.dimension_id = d.id
       JOIN question_option_map qom ON qom.question_id = r.question_id AND qom.option_id = r.option_id
       GROUP BY d.id
       ORDER BY avg_score ASC`
    );

    // 3. Franchise Readiness Trends Over Time (questionnaire_id = 2)
    const [frTrendsRows] = await connection.query(
      `SELECT DATE(s.created_at) AS date, AVG(s.total_score) AS avg_score
       FROM submissions s
       WHERE s.questionnaire_id = 2
       GROUP BY DATE(s.created_at)
       ORDER BY date ASC`
    );

    // 4. Submissions by Tool (Pie Chart)
    const [submissionsByToolRows] = await connection.query(
      `SELECT q.name AS tool, COUNT(*) AS submission_count
       FROM submissions s
       JOIN questionnaires q ON s.questionnaire_id = q.id
       GROUP BY s.questionnaire_id`
    );

    return NextResponse.json({
      averageScorePerTool: avgScoreRows,
      weakestCategories: weakestCategoriesRows,
      franchiseReadinessTrends: frTrendsRows,
      submissionsByTool: submissionsByToolRows,
    });
  } finally {
    connection.release();
  }
} 