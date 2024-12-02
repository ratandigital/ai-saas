import { NextResponse } from 'next/server';
import prismadb from "@/lib/prismadb";


export async function POST(req: Request) {
  try {
    const { userId, amount, status, remark, orderType } = await req.json();

    if (!userId || !amount || !status || !orderType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newOrder = await prismadb.order.create({
      data: {
        userId,
        amount,
        status,
        remark,
        orderType,
      },
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
