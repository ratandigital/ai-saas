import { NextResponse } from 'next/server';
import prismadb from "@/lib/prismadb";


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
  const status = searchParams.get('status') || '';

  try {
    // Set up filtering options
    const filters: any = {};
    if (status) {
      filters.status = status;
    }

    // Fetch orders with pagination, filtering, and sorting by createdAt
    const orders = await prismadb.order.findMany({
      where: filters,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    });

    // Get the total number of orders for pagination info
    const totalOrders = await prismadb.order.count({ where: filters });

    return NextResponse.json({
      orders,
      pagination: {
        totalOrders,
        currentPage: page,
        totalPages: Math.ceil(totalOrders / pageSize),
      },
    });
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
