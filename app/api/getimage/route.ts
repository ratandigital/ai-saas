import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import { auth } from "@clerk/nextjs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') as string) || 1;
  const limit = parseInt(searchParams.get('limit') as string) || 12;
  const skip = (page - 1) * limit;
  const search = searchParams.get('search') || '';
  const username = searchParams.get('username') || ''; // Use 'username' instead of 'userId'
  const date = searchParams.get('date');
 
  
  try {
    const filters: any = {};
    const { userId } = auth();
    if (username) {
      // Filter by username, assuming 'username' is available in your database
      filters.user = { username: username }; // Assuming 'user' model has a 'username' field
    }
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filters.createdAt = { gte: startDate, lt: endDate };
    }

  const images = await prismadb.imageCreate.findMany({
  where: {
    ansMassage: {
      contains: search ?? "", // Handle null or undefined search
      mode: 'insensitive',
    },
    userId: userId,
  },
  skip,
  take: limit,
});

// Reverse the order of the retrieved data in JavaScript
const reversedImages = images.reverse();

    

    const totalImages = await prismadb.imageCreate.count({
      where: {
        ansMassage: { contains: search, mode: 'insensitive' },
        ...filters,
      },
    });
    const totalPages = Math.ceil(totalImages / limit);

    const imagesWithUrls = reversedImages.map(image => ({
      ...image,
      imageUrl: `/images/${image.ansMassage}`,
    }));

    return NextResponse.json({ images: imagesWithUrls, totalPages });
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ error: 'Error fetching images' }, { status: 500 });
  }
}
