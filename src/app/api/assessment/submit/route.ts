import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(req: NextRequest) {
  const connection = await pool.getConnection();
  try {
    const body = await req.json();
    const { responses, questionnaire_id = 1, user_id } = body;
    if (!responses || !Array.isArray(responses) || !user_id) {
      return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }
    await connection.beginTransaction();
    const [submissionResult] = await connection.execute(
      'INSERT INTO submissions (user_id, questionnaire_id, total_score) VALUES (?, ?, ?)',
      [user_id, questionnaire_id, 0]
    );
    const submissionId = (submissionResult as { insertId: number }).insertId;
    let totalScore = 0;
    for (const response of responses) {
      if (questionnaire_id === 2) {
        const [scores] = await connection.execute(
          `SELECT score FROM question_option_map 
           WHERE question_id = ? AND option_id = ?`,
          [response.questionId, response.selectedOptionIds[0]]
        ) as unknown as [Record<string, unknown>[], unknown];
        totalScore += (scores[0]?.score as number) || 0;
      } else {
        if ([5, 8, 14].includes(response.questionId)) {
          const placeholders = response.selectedOptionIds.map(() => '?').join(',');
          await connection.execute(
            `SELECT score FROM question_option_map 
             WHERE question_id = ? AND option_id IN (${placeholders})`,
            [response.questionId, ...response.selectedOptionIds]
          );
          let questionScore = 0;
          const selectedCount = response.selectedOptionIds.length;
          if (response.questionId === 5) {
            if (response.selectedOptionIds.includes(20)) {
              questionScore = 6;
            } else {
              questionScore = selectedCount === 1 ? 3 : 0;
            }
          } else if (response.questionId === 8) {
            if (!response.selectedOptionIds.includes(40)) {
              questionScore = selectedCount * 2;
            }
          } else if (response.questionId === 14) {
            if (!response.selectedOptionIds.includes(70)) {
              questionScore = selectedCount * 1.75;
            }
          }
          totalScore += questionScore;
        } else {
          const [scores] = await connection.execute(
            `SELECT score FROM question_option_map 
             WHERE question_id = ? AND option_id = ?`,
            [response.questionId, response.selectedOptionIds[0]]
          ) as unknown as [Record<string, unknown>[], unknown];
          totalScore += (scores[0]?.score as number) || 0;
        }
      }
      for (const optionId of response.selectedOptionIds) {
        await connection.execute(
          'INSERT INTO responses (submission_id, question_id, option_id) VALUES (?, ?, ?)',
          [submissionId, response.questionId, optionId]
        );
      }
    }
    await connection.execute(
      'UPDATE submissions SET total_score = ? WHERE id = ?',
      [totalScore, submissionId]
    );
    let status;
    if (questionnaire_id === 2) {
      if (totalScore <= 6) {
        status = 'Not Ready';
      } else if (totalScore <= 11) {
        status = 'Somewhat Ready';
      } else {
        status = 'Ready';
      }
    } else {
      status = totalScore <= 49 ? 'Poor Health' :
               totalScore <= 74 ? 'Moderate Health' : 'Healthy';
    }
    await connection.commit();
    return NextResponse.json({
      success: true,
      message: 'Assessment submitted successfully',
      score: totalScore,
      status: status
    });
  } catch (error: unknown) {
    await connection.rollback();
    return NextResponse.json({ message: (error as Error).message || 'Failed to submit assessment' }, { status: 500 });
  } finally {
    connection.release();
  }
} 