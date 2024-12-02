// app/api/clerk-webhook/route.ts
import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

export async function POST(req: Request) {
  const { type, data } = await req.json();

  if (type === 'user.created') {
    const { id: userId, email_addresses, Username } = data;

    // Extract user information
    const email = email_addresses[0]?.email_address;
    const name = ` ${Username || ''}`.trim();

    // Save to MongoDB
    try {
      await prismadb.user.create({
        data: {
          userId,
          email,
          name,
        },
      });
      return NextResponse.json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Error saving user:', error);
      return NextResponse.json({ error: 'Error saving user data' }, { status: 500 });
    }
  }

  return NextResponse.json({ message: 'Event not handled' });
}
