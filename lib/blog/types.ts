export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  category: BlogCategory;
  featuredImage?: string;
  readingTime: number;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
}

export type BlogCategory = 
  | 'Industry Insights'
  | 'Pilot Careers'
  | 'EBT CBTA'
  | 'Platform Updates'
  | 'Partnerships'
  | 'Regulatory'
  | 'Technology';

export interface BlogIndex {
  posts: BlogPostMeta[];
  categories: BlogCategory[];
  tags: string[];
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  excerpt: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  publishedAt: string;
  tags: string[];
  category: BlogCategory;
  featuredImage?: string;
  readingTime: number;
}
