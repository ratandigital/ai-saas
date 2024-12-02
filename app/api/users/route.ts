import { NextResponse } from 'next/server';
import { Clerk } from '@clerk/clerk-sdk-node';

export async function GET() {
  try {
    // Initialize Clerk SDK with your Clerk Secret Key (corrected the deprecation warning)
    const clerk = Clerk({
      secretKey: process.env.CLERK_SECRET_KEY,  // Use the secret key for backend tasks
    });

    // Fetch the list of users from Clerk's Admin API
    const users = await clerk.users.getUserList();
    // console.log(users);

    // Extract first names from users (you can also use 'username' here if needed)
    const firstNames = users
      .map((user: any) => user.firstName) // Extract 'firstName' from users
      .filter((firstName: string) => firstName); // Filter out empty first names if any

    return NextResponse.json({ firstNames });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Error fetching users' }, { status: 500 });
  }
}
