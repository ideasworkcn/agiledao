import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, start_date, due_date, manager, status } = await request.json();
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        start_date,
        due_date,
        manager,
        status,
      },
    });
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, description, start_date, due_date, manager, status } = await request.json();
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        start_date,
        due_date,
        manager,
        status,
      },
    });
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}
