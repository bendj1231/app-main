'use client';

import React, { useState, useEffect } from 'react';
import { detectRegionalPricing, type RegionalPrice } from '../../lib/regionalPricing';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  ArrowRight, 
  Star,
  Shield,
  Truck,
  CreditCard,
  Check,
  X,
  Plus,
  Minus,
  Trash2,
  Gift,
  Download,
  Shirt,
  BookOpen,
  Award,
  Zap
} from 'lucide-react';

// ─── Product Data ─────────────────────────────────────────────────

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: 'merchandise' | 'digital' | 'programs' | 'gift';
  image: string;
  rating: number;
  reviews: number;
  badge?: string;
  features: string[];
  inStock: boolean;
  isDigital?: boolean;
}

const PRODUCTS: Product[] = [
  // Programs
  {
    id: 'foundation-program',
    name: 'Foundation Program',
    description: 'Complete pilot development program with 20+ hours of guided mentorship. Build your Recognition Score and unlock pathway access.',
    price: 49,
    originalPrice: 99,
    category: 'programs',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    rating: 4.9,
    reviews: 2847,
    badge: 'Best Seller',
    features: ['20HR Guided Mentorship', 'Pilot Profile Build', 'Global Talent Registry', '50% off Transition Program'],
    inStock: true,
    isDigital: true,
  },
  {
    id: 'transition-program',
    name: 'Transition Program',
    description: 'Airline transition readiness with ATLAS CV optimization, interview preparation, and industry alignment training.',
    price: 299,
    originalPrice: 599,
    category: 'programs',
    image: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=800&q=80',
    rating: 4.8,
    reviews: 1923,
    badge: 'Most Popular',
    features: ['ATLAS CV Formatting', 'Airline Interview Prep', 'EBT Video Scoring', 'Broker Network Access'],
    inStock: true,
    isDigital: true,
  },
  {
    id: 'recognition-plus',
    name: 'Recognition+ Membership',
    description: 'Annual premium membership with unlimited pathway access, priority matching, and exclusive platform features.',
    price: 99,
    originalPrice: 149,
    category: 'programs',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    rating: 4.9,
    reviews: 5432,
    features: ['Unlimited Pathway Views', 'Priority Matching', 'Recognition+ Badge', 'AI Career Strategist'],
    inStock: true,
    isDigital: true,
  },
  {
    id: 'ebt-cbta-fasttrack',
    name: 'EBT/CBTA Fast-Track',
    description: 'Accelerated competency-based training program with evidence-based assessment preparation.',
    price: 199,
    category: 'programs',
    image: 'https://images.unsplash.com/photo-1542296332-2e44a1998db5?w=800&q=80',
    rating: 4.7,
    reviews: 892,
    features: ['Competency-Based Training', 'Evidence Assessment Prep', 'Interview Fast-Track', 'Airline Partnership Access'],
    inStock: true,
    isDigital: true,
  },
  // Digital Products
  {
    id: 'atlas-cv-guide',
    name: 'ATLAS CV Master Guide',
    description: 'Complete guide to ATLAS CV formatting standards. Templates, examples, and optimization strategies.',
    price: 29,
    category: 'digital',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80',
    rating: 4.8,
    reviews: 1247,
    features: ['ATLAS Templates', 'Formatting Guidelines', 'Airline-Specific Examples', 'PDF & Word Formats'],
    inStock: true,
    isDigital: true,
  },
  {
    id: 'interview-prep-bundle',
    name: 'Airline Interview Prep Bundle',
    description: 'Comprehensive interview preparation with question banks, video practice, and simulator scenarios.',
    price: 79,
    originalPrice: 129,
    category: 'digital',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80',
    rating: 4.9,
    reviews: 2156,
    badge: 'Top Rated',
    features: ['Question Banks (500+)', 'Video Interview Practice', 'Technical Assessment Prep', 'CRM Scenario Training'],
    inStock: true,
    isDigital: true,
  },
  {
    id: 'logbook-optimization',
    name: 'Logbook Optimization Toolkit',
    description: 'Tools and templates for optimizing your flight hours presentation for maximum Recognition Score impact.',
    price: 39,
    category: 'digital',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    rating: 4.6,
    reviews: 743,
    features: ['Hour Analysis Tools', 'Presentation Templates', 'Recency Calculators', 'Score Optimization Guide'],
    inStock: true,
    isDigital: true,
  },
  // Gift Cards
  {
    id: 'gift-card-50',
    name: 'PilotRecognition Gift Card - $50',
    description: 'Perfect for aspiring pilots. Can be used for any program, membership, or digital product.',
    price: 50,
    category: 'gift',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80',
    rating: 5.0,
    reviews: 328,
    features: ['Instant Digital Delivery', 'Never Expires', 'Any Product Eligible', 'Personalized Message'],
    inStock: true,
    isDigital: true,
  },
  {
    id: 'gift-card-100',
    name: 'PilotRecognition Gift Card - $100',
    description: 'Give the gift of career advancement. Valid for all programs and memberships.',
    price: 100,
    category: 'gift',
    image: 'https://images.unsplash.com/photo-1572585332907-4d8ae1299d3e?w=800&q=80',
    rating: 5.0,
    reviews: 456,
    features: ['Instant Digital Delivery', 'Never Expires', 'Any Product Eligible', 'Gift Wrapping Option'],
    inStock: true,
    isDigital: true,
  },
  {
    id: 'gift-card-250',
    name: 'PilotRecognition Gift Card - $250',
    description: 'The ultimate gift for serious pilots. Covers Foundation + Transition programs.',
    price: 250,
    category: 'gift',
    image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=800&q=80',
    rating: 5.0,
    reviews: 189,
    badge: 'Best Value',
    features: ['Instant Digital Delivery', 'Never Expires', 'Full Program Coverage', 'Personalized Message'],
    inStock: true,
    isDigital: true,
  },
];

const CATEGORIES = [
  { id: 'all', name: 'All Products', icon: ShoppingBag },
  { id: 'programs', name: 'Programs', icon: Award },
  { id: 'digital', name: 'Digital Products', icon: Download },
  { id: 'gift', name: 'Gift Cards', icon: Gift },
];

// ─── Store Page Component ─────────────────────────────────────────

export default function StorePage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState<string | null>(null);
  const [regionalPricing, setRegionalPricing] = useState<RegionalPrice & { countryCode: string }>({
    currency: 'USD', symbol: '$', annual: 99, monthly: 12, semiAnnual: 60,
    annualNote: 'Save $45/yr vs monthly', locale: 'en-US', countryCode: 'US',
  });

  useEffect(() => {
    setRegionalPricing(detectRegionalPricing());
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return (
        {/* Coded by Benjamin Bowler */}) => window.removeEventListener('scroll', onScroll);
  }, []);

  const localizedProducts = PRODUCTS.map(p =>
    p.id === 'recognition-plus'
      ? { ...p, price: regionalPricing.annual, originalPrice: Math.round(regionalPricing.annual * 1.5), _symbol: regionalPricing.symbol }
      : { ...p, _symbol: '$' }
  );

  const filteredProducts = activeCategory === 'all'
    ? localizedProducts
    : localizedProducts.filter(p => p.category === activeCategory);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setAddedToCart(product.id);
    setTimeout(() => setAddedToCart(null), 1500);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const cartSymbol = cart.find(i => i.product.id === 'recognition-plus') ? regionalPricing.symbol : '$';
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Sticky Nav */}
      <header className={`sticky top-0 z-40 transition-all duration-200 ${scrolled ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm' : 'bg-white/80 backdrop-blur-sm'}`}>
        <div className="max-w-6xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            <a href="https://pilotrecognition.com" className="flex items-center gap-3 group">
              <span className="text-xl font-bold tracking-tight">
                <span className="text-slate-900">Pilot</span><span className="text-red-600">Recognition</span>
              </span>
              <span className="text-sm font-semibold text-slate-900 tracking-wide">Store</span>
            </a>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 text-slate-600 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="text-sm font-medium hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-100/50 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-red-100/30 blur-3xl rounded-full pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-12">
          <p className="text-[11px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-5">PilotRecognition Store</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] mb-6 text-slate-900">
            Invest in Your<br />
            <span className="text-red-600">Aviation Career.</span>
          </h1>
          <p className="text-slate-600 text-lg md:text-xl max-w-3xl mb-8 leading-relaxed">
            Programs, digital resources, and tools designed to accelerate your pathway to the flight deck. 
            Verified. Recognized. Ready.
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-6 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              <span>Secure Checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-600" />
              <span>Instant Digital Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              <span>30-Day Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-16 z-30 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeCategory === cat.id
                      ? 'bg-red-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.article
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl transition-all flex flex-col"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.badge && (
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
                      {product.badge}
                    </span>
                  </div>
                )}
                {product.isDigital && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-md flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      Digital
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-500 fill-current" />
                    <span className="text-sm font-medium text-slate-700">{product.rating}</span>
                  </div>
                  <span className="text-slate-400">•</span>
                  <span className="text-sm text-slate-500">({product.reviews.toLocaleString()} reviews)</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-red-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2 flex-1">
                  {product.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.features.slice(0, 2).map((feature, i) => (
                    <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
                      {feature}
                    </span>
                  ))}
                  {product.features.length > 2 && (
                    <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded-md">
                      +{product.features.length - 2} more
                    </span>
                  )}
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-slate-900">
                      {(product as any)._symbol || '$'}{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-slate-400 line-through">
                        {(product as any)._symbol || '$'}{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                      addedToCart === product.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-red-600 hover:bg-red-500 text-white'
                    } ${!product.inStock && 'opacity-50 cursor-not-allowed'}`}
                  >
                    {addedToCart === product.id ? (
                      <span className="flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        Added
                      </span>
                    ) : (
                      'Add to Cart'
                    )}
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-50 border-t border-slate-200 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Instant Access</h3>
              <p className="text-slate-600 text-sm">
                Digital products delivered immediately. Start building your profile right away.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Secure Payment</h3>
              <p className="text-slate-600 text-sm">
                Enterprise-grade encryption. Your data is always protected.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Satisfaction Guaranteed</h3>
              <p className="text-slate-600 text-sm">
                30-day money-back guarantee. Not satisfied? Full refund, no questions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: 'How do I access my digital products?',
              a: 'After purchase, all digital products are immediately available in your PilotRecognition dashboard under "My Purchases". You can download or access them anytime.'
            },
            {
              q: 'Can I gift a program or membership?',
              a: 'Yes! Purchase a gift card and send it directly to the recipient via email with a personalized message. They can redeem it for any product in the store.'
            },
            {
              q: 'What is your refund policy?',
              a: 'We offer a 30-day satisfaction guarantee. If you are not completely satisfied with your purchase, contact us for a full refund—no questions asked.'
            },
            {
              q: 'Do programs expire?',
              a: 'Once purchased, programs and digital products never expire. You have lifetime access to complete the program at your own pace.'
            },
            {
              q: 'Can I upgrade from Foundation to Transition later?',
              a: 'Absolutely. Foundation graduates receive 50% off the Transition Program. The discount is automatically applied when you enroll.'
            },
          ].map((faq, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-slate-900 mb-2">{faq.q}</h3>
              <p className="text-slate-600 text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Not Sure Where to Start?</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Create a free profile and get personalized recommendations based on your current experience and career goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://pilotrecognition.com/become-member"
              className="bg-red-600 hover:bg-red-500 text-white font-semibold px-8 py-4 rounded-xl transition-all"
            >
              Create Free Profile
            </a>
            <a 
              href="https://pilotrecognition.com/pathways-modern"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-all"
            >
              Explore Pathways
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">
                <span className="text-slate-900">Pilot</span><span className="text-red-600">Recognition</span>
              </span>
              <span className="text-sm font-semibold text-slate-500 tracking-wide">Store</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-600">
              <a href="https://pilotrecognition.com" className="hover:text-red-600 transition-colors">Home</a>
              <a href="https://pilotrecognition.com/about" className="hover:text-red-600 transition-colors">About</a>
              <a href="https://pilotrecognition.com/recognition-plus" className="hover:text-red-600 transition-colors">Recognition+</a>
              <a href="https://pilotrecognition.com/contact" className="hover:text-red-600 transition-colors">Support</a>
            </div>
          </div>
          <div className="border-t border-slate-200 mt-8 pt-8 text-center">
            <p className="text-slate-500 text-sm">© 2026 PilotRecognition. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Cart Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Your Cart ({cartCount})
                </h2>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-500">Your cart is empty</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="mt-4 text-red-600 font-semibold hover:underline"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map(({ product, quantity }) => (
                      <div key={product.id} className="flex gap-4 bg-slate-50 rounded-xl p-4">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900 text-sm">{product.name}</h3>
                          <p className="text-red-600 font-bold">{(product as any)._symbol || '$'}{product.price.toLocaleString()}</p>
                          
                          <div className="flex items-center gap-2 mt-2">
                            <button 
                              onClick={() => updateQuantity(product.id, -1)}
                              className="p-1 hover:bg-slate-200 rounded"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-medium">{quantity}</span>
                            <button 
                              onClick={() => updateQuantity(product.id, 1)}
                              className="p-1 hover:bg-slate-200 rounded"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => removeFromCart(product.id)}
                              className="ml-auto p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="border-t border-slate-200 p-6 space-y-4">
                  <div className="flex items-center justify-between text-lg">
                    <span className="font-bold text-slate-900">Total</span>
                    <span className="font-bold text-slate-900">{cartSymbol}{cartTotal.toLocaleString()}</span>
                  </div>
                  <button className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-4 rounded-xl transition-colors">
                    Proceed to Checkout
                  </button>
                  <p className="text-center text-xs text-slate-500">
                    Shipping calculated at checkout. Digital products delivered immediately.
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
