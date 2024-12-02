import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import { auth } from "@clerk/nextjs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') as string) || 1;
  const limit = parseInt(searchParams.get('limit') as string) || 12;
  const skip = (page - 1) * limit;
  const search = searchParams.get('search'); // search can be string or null
  const username = searchParams.get('username') || ''; // Default to empty string if null
  const date = searchParams.get('date');

  try {
    const filters: any = {};
    const { userId } = auth();

    // Ensure userId is not null or undefined
    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    if (username) {
      filters.user = { username: username }; // Assuming 'user' model has a 'username' field
    }

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filters.createdAt = { gte: startDate, lt: endDate };
    }

    // Handle the search to ensure it's always a valid string (if null, make it empty string)
    const safeSearch = search || ''; // If search is null, default to ''

    // Pass safeSearch and valid userId
    const images = await prismadb.imageCreate.findMany({
      where: {
        ansMassage: {
          contains: safeSearch, // Ensure it's always a string
          mode: 'insensitive',
        },
        userId: userId, // Ensure userId is always a valid string
      },
      skip,
      take: limit,
    });

    // Reverse the order of the retrieved data in JavaScript
    const reversedImages = images.reverse();

    const totalImages = await prismadb.imageCreate.count({
      where: {
        ansMassage: { contains: safeSearch, mode: 'insensitive' },
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
