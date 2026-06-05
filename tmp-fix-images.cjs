const fs = require('fs');

// Fix AirlineExpectationsCarousel.tsx
const file1 = '/Users/bowler/Documents/apps/app-main/components/website/components/AirlineExpectationsCarousel.tsx';
let content1 = fs.readFileSync(file1, 'utf8');
content1 = content1.replace(/image: 'https:\/\/res\.cloudinary\.com\/dridtecu6\/image\/upload\/v[0-9]+\/airline-expectations\/[^']+'/g, "image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80'");
fs.writeFileSync(file1, content1);
console.log('Fixed AirlineExpectationsCarousel.tsx');

// Fix DiscoverPathwaysAnimation.tsx
const file2 = '/Users/bowler/Documents/apps/app-main/components/website/components/home/DiscoverPathwaysAnimation.tsx';
let content2 = fs.readFileSync(file2, 'utf8');
content2 = content2.replace(/img: 'https:\/\/res\.cloudinary\.com\/dridtecu6\/image\/upload\/v[0-9]+\/airline-expectations\/[^']+'/g, "img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80'");
content2 = content2.replace(/logo: 'https:\/\/upload\.wikimedia\.org\/wikipedia\/[^']+'/g, "logo: null");
content2 = content2.replace(/logo: 'https:\/\/logos-world\.net\/[^']+'/g, "logo: null");
content2 = content2.replace(/src="https:\/\/res\.cloudinary\.com\/dridtecu6\/image\/upload\/v[0-9]+\/airline-expectations\/[^"]+"/g, 'src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80"');
fs.writeFileSync(file2, content2);
console.log('Fixed DiscoverPathwaysAnimation.tsx');
