import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

type Option = {
  id: number;
  option_text: string;
  score: number;
};
type Question = {
  id: number;
  question_text: string;
  is_multiple: boolean;
  weight: number;
  options: Option[];
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const questionnaireId = searchParams.get('questionnaire_id') || 1;
    const [resultsRaw] = await pool.execute(
      `SELECT 
        d.name as dimension_name,
        q.id as question_id,
        q.question_text,
        q.is_multiple,
        q.weight,
        o.id as option_id,
        o.option_text,
        qom.score
      FROM dimensions d
      JOIN questions q ON d.id = q.dimension_id
      JOIN question_option_map qom ON q.id = qom.question_id
      JOIN options o ON qom.option_id = o.id
      WHERE d.questionnaire_id = ?
      ORDER BY d.id, q.id, o.id`,
      [questionnaireId]
    );
    const results = resultsRaw as unknown as Record<string, unknown>[];
    if (!results || results.length === 0) {
      return NextResponse.json({ message: 'No questions found' }, { status: 404 });
    }
    const questionsByDimension: Record<string, Question[]> = {};
    (results as Record<string, unknown>[]).forEach((row: Record<string, unknown>) => {
      const dimensionName = row.dimension_name as string;
      const questionId = row.question_id as number;
      if (!questionsByDimension[dimensionName]) {
        questionsByDimension[dimensionName] = [];
      }
      let question = questionsByDimension[dimensionName].find((q: Question) => q.id === questionId);
      if (!question) {
        question = {
          id: questionId,
          question_text: row.question_text as string,
          is_multiple: (row.is_multiple as number) === 1,
          weight: row.weight as number,
          options: []
        };
        questionsByDimension[dimensionName].push(question);
      }
      (question as Question).options.push({
        id: row.option_id as number,
        option_text: row.option_text as string,
        score: row.score as number
      });
    });
    let hasError = false;
    for (const dimension of Object.values(questionsByDimension)) {
      for (const question of dimension as { options: unknown[] }[]) {
        if (!question.options || question.options.length === 0) {
          hasError = true;
          break;
        }
      }
      if (hasError) break;
    }
    if (hasError) {
      return NextResponse.json({ message: 'Some questions are missing options' }, { status: 500 });
    }
    return NextResponse.json(questionsByDimension);
  } catch (error: unknown) {
    return NextResponse.json({ message: (error as Error).message || 'Internal server error' }, { status: 500 });
  }
} 