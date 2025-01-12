import fs from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

type Book = {
  id: string;
  title: string;
  author: string;
  cover_image: string;
  publication_year: number;
  genre: string[];
}

async function getBooks(count: number): Promise<Book[]> {
  let books: Book[] = [];
  try {
    const response = await fetch('https://www.freetestapi.com/api/v1/books');
    if (!response.ok) {
      throw new Error(`Failed to fetch books: ${response.statusText}`);
    }
    books = await response.json();
  } catch (e) {
    console.error(`Error fetching books: ${e}`);
    return Array(count).fill({
      id: 'default',
      title: 'Unknown title',
      author: 'Unknown author',
      cover_image: 'https://random-image-pepebigotes.vercel.app/api/random-image',
      publication_year: 1900,
      genre: ['General']
    });
  }
  return books;
}

export async function GET(): Promise<Response> {
  try {
    const uploadsDir = path.join(process.cwd(), 'public/upload');
    
    // Reading the directory content using fs
    const files = await fs.readdir(uploadsDir);

    const books = await getBooks(files.length);

    const mappedFiles = files.map((file, index) => ({
      ...books[index],
      filename: file
    }));
    // Return the list of files
    return new Response(JSON.stringify({ files: mappedFiles }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error reading directory:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to read directory' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}