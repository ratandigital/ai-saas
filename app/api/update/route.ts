import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

export async function POST(req: Request) {
  try {
    console.log('working');

    const currentDate = new Date();

    await prismadb.testApiLimit.updateMany({
    
      data: {
        createdAt: currentDate, // Set to current date, not null
      },
    });

    return NextResponse.json({ message: 'Updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to update entries:', error);
    return NextResponse.json({ error: 'Failed to update entries' }, { status: 500 });
  }
}
