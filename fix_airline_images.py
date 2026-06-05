import re

# Fix AirlineExpectationsCarousel.tsx
file1 = '/Users/bowler/Documents/apps/app-main/components/website/components/AirlineExpectationsCarousel.tsx'
with open(file1, 'r') as f:
    content1 = f.read()
content1 = re.sub(r"image: 'https://res\.cloudinary\.com/dridtecu6/image/upload/v[0-9]+/airline-expectations/[^']+'", "image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80'", content1)
with open(file1, 'w') as f:
    f.write(content1)
print('Fixed AirlineExpectationsCarousel.tsx')

# Fix DiscoverPathwaysAnimation.tsx
file2 = '/Users/bowler/Documents/apps/app-main/components/website/components/home/DiscoverPathwaysAnimation.tsx'
with open(file2, 'r') as f:
    content2 = f.read()
content2 = re.sub(r"img: 'https://res\.cloudinary\.com/dridtecu6/image/upload/v[0-9]+/airline-expectations/[^']+'", "img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80'", content2)
content2 = re.sub(r"logo: 'https://upload\.wikimedia\.org/wikipedia/[^']+'", "logo: null", content2)
content2 = re.sub(r"logo: 'https://logos-world\.net/[^']+'", "logo: null", content2)
content2 = re.sub(r'src="https://res\.cloudinary\.com/dridtecu6/image/upload/v[0-9]+/airline-expectations/[^"]+"', 'src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80"', content2)
with open(file2, 'w') as f:
    f.write(content2)
print('Fixed DiscoverPathwaysAnimation.tsx')
