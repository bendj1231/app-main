import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getBlogPostBySlug, getAllPostMeta, formatDate } from '@/lib/blog/loader';
import { markdownToHtml } from '@/lib/blog/markdown';
import { sanitizeHtmlCustom } from '@/lib/sanitize-html';
import { ArrowLeft, Calendar, Clock, Tag, Share2, Twitter, Linkedin, Facebook } from 'lucide-react';

export default function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState(getBlogPostBySlug(slug || ''));
  const [htmlContent, setHtmlContent] = useState('');
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);

  useEffect(() => {
    if (slug) {
      const blogPost = getBlogPostBySlug(slug);
      if (blogPost) {
        setPost(blogPost);
        // Convert markdown to HTML then sanitize before rendering
        markdownToHtml(blogPost.content).then((rawHtml) => {
          const safeHtml = sanitizeHtmlCustom(rawHtml, [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'p', 'br', 'ul', 'ol', 'li',
            'strong', 'em', 'b', 'i',
            'a', 'span', 'blockquote',
            'pre', 'code', 'img',
          ], ['href', 'target', 'rel', 'class', 'src', 'alt']);
          setHtmlContent(safeHtml);
        });
        
        // Get related posts
        const allPosts = getAllPostMeta();
        const related = allPosts
          .filter((p) => p.category === blogPost.category && p.slug !== slug)
          .slice(0, 3);
        setRelatedPosts(related);
      }
    }
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <Link to="/blog" className="text-red-600 hover:underline">Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            <Link 
              to="/blog"
              className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Blog</span>
            </Link>
            <a href="/" className="text-lg font-bold text-slate-900">
              Pilot<span className="text-red-600">Recognition</span>
            </a>
          </div>
        </div>
      </header>

      {/* Article Header */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full">
              {post.category}
            </span>
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-slate-900 mb-6 leading-tight">
            {post.title}
          </h1>

          <p className="text-xl text-slate-600 leading-relaxed mb-8">
            {post.excerpt}
          </p>

          {/* Author & Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-3">
              {post.author.avatar ? (
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                  {post.author.name.charAt(0)}
                </div>
              )}
              <div>
                <p className="font-medium text-slate-900">{post.author.name}</p>
                <p className="text-xs">{post.author.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(post.publishedAt)}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.readingTime} min read
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="aspect-video rounded-2xl overflow-hidden">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Article Content */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Share */}
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3">
                  Share
                </p>
                <div className="flex gap-2">
                  <ShareButton platform="twitter" title={post.title} />
                  <ShareButton platform="linkedin" title={post.title} />
                  <ShareButton platform="facebook" title={post.title} />
                </div>
              </div>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3">
                    Tags
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 text-[10px] uppercase tracking-widest font-bold mb-2">
                  Build Your Profile
                </p>
                <p className="text-slate-700 text-sm mb-3">
                  Create your verified PilotRecognition profile today.
                </p>
                <a
                  href="/become-member"
                  className="block w-full bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors text-center"
                >
                  Get Started →
                </a>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <article className="lg:col-span-3">
            <div
              className="prose prose-lg prose-slate max-w-none
                prose-headings:font-serif prose-headings:text-slate-900
                prose-p:text-slate-600 prose-p:leading-relaxed
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-slate-900 prose-strong:font-semibold
                prose-ul:my-6 prose-ol:my-6 prose-li:my-2
                prose-blockquote:border-l-4 prose-blockquote:border-blue-600 
                prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-slate-700
                prose-img:rounded-xl prose-img:shadow-lg
                prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:p-4 prose-pre:rounded-xl"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {/* Mobile Share & Tags */}
            <div className="lg:hidden mt-12 pt-8 border-t border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm font-medium text-slate-900">Share this article</p>
                <div className="flex gap-2">
                  <ShareButton platform="twitter" title={post.title} />
                  <ShareButton platform="linkedin" title={post.title} />
                  <ShareButton platform="facebook" title={post.title} />
                </div>
              </div>
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 text-sm rounded-full"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </article>
        </div>
      </section>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="bg-slate-50 py-16">
          <div className="max-w-4xl mx-auto px-6">
            <h3 className="text-2xl font-serif text-slate-900 mb-8">Related Articles</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  to={`/blog/${related.slug}`}
                  className="group bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-slate-300 transition-all"
                >
                  <h4 className="font-serif text-slate-900 mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
                    {related.title}
                  </h4>
                  <p className="text-sm text-slate-600 line-clamp-2">{related.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer CTA */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Modernize Your Aviation Career?
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of pilots building verified, competency-based profiles that airlines trust.
          </p>
          <a
            href="/become-member"
            className="inline-block bg-red-600 hover:bg-red-500 text-white font-semibold px-8 py-4 rounded-xl transition-all hover:scale-105"
          >
            Create Your Profile →
          </a>
        </div>
      </section>
    </div>
  );
}

function ShareButton({ platform, title }: { platform: 'twitter' | 'linkedin' | 'facebook'; title: string }) {
  const icons = {
    twitter: Twitter,
    linkedin: Linkedin,
    facebook: Facebook,
  };
  const Icon = icons[platform];

  const getShareUrl = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    switch (platform) {
      case 'twitter':
        return `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    }
  };

  return (
    <a
      href={getShareUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
      aria-label={`Share on ${platform}`}
    >
      <Icon className="w-4 h-4 text-slate-600" />
    </a>
  );
}
