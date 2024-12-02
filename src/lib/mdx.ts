export type MDXEntry<T> = T & { href: string; metadata: T };

export interface Article {
  date: string;
  title: string;
  description: string;
  author: {
    name: string;
    role: string;
    image: HTMLImageElement;
  };
}

export interface CaseStudy {
  date: string;
  client: string;
  title: string;
  description: string;
  summary: string[];
  logo: string;
  image: {
      src: string;
      alt: string;
  };
  service: string;
  testimonial: {
    author: {
      name: string;
      role: string;
    };
    content: string;
  };
}
