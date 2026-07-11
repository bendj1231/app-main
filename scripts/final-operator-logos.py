#!/usr/bin/env python3
"""
Final attempt to download remaining 39 operator logos.
Uses multiple strategies:
1. curl with full browser headers (bypasses simple 403s)
2. Brandfetch API (logo database)
3. Google cached images
4. Alternative URL patterns
"""

import json
import os
import re
import subprocess
import time
import urllib.parse
import urllib.request
import ssl
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent / "public" / "images" / "Pathways" / "Helicopter Operators" / "APAC"

# Full browser-like headers
FULL_HEADERS = [
    "-H", "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "-H", "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "-H", "Accept-Language: en-US,en;q=0.9",
    "-H", "Accept-Encoding: gzip, deflate, br",
    "-H", "Sec-Fetch-Dest: document",
    "-H", "Sec-Fetch-Mode: navigate",
    "-H", "Sec-Fetch-Site: none",
    "-H", "Sec-Fetch-User: ?1",
    "-H", "Upgrade-Insecure-Requests: 1",
    "-H", "Connection: keep-alive",
    "--compressed",
]

# Operators that need logos, with alternative URLs to try
# Strategy: try brandfetch, then website with full headers, then known logo CDNs
REMAINING_OPERATORS = {
    # Australia
    "dunn-aviation": {
        "country": "australia", "category": "agricultural",
        "urls": [
            "https://www.dunnaviation.com.au/wp-content/uploads/2020/01/Dunn-Logo.png",
            "https://www.dunnaviation.com.au/wp-content/themes/dunn/images/logo.png",
        ],
        "website": "https://www.dunnaviation.com.au/",
        "brandfetch": "dunnaviation.com.au",
    },
    # New Zealand
    "mainland-air": {
        "country": "new-zealand", "category": "general-aviation",
        "urls": [
            "https://www.mainlandair.com/wp-content/themes/mainlandair/images/logo.png",
        ],
        "website": "https://www.mainlandair.com/",
        "brandfetch": "mainlandair.com",
    },
    "island-aviation": {
        "country": "new-zealand", "category": "general-aviation",
        "urls": [
            "https://www.islandaviation.co.nz/wp-content/themes/islandaviation/images/logo.png",
        ],
        "website": "https://www.islandaviation.co.nz/",
        "brandfetch": "islandaviation.co.nz",
    },
    # China
    "eastern-general-aviation": {
        "country": "china", "category": "helicopter",
        "urls": [
            "https://www.szdbth.com/images/logo.png",
            "https://www.szdbth.com/static/images/logo.png",
            "https://www.szdbth.com/assets/logo.png",
        ],
        "website": "https://www.szdbth.com/",
        "brandfetch": "szdbth.com",
    },
    "suzhou-feixian-ruohang": {
        "country": "china", "category": "helicopter",
        "urls": [
            "http://en.feixiankeji.cn/images/logo.png",
            "http://en.feixiankeji.cn/static/images/logo.png",
        ],
        "website": "http://en.feixiankeji.cn/",
        "brandfetch": "feixiankeji.cn",
    },
    # India
    "garg-aviation-limited": {
        "country": "india", "category": "flight-training",
        "urls": [
            "https://www.gargaviation.com/images/logo.png",
            "https://gargaviation.com/wp-content/uploads/logo.png",
        ],
        "website": "https://www.gargaviation.com/",
        "brandfetch": "gargaviation.com",
    },
    # Indonesia
    "equator-avia-persada": {
        "country": "indonesia", "category": "helicopter",
        "urls": [
            "https://www.equatoravia.com/images/logo.png",
            "https://equatoravia.com/wp-content/uploads/logo.png",
        ],
        "website": "https://www.equatoravia.com/",
        "brandfetch": "equatoravia.com",
    },
    "falcon-patriot-udara": {
        "country": "indonesia", "category": "helicopter",
        "urls": [
            "https://www.falconpatriot.com/images/logo.png",
        ],
        "website": "https://www.falconpatriot.com/",
        "brandfetch": "falconpatriot.com",
    },
    "sgi": {
        "country": "indonesia", "category": "helicopter",
        "urls": [
            "https://www.sgi.co.id/images/logo.png",
            "https://sgi.co.id/wp-content/uploads/logo.png",
        ],
        "website": "https://www.sgi.co.id/",
        "brandfetch": "sgi.co.id",
    },
    "matthew-air-nusantara": {
        "country": "indonesia", "category": "helicopter",
        "urls": [],
        "website": "",
        "brandfetch": "",
    },
    # Singapore
    "singapore-heli-services": {
        "country": "singapore", "category": "helicopter",
        "urls": [
            "https://www.singaporehelicoptertour.com/images/logo.png",
        ],
        "website": "https://www.singaporehelicoptertour.com/",
        "brandfetch": "singaporehelicoptertour.com",
    },
    "air-charter-service-singapore": {
        "country": "singapore", "category": "private-jet",
        "urls": [
            "https://www.aircharterservice.com/images/logo.png",
        ],
        "website": "https://www.aircharterservice.com/",
        "brandfetch": "aircharterservice.com",
    },
    "singapore-air-charter": {
        "country": "singapore", "category": "private-jet",
        "urls": [
            "https://www.singaporeaircharter.com/images/logo.png",
        ],
        "website": "https://www.singaporeaircharter.com/",
        "brandfetch": "singaporeaircharter.com",
    },
    "air-7-asia": {
        "country": "singapore", "category": "private-jet",
        "urls": [
            "https://www.air7asia.com/images/logo.png",
        ],
        "website": "https://www.air7asia.com/",
        "brandfetch": "air7asia.com",
    },
    # Thailand
    "thai-aviation-services": {
        "country": "thailand", "category": "helicopter",
        "urls": [
            "https://www.thaiaviationservices.com/images/logo.png",
        ],
        "website": "https://www.thaiaviationservices.com/",
        "brandfetch": "thaiaviationservices.com",
    },
    "andaman-aerodrome": {
        "country": "thailand", "category": "helicopter",
        "urls": [
            "https://www.andamanaerodrome.com/images/logo.png",
        ],
        "website": "https://www.andamanaerodrome.com/",
        "brandfetch": "andamanaerodrome.com",
    },
    # Vietnam
    "vietnam-helicopters": {
        "country": "vietnam", "category": "helicopter",
        "urls": [
            "https://www.vnhelicopters.com/images/logo.png",
        ],
        "website": "https://www.vnhelicopters.com/",
        "brandfetch": "vnhelicopters.com",
    },
    "vnh-central": {
        "country": "vietnam", "category": "helicopter",
        "urls": [],
        "website": "",
        "brandfetch": "",
    },
    # Bangladesh
    "r-r-aviation-sikder-group": {
        "country": "bangladesh", "category": "helicopter",
        "urls": [
            "https://sikdergroups.com/images/logo.png",
        ],
        "website": "https://sikdergroups.com/",
        "brandfetch": "sikdergroups.com",
    },
    "impress-aviation-limited": {
        "country": "bangladesh", "category": "helicopter",
        "urls": [],
        "website": "",
        "brandfetch": "",
    },
    "brb-air-limited": {
        "country": "bangladesh", "category": "helicopter",
        "urls": [],
        "website": "",
        "brandfetch": "",
    },
    "partex-aviation-limited": {
        "country": "bangladesh", "category": "helicopter",
        "urls": [
            "https://www.partexgroup.com/images/logo.png",
        ],
        "website": "https://www.partexgroup.com/",
        "brandfetch": "partexgroup.com",
    },
    "south-asian-airlines-limited": {
        "country": "bangladesh", "category": "helicopter",
        "urls": [],
        "website": "",
        "brandfetch": "",
    },
    "helicopter-bd": {
        "country": "bangladesh", "category": "helicopter",
        "urls": [
            "https://www.helicopterbd.com/images/logo.png",
            "https://helicopterbd.com/wp-content/uploads/logo.png",
        ],
        "website": "https://www.helicopterbd.com/",
        "brandfetch": "helicopterbd.com",
    },
    # Nepal
    "kailash-helicopter-services": {
        "country": "nepal", "category": "helicopter",
        "urls": [
            "https://www.kailashheli.com/images/logo.png",
            "https://kailashheli.com/wp-content/uploads/logo.png",
        ],
        "website": "https://www.kailashheli.com/",
        "brandfetch": "kailashheli.com",
    },
    "basecamp-helicopter": {
        "country": "nepal", "category": "helicopter",
        "urls": [
            "https://www.basecamphelicopter.com/images/logo.png",
        ],
        "website": "https://www.basecamphelicopter.com/",
        "brandfetch": "basecamphelicopter.com",
    },
    # PNG
    "heli-solutions-ltd": {
        "country": "papua-new-guinea", "category": "helicopter",
        "urls": [
            "https://helisolutions.com.pg/wp-content/uploads/2020/08/Heli-Solutions-Logo.png",
            "https://helisolutions.com.pg/wp-content/uploads/logo.png",
            "https://helisolutions.com.pg/wp-content/themes/helisolutions/images/logo.png",
        ],
        "website": "https://helisolutions.com.pg/",
        "brandfetch": "helisolutions.com.pg",
    },
    # Fiji
    "helipro-fiji": {
        "country": "fiji", "category": "helicopter",
        "urls": [
            "https://www.heliprofiji.com/images/logo.png",
        ],
        "website": "https://www.heliprofiji.com/",
        "brandfetch": "heliprofiji.com",
    },
    # Myanmar
    "air-myanmar-aviation-services": {
        "country": "myanmar", "category": "helicopter",
        "urls": [],
        "website": "",
        "brandfetch": "",
    },
    # Cambodia
    "helitop-aviation": {
        "country": "cambodia", "category": "helicopter",
        "urls": [
            "https://www.helitopaviation.com/images/logo.png",
        ],
        "website": "https://www.helitopaviation.com/",
        "brandfetch": "helitopaviation.com",
    },
    # Laos
    "lao-westcoast-helicopters": {
        "country": "laos", "category": "helicopter",
        "urls": [],
        "website": "",
        "brandfetch": "",
    },
    # Kazakhstan
    "tamga-jet": {
        "country": "kazakhstan", "category": "helicopter",
        "urls": [
            "https://www.tamgajet.com/images/logo.png",
        ],
        "website": "https://www.tamgajet.com/",
        "brandfetch": "tamgajet.com",
    },
    "kazavialesoohrana": {
        "country": "kazakhstan", "category": "helicopter",
        "urls": [],
        "website": "",
        "brandfetch": "",
    },
    "nca-north-caspian-aviation": {
        "country": "kazakhstan", "category": "helicopter",
        "urls": [
            "https://www.nca.kz/images/logo.png",
        ],
        "website": "https://www.nca.kz/",
        "brandfetch": "nca.kz",
    },
    # Azerbaijan
    "silk-way-helicopter-services": {
        "country": "azerbaijan", "category": "helicopter",
        "urls": [
            "https://www.swhs.az/images/logo.png",
        ],
        "website": "https://www.swhs.az/",
        "brandfetch": "swhs.az",
    },
    # Solomon Islands
    "helicopter-support-h-a-s-pty-ltd": {
        "country": "solomon-islands", "category": "helicopter",
        "urls": [],
        "website": "",
        "brandfetch": "",
    },
    # Vanuatu
    "unity-airlines": {
        "country": "vanuatu", "category": "helicopter",
        "urls": [
            "https://www.unityairlines.com/images/logo.png",
        ],
        "website": "https://www.unityairlines.com/",
        "brandfetch": "unityairlines.com",
    },
    # New Caledonia
    "helicocan": {
        "country": "new-caledonia", "category": "helicopter",
        "urls": [
            "https://www.helicocean.com/images/logo.png",
            "https://www.helicocean.com/wp-content/uploads/logo.png",
        ],
        "website": "https://www.helicocean.com/",
        "brandfetch": "helicocean.com",
    },
    # South Korea
    "korean-air-aerospace-division": {
        "country": "south-korea", "category": "helicopter",
        "urls": [
            "https://www.koreanair.com/images/logo.png",
        ],
        "website": "https://www.koreanair.com/",
        "brandfetch": "koreanair.com",
    },
}

def try_brandfetch(domain, dest_path):
    """Try Brandfetch API for logo."""
    if not domain:
        return False, "No domain"
    try:
        url = f"https://api.brandfetch.io/v2/brands/{domain}"
        req = urllib.request.Request(url, headers={
            "User-Agent": "Mozilla/5.0",
            "Accept": "application/json",
        })
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        with urllib.request.urlopen(req, timeout=10, context=ctx) as resp:
            data = json.loads(resp.read())
            logos = data.get("logos", [])
            if logos:
                # Get the best logo (first one, usually the main logo)
                logo_url = logos[0].get("formats", [{}])[0].get("src")
                if not logo_url and logos[0].get("formats"):
                    logo_url = logos[0]["formats"][0].get("src")
                if logo_url:
                    return try_download(logo_url, dest_path)
        return False, "No logo in Brandfetch response"
    except Exception as e:
        return False, f"Brandfetch error: {e}"

def try_download(url, dest_path, referer=None):
    """Download URL using curl with full browser headers."""
    cmd = ["curl", "-sL", "--max-time", "20", "-o", str(dest_path)] + FULL_HEADERS[:]
    if referer:
        cmd += ["-H", f"Referer: {referer}"]
    cmd.append(url)
    
    result = subprocess.run(cmd, capture_output=True, timeout=25)
    
    if dest_path.exists() and dest_path.stat().st_size > 100:
        # Check if it's actually an image (not HTML)
        file_cmd = subprocess.run(["file", str(dest_path)], capture_output=True, text=True)
        if "image" in file_cmd.stdout.lower() or "svg" in file_cmd.stdout.lower():
            return True, str(dest_path.relative_to(BASE_DIR))
        else:
            dest_path.unlink()
            return False, "Got HTML not image"
    return False, "Download failed or too small"

def try_website_scrape(url, dest_path):
    """Fetch website with curl full headers, extract logo URLs, download."""
    # Fetch HTML
    tmp_html = Path("/tmp/operator_page.html")
    cmd = ["curl", "-sL", "--max-time", "20", "-o", str(tmp_html)] + FULL_HEADERS[:]
    cmd.append(url)
    
    result = subprocess.run(cmd, capture_output=True, timeout=25)
    
    if not tmp_html.exists() or tmp_html.stat().st_size < 100:
        return False, "Could not fetch website"
    
    html = tmp_html.read_text(errors="replace")
    parsed = urllib.parse.urlparse(url)
    base = f"{parsed.scheme}://{parsed.netloc}"
    
    # Extract logo URLs
    logo_urls = []
    patterns = [
        r'<img[^>]+src=["\']([^"\']+)["\'][^>]*(?:class|id|alt)=["\'][^"\']*logo[^"\']*["\']',
        r'<img[^>]+(?:class|id|alt)=["\'][^"\']*logo[^"\']*["\'][^>]*src=["\']([^"\']+)["\']',
        r'<img[^>]+src=["\']([^"\']*logo[^"\']*)["\']',
        r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']',
        r'<link[^>]+rel=["\'](?:shortcut )?icon["\'][^>]+href=["\']([^"\']+)["\']',
    ]
    
    for pattern in patterns:
        for match in re.finditer(pattern, html, re.IGNORECASE):
            img_url = match.group(1)
            if img_url.startswith("//"):
                img_url = "https:" + img_url
            elif img_url.startswith("/"):
                img_url = base + img_url
            elif not img_url.startswith("http"):
                img_url = urllib.parse.urljoin(url, img_url)
            if any(img_url.lower().endswith(ext) for ext in [".svg", ".png", ".jpg", ".jpeg", ".webp", ".gif"]):
                if img_url not in logo_urls:
                    logo_urls.append(img_url)
    
    # Try each logo URL
    for img_url in logo_urls:
        success, msg = try_download(img_url, dest_path, referer=url)
        if success:
            return True, msg
    
    # Try favicon as last resort
    favicon_url = f"{base}/favicon.ico"
    success, msg = try_download(favicon_url, dest_path, referer=url)
    if success:
        return True, msg
    
    return False, "No logo found on page"

def main():
    manifest_path = BASE_DIR / "manifest.json"
    with open(manifest_path) as f:
        manifest = json.load(f)
    
    results = {"downloaded": [], "failed": []}
    
    print(f"=== Final attempt: {len(REMAINING_OPERATORS)} operators ===\n")
    
    for i, (slug, info) in enumerate(REMAINING_OPERATORS.items()):
        country = info["country"]
        category = info["category"]
        dest_dir = BASE_DIR / country / category
        dest_dir.mkdir(parents=True, exist_ok=True)
        dest = dest_dir / f"{slug}.png"  # default to png, will be renamed by curl
        
        print(f"[{i+1}/{len(REMAINING_OPERATORS)}] {slug}")
        
        downloaded = False
        
        # Strategy 1: Try direct URLs
        for url in info.get("urls", []):
            print(f"  Trying direct: {url[:70]}...")
            success, msg = try_download(url, dest, referer=info.get("website"))
            if success:
                print(f"  ✅ {msg}")
                results["downloaded"].append(slug)
                downloaded = True
                # Update manifest
                for entry in manifest:
                    if entry["file"].replace(".svg", "") == slug:
                        entry["status"] = "downloaded"
                        entry["downloadedFile"] = msg
                        entry["file"] = dest.name
                        entry["source"] = "direct-url"
                break
        
        if downloaded:
            time.sleep(0.3)
            continue
        
        # Strategy 2: Try Brandfetch
        if info.get("brandfetch"):
            print(f"  Trying Brandfetch: {info['brandfetch']}...")
            success, msg = try_brandfetch(info["brandfetch"], dest)
            if success:
                print(f"  ✅ {msg}")
                results["downloaded"].append(slug)
                downloaded = True
                for entry in manifest:
                    if entry["file"].replace(".svg", "") == slug:
                        entry["status"] = "downloaded"
                        entry["downloadedFile"] = msg
                        entry["file"] = dest.name
                        entry["source"] = "brandfetch"
        
        if downloaded:
            time.sleep(0.3)
            continue
        
        # Strategy 3: Scrape website with full headers
        if info.get("website"):
            print(f"  Trying website scrape: {info['website']}...")
            success, msg = try_website_scrape(info["website"], dest)
            if success:
                print(f"  ✅ {msg}")
                results["downloaded"].append(slug)
                downloaded = True
                for entry in manifest:
                    if entry["file"].replace(".svg", "") == slug:
                        entry["status"] = "downloaded"
                        entry["downloadedFile"] = msg
                        entry["file"] = dest.name
                        entry["source"] = "website-scrape"
        
        if not downloaded:
            print(f"  ❌ All strategies failed")
            results["failed"].append(slug)
            for entry in manifest:
                if entry["file"].replace(".svg", "") == slug:
                    entry["status"] = "failed"
        
        time.sleep(0.3)
    
    # Save manifest
    with open(manifest_path, "w") as f:
        json.dump(manifest, f, indent=2)
    
    print(f"\n{'='*60}")
    print(f"FINAL RESULTS: {len(results['downloaded'])} downloaded, {len(results['failed'])} failed")
    print(f"{'='*60}")
    print(f"\nDownloaded:")
    for s in results["downloaded"]:
        print(f"  ✅ {s}")
    print(f"\nStill failed:")
    for s in results["failed"]:
        print(f"  ❌ {s}")

if __name__ == "__main__":
    main()
