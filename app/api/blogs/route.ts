import { NextResponse } from 'next/server';
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

export async function GET(req: Request) {
  const { userId } = auth();
  
  // Check if userId is null (user not authenticated)
  if (!userId) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const itemsPerPage = 9;

  const [totalPosts, posts] = await Promise.all([
    prismadb.testApiLimit.count({
      where: { userId }, // Filter count by userId
    }),
    prismadb.testApiLimit.findMany({
      where: { userId },
      skip: (page - 1) * itemsPerPage,
      take: itemsPerPage,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return NextResponse.json({ posts, totalPosts });
}
