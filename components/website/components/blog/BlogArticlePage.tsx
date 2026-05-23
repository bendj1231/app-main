import React from 'react';
import { ArrowLeft, Calendar, Clock, Tag, Share2, Twitter, Linkedin, Facebook } from 'lucide-react';
import { TopNavbar } from '../TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';
import { BlogPost } from '@/lib/blog/types';
import { formatDate } from '@/lib/blog/loader';

interface BlogArticlePageProps {
  post: BlogPost;
  htmlContent: string;
  relatedPosts: { slug: string; title: string; excerpt: string }[];
  onNavigate: (page: string) => void;
  onLogin: () => void;
  onBack: () => void;
  onRelatedArticleClick: (slug: string) => void;
}

export const BlogArticlePage: React.FC<BlogArticlePageProps> = ({
  post,
  htmlContent,
  relatedPosts,
  onNavigate,
  onLogin,
  onBack,
  onRelatedArticleClick,
}) => {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = post.title;

  const handleShare = (platform: 'twitter' | 'linkedin' | 'facebook') => {
    const urls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    };
    window.open(urls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

      {/* Back Navigation */}
      <div className="fixed top-24 left-6 z-20">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors bg-white/80 backdrop-blur px-3 py-2 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Blog</span>
        </button>
      </div>

      {/* Article Header */}
      <div className="pt-32 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <RevealOnScroll>
            <div className="flex flex-wrap gap-2 mb-6">
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

            <h1 className="text-3xl md:text-5xl font-serif text-slate-900 leading-tight mb-6">
              {post.title}
            </h1>

            <p className="text-xl text-slate-600 leading-relaxed mb-8">
              {post.excerpt}
            </p>

            {/* Author & Meta */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-y border-slate-200">
              <div className="flex items-center gap-4">
                {post.author.avatar ? (
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-lg">
                    {post.author.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-medium text-slate-900">{post.author.name}</p>
                  <p className="text-sm text-slate-500">{post.author.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-slate-500">
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
          </RevealOnScroll>
        </div>
      </div>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="px-6 mb-12">
          <div className="max-w-4xl mx-auto">
            <RevealOnScroll>
              <div className="aspect-video rounded-2xl overflow-hidden">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </RevealOnScroll>
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <RevealOnScroll>
            <article
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
          </RevealOnScroll>

          {/* Share Section */}
          <RevealOnScroll delay={0.2}>
            <div className="mt-16 pt-8 border-t border-slate-200">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="font-medium text-slate-900 mb-1">Share this article</p>
                  <p className="text-sm text-slate-500">Help fellow pilots discover this insight</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShare('twitter')}
                    className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    aria-label="Share on Twitter"
                  >
                    <Twitter className="w-5 h-5 text-slate-700" />
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    aria-label="Share on LinkedIn"
                  >
                    <Linkedin className="w-5 h-5 text-slate-700" />
                  </button>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    aria-label="Share on Facebook"
                  >
                    <Facebook className="w-5 h-5 text-slate-700" />
                  </button>
                </div>
              </div>
            </div>
          </RevealOnScroll>

          {/* Tags */}
          {post.tags.length > 0 && (
            <RevealOnScroll delay={0.3}>
              <div className="mt-8">
                <p className="text-sm font-medium text-slate-900 mb-3">Tagged</p>
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
              </div>
            </RevealOnScroll>
          )}
        </div>
      </div>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <div className="py-16 px-6 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <RevealOnScroll>
              <h3 className="text-2xl font-serif text-slate-900 mb-8">Related Articles</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((related) => (
                  <article
                    key={related.slug}
                    onClick={() => onRelatedArticleClick(related.slug)}
                    className="group cursor-pointer bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-slate-300 transition-all"
                  >
                    <h4 className="font-serif text-slate-900 mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
                      {related.title}
                    </h4>
                    <p className="text-sm text-slate-600 line-clamp-2">{related.excerpt}</p>
                  </article>
                ))}
              </div>
            </RevealOnScroll>
          </div>
        </div>
      )}
    </div>
  );
};
