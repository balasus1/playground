import { writeFile, mkdir } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export const runtime = 'nodejs';

interface FileWithName extends Blob {
  name: string;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as FileWithName | null;

    if (!file || typeof file.name !== 'string') {
      return NextResponse.json(
        { error: 'No file uploaded or invalid file' },
        { status: 400 }
      );
    }

    // Validate MIME type
    if (file.type !== 'application/epub+zip') {
      return NextResponse.json(
        { error: 'Only EPUB files are allowed' },
        { status: 400 }
      );
    }

    // Convert file to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const data = new Uint8Array(buffer);
    // Ensure upload directory exists
    const uploadsDir = path.join(process.cwd(), 'public/upload');
    await mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, file.name);
    await writeFile(filePath, data);

    return NextResponse.json({ success: true, fileName: file.name, filePath: filePath.toString() });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}