// app/api/blogs/[id]/route.ts
import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const blog = await prismadb.testApiLimit.findUnique({
      where: { id },
    });

    if (!blog) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
