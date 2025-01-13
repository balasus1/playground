import { useEffect, useState } from 'react';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import bookGridStyle from '../components/assets/styles/bookgrid.module.css';

type BookDetails = {
  id: string;
  title: string;
  author: string;
  publication_year: number;
  genre: string[];
  cover_image: string;
  description: string;
  filename: string;
};

export default function BookGrid(): JSX.Element {
  const router = useRouter();
  const [books, setBooks] = useState<BookDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBooks = async (): Promise<void> => {
      try {
        const response = await fetch('/api/books');
        if (!response.ok) throw new Error('Failed to fetch books');

        const data = await response.json();
        setBooks(data.files);
        console.log(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };
    fetchBooks();
  }, []);

  const handleBookClick = (filename: string): void => {
    console.log(`fileName: ${filename}`);
    const encodedFilename = btoa(filename).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    router.push(`/read?book=http://localhost:15080/${encodedFilename}/manifest.json`);
  };

  if (loading) {
    return <div className={bookGridStyle.bookgrid}>
      <div className={bookGridStyle.loading}>Loading books...</div></div>
  }

  return (
      <div className={bookGridStyle.bookgrid}>
        <div className={bookGridStyle.listViewContainer}>
          {books && books.map((book) => (
            <div key={book.id} className={bookGridStyle.bookDetails} onClick={() => handleBookClick(book.filename)}>
                <div className={bookGridStyle.bookContainer}>
                  <Image src={book.cover_image} alt={book.title} width={200} height={300} priority={true}/>
                  <div className={bookGridStyle.rightContainer}>
                    <div className={bookGridStyle.bookTitle}>{book.title}</div>
                    <div className={bookGridStyle.bookAuthor}><span className='by'>{book.author}</span></div>
                    <div className={bookGridStyle.bookGenre}>{book.genre.join(', ')}</div>
                  </div>
                </div>
            </div>
          ))}
        </div>
      </div>
  );
}