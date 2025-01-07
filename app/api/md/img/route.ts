import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageName = searchParams.get('imageName');

  if (!imageName) {
    return NextResponse.json(
      { error: 'Image name is required' },
      { status: 400 }
    );
  }

  const imagePath = path.join(process.cwd(), 'md', 'img', imageName);

  try {
    if (!fs.existsSync(imagePath)) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    const imageBuffer = fs.readFileSync(imagePath);
    const extension = path.extname(imageName).toLowerCase();
    const contentType = extension === '.png' ? 'image/png' :
                       extension === '.jpg' || extension === '.jpeg' ? 'image/jpeg' :
                       extension === '.gif' ? 'image/gif' :
                       'application/octet-stream';

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return NextResponse.json(
      { error: 'Failed to serve image' },
      { status: 500 }
    );
  }
}