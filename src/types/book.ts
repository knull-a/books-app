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

export type {Book}