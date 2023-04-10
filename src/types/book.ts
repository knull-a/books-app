interface Book {
  id: string;
  title: string;
  authors: string[];
  publisher: string;
  publishedDate: string;
  description: string;
  pageCount: number;
  categories: string[];
  imageLinks: {
    smallThumbnail: string;
    thumbnail: string;
    medium: string;
    large: string;
    extraLarge: string;
  };
  averageRating: string;
}

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

interface FilteredBook {
  id: string
  title: string
  authors: string[] | string
  imageLinks: ImageLinks
}

interface ImageLinks {
  smallThumbnail: string
  thumbnail: string
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

export type { Book, SingleBook, FilteredBook, BookArray, PushBook };
