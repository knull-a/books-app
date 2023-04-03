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
  volumeInfo: {
      title: string;
      authors: string;
      imageLinks: {
          thumbnail: string
      }
      averageRating: number;
      ratingsCount: number;
      description: string;
      categories: string[];
      publisher: string;
      publishedDate: string;
      industryIdentifiers: Array<{type: string; identifier: string}>;
      pageCount: string;
      printedPageCount: string;
      previewLink: string;   
  }
  saleInfo: {
      saleability: string;
      listPrice: {
          amount: number;
          currencyCode: string
      }
  }
}

export type {Book, SingleBook}