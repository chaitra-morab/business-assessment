import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ message: 'Not found' }, { status: 404 });
} 