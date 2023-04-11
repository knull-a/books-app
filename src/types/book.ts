interface ImageLinks {
  smallThumbnail: string
  thumbnail: string
  medium: string;
  large: string;
  extraLarge: string;
}

interface Book {
  id: string;
  title: string;
  authors: string[] | string;
  publisher: string;
  publishedDate: string;
  description: string;
  pageCount: number;
  categories: string[];
  imageLinks: ImageLinks
  averageRating: string;
}

type FilteredBook = Pick<Book, "id" | "title" | "authors" | "imageLinks"> 

interface SingleBook {
  id: string;
  volumeInfo: {
    title: string;
    authors: string[];
    imageLinks: {
      thumbnail: string;
    };
    averageRating: number;
    ratingsCount: number;
    description: string;
    categories: string[];
    publisher: string;
    publishedDate: string;
    industryIdentifiers: Array<{ type: string; identifier: string }>;
    pageCount: string;
    printedPageCount: string;
    previewLink: string;
  };
  saleInfo: {
    saleability: string;
    listPrice: {
      amount: number;
      currencyCode: string;
    };
  };
}

interface BookArray {
  name: string
  book: PushBook[]
}

interface PushBook {
  id: string
  title: string
  author: string[] | string
  image: string
  bookReview?: {
    text?: string
    rating?: number
  }
}

interface BookList {
  apiKey: string
  books: Book[]
}

export type { Book, SingleBook, FilteredBook, BookArray, PushBook, BookList };
