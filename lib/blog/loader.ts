import matter from 'gray-matter';
import { BlogPost, BlogPostMeta, BlogCategory } from './types';

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Use Vite's import.meta.glob to load markdown files at build time
const blogFiles = import.meta.glob<string>('../../docs/blog/*.md', { 
  query: '?raw',
  import: 'default',
  eager: true 
});

export function getAllBlogPosts(): BlogPost[] {
  const posts: BlogPost[] = [];

  for (const [filePath, content] of Object.entries(blogFiles)) {
    const slug = filePath.replace(/^.*\/docs\/blog\//, '').replace('.md', '');
    const { data, content: markdownContent } = matter(content as string);

    posts.push({
      slug,
      title: data.title || '',
      excerpt: data.excerpt || '',
      content: markdownContent,
      author: {
        name: data.author?.name || 'PilotRecognition Team',
        role: data.author?.role || 'Editorial',
        avatar: data.author?.avatar,
      },
      publishedAt: data.publishedAt || new Date().toISOString(),
      updatedAt: data.updatedAt,
      tags: data.tags || [],
      category: data.category || 'Industry Insights',
      featuredImage: data.featuredImage,
      readingTime: calculateReadingTime(markdownContent),
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      canonicalUrl: data.canonicalUrl,
    });
  }

  return posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  const allPosts = getAllBlogPosts();
  return allPosts.find(post => post.slug === slug) || null;
}

export function getAllPostMeta(): BlogPostMeta[] {
  const posts = getAllBlogPosts();
  
  return posts
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      author: post.author,
      publishedAt: post.publishedAt,
      tags: post.tags,
      category: post.category,
      featuredImage: post.featuredImage,
      readingTime: post.readingTime,
    }))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getCategories(): BlogCategory[] {
  const posts = getAllBlogPosts();
  const categories = new Set(posts.map((post) => post.category));
  return Array.from(categories) as BlogCategory[];
}

export function getTags(): string[] {
  const posts = getAllBlogPosts();
  const tags = new Set(posts.flatMap((post) => post.tags));
  return Array.from(tags);
}

export function getPostsByCategory(category: BlogCategory): BlogPostMeta[] {
  return getAllPostMeta().filter((post) => post.category === category);
}

export function getPostsByTag(tag: string): BlogPostMeta[] {
  return getAllPostMeta().filter((post) => post.tags.includes(tag));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
