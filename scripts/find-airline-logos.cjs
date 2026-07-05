const https = require('https');

const airlines = [
  { name: 'SkyJet', url: 'flyskyjetair.com', keyword: 'skyjet' },
  { name: 'Royal Air', url: 'flyroyalair.com', keyword: 'royal' },
  { name: 'Air Juan', url: 'airjuan.com', keyword: 'airjuan' },
  { name: 'Sky Pasada', url: 'skypasada.com', keyword: 'skypasada' },
  { name: 'Bangsamoro', url: 'bangsamoroair.com', keyword: 'bangsamoro' }
];

function fetch(url) {
  return new Promise((resolve) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 10000 }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        fetch(res.headers.location).then(resolve);
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', () => resolve(''));
    req.on('timeout', () => { req.destroy(); resolve(''); });
  });
}

(async () => {
  for (const airline of airlines) {
    const html = await fetch('https://' + airline.url);
    const matches = html.match(/https?:\/\/[^\s"<>]+\.(png|jpg|jpeg|svg|webp)/gi) || [];
    const logos = matches.filter(u => u.toLowerCase().includes(airline.keyword) || u.toLowerCase().includes('logo'));
    console.log('\n' + airline.name + ':');
    console.log('  Total images:', matches.length);
    console.log('  Logo candidates:', [...new Set(logos)].slice(0, 5));
  }
})();
