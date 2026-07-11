#!/usr/bin/env python3
"""Retry failed operator logo downloads with corrected URLs."""

import json
import os
import re
import time
import urllib.parse
import urllib.request
import ssl
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent / "public" / "images" / "Pathways" / "Helicopter Operators" / "APAC"

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
}

# Corrected URLs for failed operators
RETRY_URLS = {
    "national-jet-express": "https://nje.aero/",
    "aergo-international": "https://www.aergo.com.au/",
    "gam-group": "https://www.gamgroup.com.au/",
    "westpac-lifesaver-rescue-helicopter": "https://lifesaver.org.au/",
    "national-aviation-academy": "https://www.nationalaviation.au/",
    "eastern-general-aviation": "https://www.szdbth.com/",
    "weststar-group": "https://www.weststar-aviation.aero/",
    "heli-solutions-ltd": "https://helisolutions.com.pg/",
    # these had no logo found, try different page
    "suzhou-feixian-ruohang": "http://en.feixiankeji.cn/",
}

def fetch_url(url, timeout=20):
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=timeout, context=ctx) as resp:
            content_type = resp.headers.get("Content-Type", "")
            data = resp.read()
            return data, content_type, resp.geturl()
    except Exception as e:
        return None, str(e), url

def extract_logo_urls(html_bytes, base_url):
    try:
        html = html_bytes.decode("utf-8", errors="replace")
    except:
        html = html_bytes.decode("latin-1", errors="replace")

    parsed = urllib.parse.urlparse(base_url)
    base = f"{parsed.scheme}://{parsed.netloc}"

    logos = []
    img_patterns = [
        r'<img[^>]+src=["\']([^"\']+)["\'][^>]*(?:class|id|alt)=["\'][^"\']*logo[^"\']*["\']',
        r'<img[^>]+(?:class|id|alt)=["\'][^"\']*logo[^"\']*["\'][^>]*src=["\']([^"\']+)["\']',
        r'<img[^>]+src=["\']([^"\']*logo[^"\']*)["\']',
        r'<img[^>]+src=["\']([^"\']+)["\'][^>]*(?:class|id|alt)=["\'][^"\']*(?:brand|header|nav)[^"\']*["\']',
    ]
    for pattern in img_patterns:
        for match in re.finditer(pattern, html, re.IGNORECASE):
            url = match.group(1)
            if url.startswith("//"):
                url = "https:" + url
            elif url.startswith("/"):
                url = base + url
            elif not url.startswith("http"):
                url = urllib.parse.urljoin(base_url, url)
            if any(url.lower().endswith(ext) for ext in [".svg", ".png", ".jpg", ".jpeg", ".webp", ".gif"]):
                logos.append(url)

    # og:image
    og_pattern = r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']'
    for match in re.finditer(og_pattern, html, re.IGNORECASE):
        url = match.group(1)
        if url.startswith("//"):
            url = "https:" + url
        elif not url.startswith("http"):
            url = urllib.parse.urljoin(base_url, url)
        logos.append(url)

    # favicon
    favicon_patterns = [
        r'<link[^>]+rel=["\'](?:shortcut )?icon["\'][^>]+href=["\']([^"\']+)["\']',
        r'<link[^>]+href=["\']([^"\']+)["\'][^>]+rel=["\'](?:shortcut )?icon["\']',
    ]
    favicons = []
    for pattern in favicon_patterns:
        for match in re.finditer(pattern, html, re.IGNORECASE):
            url = match.group(1)
            if url.startswith("//"):
                url = "https:" + url
            elif url.startswith("/"):
                url = base + url
            elif not url.startswith("http"):
                url = urllib.parse.urljoin(base_url, url)
            favicons.append(url)

    seen = set()
    unique = []
    for url in logos + favicons:
        if url not in seen:
            seen.add(url)
            unique.append(url)

    return unique

def download_image(url, dest_path, timeout=15):
    data, content_type, final_url = fetch_url(url, timeout)
    if data is None:
        return False, f"Fetch failed: {content_type}"

    if "svg" in (content_type or "").lower() or url.lower().endswith(".svg"):
        ext = ".svg"
    elif "png" in (content_type or "").lower() or url.lower().endswith(".png"):
        ext = ".png"
    elif "jpeg" in (content_type or "").lower() or url.lower().endswith((".jpg", ".jpeg")):
        ext = ".jpg"
    elif "webp" in (content_type or "").lower() or url.lower().endswith(".webp"):
        ext = ".webp"
    elif "gif" in (content_type or "").lower() or url.lower().endswith(".gif"):
        ext = ".gif"
    else:
        ext = ".png"

    if len(data) < 100:
        return False, "Data too small"

    dest = dest_path.with_suffix(ext)
    dest.parent.mkdir(parents=True, exist_ok=True)

    with open(dest, "wb") as f:
        f.write(data)

    return True, str(dest.relative_to(BASE_DIR))

def find_operator_in_manifest(manifest, operator_slug):
    for entry in manifest:
        if entry["file"].replace(".svg", "") == operator_slug:
            return entry
    return None

def main():
    manifest_path = BASE_DIR / "manifest.json"
    with open(manifest_path) as f:
        manifest = json.load(f)

    results = {"downloaded": [], "failed": []}

    print(f"=== Retrying {len(RETRY_URLS)} failed operators ===")
    for i, (slug, website_url) in enumerate(RETRY_URLS.items()):
        entry = find_operator_in_manifest(manifest, slug)
        if not entry:
            print(f"  [{i+1}] {slug}: NOT IN MANIFEST")
            continue

        dest = BASE_DIR / entry["country"] / entry["category"].replace("_", "-") / entry["file"]
        print(f"  [{i+1}] {slug}: fetching {website_url}...")

        html_data, content_type, final_url = fetch_url(website_url, timeout=25)
        if html_data is None:
            print(f"    ❌ Failed: {content_type}")
            entry["error"] = f"Retry failed: {content_type}"
            results["failed"].append((slug, content_type))
            time.sleep(1)
            continue

        entry["website"] = website_url
        logo_urls = extract_logo_urls(html_data, final_url)

        if not logo_urls:
            # Try favicon.ico
            parsed = urllib.parse.urlparse(final_url)
            logo_urls = [f"{parsed.scheme}://{parsed.netloc}/favicon.ico"]

        downloaded = False
        for url in logo_urls:
            print(f"    Trying: {url[:80]}...")
            success, msg = download_image(url, dest)
            if success:
                entry["status"] = "downloaded"
                entry["source"] = "website-retry"
                entry["logoUrl"] = url
                entry["downloadedFile"] = msg
                results["downloaded"].append(slug)
                print(f"    ✅ {msg}")
                downloaded = True
                break

        if not downloaded:
            entry["status"] = "failed"
            entry["error"] = "No logo found on retry"
            results["failed"].append((slug, "No logo found"))
            print(f"    ❌ No logo found")

        time.sleep(0.5)

    with open(manifest_path, "w") as f:
        json.dump(manifest, f, indent=2)

    print(f"\nRetry summary: {len(results['downloaded'])} downloaded, {len(results['failed'])} failed")
    for slug in results["downloaded"]:
        print(f"  ✅ {slug}")
    for slug, reason in results["failed"]:
        print(f"  ❌ {slug}: {reason}")

if __name__ == "__main__":
    main()
