#!/usr/bin/env python3
"""
Scrape logos from official websites of APAC helicopter/general aviation operators.
Fetches each website, extracts logo image URLs from HTML, and downloads them.
"""

import json
import os
import re
import time
import urllib.parse
import urllib.request
import urllib.error
import ssl
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent / "public" / "images" / "Pathways" / "Helicopter Operators" / "APAC"

# ─── Operator → website URL mapping ───
OPERATOR_WEBSITES = {
    # Australia
    "nautilus-aviation": "https://www.nautilusaviation.com.au/",
    "mcdermott-aviation": "https://www.mcdermottaviation.com/",
    "professional-helicopter-services": "https://phs.com.au/",
    "helifarm": "https://www.helifarm.com.au/",
    "valhalla-helicopters": "https://www.valhallahelicopters.com/",
    "national-jet-express": "https://www.nationaljetexpress.com.au/",
    "brooks-airways": "https://www.brooksairways.com.au/",
    "hardy-aviation": "https://hardyaviation.com.au/",
    "machjet-international": "https://www.machjet.com.au/",
    "aergo-international": "https://www.aergointernational.com/",
    "gam-group": "https://gamg.com.au/",
    "careflight": "https://careflight.org/",
    "royal-flying-doctor-service": "https://www.flyingdoctor.org.au/",
    "lifeflight-australia": "https://lifeflight.org.au/",
    "pel-air": "https://www.pelair.com.au/",
    "medstar": "https://www.sahealth.sa.gov.au/",
    "snowy-hydro-southcare": "https://www.snowyhydrosouthcare.com.au/",
    "westpac-lifesaver-rescue-helicopter": "https://www.lifesaver.org.au/",
    "air-ag": "http://www.airag.com.au/",
    "robins-aviation": "https://www.robinsaviation.com.au/",
    "rebel-ag-aviation": "http://www.rebelag.com.au/",
    "dunn-aviation": "https://www.dunnaviation.com.au/",
    "flight-one-education": "https://flightone.edu.au/",
    "flight-training-adelaide": "https://www.flyfta.com/",
    "national-aviation-academy": "https://naa.edu.au/",
    "quantum-aviation": "https://www.quantumaviation.com.au/",
    "airspeed-aviation": "https://www.airspeedaviation.com.au/",

    # New Zealand
    "the-helicopter-line": "https://www.helicopter.co.nz/",
    "gch-aviation": "https://gchaviation.com/",
    "heletranz-helicopters": "https://heletranz.co.nz/",
    "advanced-flight": "https://www.advancedflight.co.nz/",
    "rotor-work": "https://www.rotorwork.co.nz/",
    "beck-helicopters": "https://www.heli.co.nz/",
    "escape-aviation": "https://escapeaviation.co.nz/",
    "alpine-helicopters": "https://www.alpineheli.co.nz/",
    "eagleflight-technics": "https://eagleflight.co.nz/",
    "air-safaris": "https://www.airsafaris.co.nz/",
    "inflite-aviation-services": "https://infliteexperiences.co.nz/",
    "tasman-aviation": "https://tasmanaviation.co.nz/",
    "glenorchy-air": "https://www.glenorchyair.co.nz/",
    "air-milford": "https://www.airmilford.co.nz/",
    "southern-alps-air": "https://www.southernalpsair.co.nz/",
    "mount-cook-ski-planes-helicopters": "https://www.mtcookskiplanes.com/",
    "glacier-southern-lakes-helicopters": "https://www.glaciersouthernlakes.co.nz/",

    # Japan
    "central-helicopter-service": "https://www.central-heli.com/en/",
    "aero-asahi-corporation": "https://www.aerotoyota.co.jp/en/",
    "noevir-aviation": "https://nac.noevir.co.jp/english/",
    "new-japan-helicopter": "https://snkk-net.com/",
    "aeroworks-international": "https://www.aeroworks.jp/",
    "japan-general-aviation-service": "https://www.jgas.com/en.html",
    "japan-biz-aviation": "https://www.j-bizavi.com/",

    # China
    "shanghai-new-sky-helicopter": "https://www.newskyheli.com/",
    "eastern-general-aviation": "https://www.szdbth.com/",
    "gdat-general-aviation": "https://gdat-group.com/",
    "inner-mongolia-eagle-aviation-group": "http://www.shenyingjituan.com/en_index.html",
    "suzhou-feixian-ruohang": "http://en.feixiankeji.cn/About.aspx?ClassID=2",
    "citic-offshore-helicopter": "https://www.cohc.citic/",


    # India
    "pawan-hans-limited": "http://mypawanhans.co.in/",
    "global-vectra-helicorp": "https://www.globalhelicorp.com/",
    "heligo-charters": "https://heligo.in/",
    "chimes-aviation-academy": "https://www.caaindia.com/",
    "skynex-aero": "https://skynex.aero/",
    "flight-simulation-technique-centre": "https://fstc.in/",
    "redbird-aviation": "https://redbirdaviation.com/",

    # Indonesia
    "derazona-helicopters": "https://www.derazona.com/",
    "altius-indonesia": "https://altusindonesia.com/",
    "volta-pasifik-aviasi": "https://voltapasifik.com/",

    # Malaysia
    "mhs-aviation-berhad": "https://www.mhsaviation.com/",
    "weststar-group": "https://www.weststar-aviation.aero/",
    "mycopter-aviation-services": "https://www.mycopteraviation.com.my/",

    # Singapore
    "singapore-heli-services": "https://www.singaporehelicoptertour.com/",

    # Thailand
    "advance-aviation": "https://www.advanceaviation.co.th/",
    "silk-sky-air": "https://www.silkskyair.com/",

    # Vietnam
    "aerial-vn": "https://aerial.vn/",
    "vietnam-helicopter-travel": "https://vietnamhelicoptertravel.com/",
    "uni-group-asia": "https://www.uniasia.com.vn/",

    # Philippines
    "asia-aircraft-philippines": "https://asiaaircraftphilippines.com/",
    "philjets": "https://philjets.com/",
    "lionair-incorporated": "https://www.lionairinc.com/",
    "airtaxi-ph": "https://airtaxi.ph/",

    # Taiwan
    "ginger-aviation": "https://www.gingeraviation.com.tw/en/index",
    "apex-aviation": "https://www.apexaviation.com.tw/en",
    "dong-fang-offshore": "https://www.dfo.com.tw/en/",

    # Hong Kong
    "heliservices-hong-kong": "https://www.heliservices.com.hk/",
    "government-flying-service": "https://www.gfs.gov.hk/",
    "seaplane-group": "https://www.seaplanehk.com/",

    # Sri Lanka
    "iws-aviation": "https://iwsholdings.com/",
    "air-senok": "https://senokair.com/",
    "rathna-aviation": "http://rathnaaviation.com/",
    "senok-air": "https://senokair.com/",
    "senok-air-leisure": "https://senokairleisure.com/",

    # Bangladesh
    "fly-helicopter-service-bangladesh": "https://flyhsb.com/",
    "meghna-aviation-limited": "https://meghnaaviation.com/",
    "bashundhara-airways-limited": "https://www.bashundharaairways.com/",
    "square-air-limited": "https://squareair.com.bd/",

    # Nepal
    "fishtail-air": "https://www.fishtailair.com/",
    "air-dynasty": "https://airdynastyheli.com/",
    "mustang-helicopter": "https://www.helicocean.com/",
    "shree-airlines": "https://www.shreeairlines.com/",
    "heli-everest": "https://www.helieverest.com/",

    # Papua New Guinea
    "pacific-helicopters": "https://www.pacifichelicopters.aero/",
    "heli-solutions-ltd": "https://helisolutions.com.pg/",
    "niugini-helicopters": "https://www.niuginihelicopters.com/",
    "manolos-aviation-ltd": "https://www.manolosaviation.org/",
    "sil-aviation": "http://www.silaviation.org/",
    "helifix-operations-ltd": "https://helifix.com.pg/",

    # Fiji
    "heli-tours-fiji": "https://www.helitoursfiji.com/",
    "island-hoppers-fiji": "https://www.islandhoppersfiji.com/",

    # Cambodia
    "helicopters-cambodia": "https://www.helistarcambodia.com/",
    "helistar-cambodia": "https://www.helistarcambodia.com/",

    # Laos
    "lao-skyway": "https://www.laoskyway.com/",

    # Kazakhstan
    "air-tengri": "http://airtengri.kz/",
    "burundaiavia": "https://burundaiavia.kz/",
    "prime-aviation": "https://primeaviation.kz/en/",
    "sky-service": "https://www.sky-service.com.kz/en/",

    # Azerbaijan
    "asg-helicopter-services": "https://asg-helicopters.az/",

    # Uzbekistan
    "uzbekistan-helicopters-llc": "https://corp.uzairways.com/en/uzbekistan-helicopters-llc",
    "silk-avia": "https://www.silk-avia.com/",

    # French Polynesia
    "tahiti-nui-helicopters": "https://tahitinuihelicopters.com/en",
    "tahiti-helicopters": "https://tahitinuihelicopters.com/en",

    # New Caledonia
    "helicocan": "https://www.helicocean.com/",
    "helisud": "https://www.groupemai.nc/helisud/",
    "helical-hcm-group": "https://www.helicocean.com/",

    # Vanuatu
    "vanuatu-helicopters": "https://bookmevanuatu.com/?page_id=1309",
}

# ─── Wikimedia SVG logos (direct download URLs) ───
WIKIMEDIA_SVGS = {
    "careflight": "https://upload.wikimedia.org/wikipedia/commons/2/2e/CareFlight.svg",
}

# ─── SSL context for fetching ───
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
}

def fetch_url(url, timeout=15):
    """Fetch URL content with headers."""
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=timeout, context=ctx) as resp:
            content_type = resp.headers.get("Content-Type", "")
            data = resp.read()
            return data, content_type, resp.geturl()
    except Exception as e:
        return None, str(e), url

def extract_logo_urls(html_bytes, base_url):
    """Extract potential logo image URLs from HTML."""
    try:
        html = html_bytes.decode("utf-8", errors="replace")
    except:
        html = html_bytes.decode("latin-1", errors="replace")

    parsed = urllib.parse.urlparse(base_url)
    base = f"{parsed.scheme}://{parsed.netloc}"

    logos = []

    # Pattern 1: <img> tags with "logo" in src, class, id, or alt
    img_patterns = [
        r'<img[^>]+src=["\']([^"\']+)["\'][^>]*(?:class|id|alt)=["\'][^"\']*logo[^"\']*["\']',
        r'<img[^>]+(?:class|id|alt)=["\'][^"\']*logo[^"\']*["\'][^>]*src=["\']([^"\']+)["\']',
        r'<img[^>]+src=["\']([^"\']*logo[^"\']*)["\']',
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

    # Pattern 2: SVG inline elements
    if "<svg" in html.lower():
        logos.append(("INLINE_SVG", base_url))

    # Pattern 3: favicon as fallback
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

    # Pattern 4: og:image meta tag
    og_pattern = r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']'
    for match in re.finditer(og_pattern, html, re.IGNORECASE):
        url = match.group(1)
        if url.startswith("//"):
            url = "https:" + url
        elif not url.startswith("http"):
            url = urllib.parse.urljoin(base_url, url)
        logos.append(url)

    # Deduplicate, preserving order
    seen = set()
    unique = []
    for url in logos:
        key = url if isinstance(url, str) else url[0]
        if key not in seen:
            seen.add(key)
            unique.append(url)

    return unique, favicons

def download_image(url, dest_path, timeout=15):
    """Download an image to dest_path."""
    data, content_type, final_url = fetch_url(url, timeout)
    if data is None:
        return False, f"Fetch failed: {content_type}"

    # Determine file extension from content type or URL
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
        ext = ".png"  # default

    # Check if data is actually an image
    if len(data) < 100:
        return False, "Data too small"

    # Adjust destination path extension
    dest = dest_path.with_suffix(ext)
    dest.parent.mkdir(parents=True, exist_ok=True)

    with open(dest, "wb") as f:
        f.write(data)

    return True, str(dest.relative_to(BASE_DIR))

def find_operator_in_manifest(manifest, operator_slug):
    """Find operator entry in manifest by slug."""
    for entry in manifest:
        if entry["file"].replace(".svg", "") == operator_slug:
            return entry
    return None

def main():
    # Load manifest
    manifest_path = BASE_DIR / "manifest.json"
    with open(manifest_path) as f:
        manifest = json.load(f)

    results = {"downloaded": [], "failed": [], "skipped": []}

    # First, download known Wikimedia SVGs
    print("=== Downloading known Wikimedia SVGs ===")
    for slug, url in WIKIMEDIA_SVGS.items():
        entry = find_operator_in_manifest(manifest, slug)
        if not entry:
            continue
        dest = BASE_DIR / entry["country"] / entry["category"].replace("_", "-") / entry["file"]
        print(f"  Downloading {slug} from Wikimedia...")
        success, msg = download_image(url, dest)
        if success:
            entry["status"] = "downloaded"
            entry["source"] = "wikimedia"
            entry["downloadedFile"] = msg
            results["downloaded"].append(slug)
            print(f"    ✅ {msg}")
        else:
            entry["status"] = "failed"
            entry["error"] = msg
            results["failed"].append((slug, msg))
            print(f"    ❌ {msg}")

    # Now scrape websites
    print(f"\n=== Scraping {len(OPERATOR_WEBSITES)} operator websites ===")
    for i, (slug, website_url) in enumerate(OPERATOR_WEBSITES.items()):
        entry = find_operator_in_manifest(manifest, slug)
        if not entry:
            print(f"  [{i+1}/{len(OPERATOR_WEBSITES)}] {slug}: NOT IN MANIFEST, skipping")
            results["skipped"].append(slug)
            continue

        if entry.get("status") == "downloaded":
            print(f"  [{i+1}/{len(OPERATOR_WEBSITES)}] {slug}: already downloaded, skipping")
            results["skipped"].append(slug)
            continue

        dest = BASE_DIR / entry["country"] / entry["category"].replace("_", "-") / entry["file"]
        print(f"  [{i+1}/{len(OPERATOR_WEBSITES)}] {slug}: fetching {website_url}...")

        html_data, content_type, final_url = fetch_url(website_url, timeout=20)
        if html_data is None:
            print(f"    ❌ Failed to fetch website: {content_type}")
            entry["status"] = "failed"
            entry["error"] = f"Website fetch failed: {content_type}"
            entry["website"] = website_url
            results["failed"].append((slug, f"Website fetch failed"))
            time.sleep(1)
            continue

        entry["website"] = website_url

        # Extract logo URLs
        logo_urls, favicon_urls = extract_logo_urls(html_data, final_url)

        if not logo_urls and not favicon_urls:
            # Try /favicon.ico as last resort
            parsed = urllib.parse.urlparse(final_url)
            favicon_urls = [f"{parsed.scheme}://{parsed.netloc}/favicon.ico"]

        all_urls = logo_urls + favicon_urls

        downloaded = False
        for url in all_urls:
            if isinstance(url, tuple) and url[0] == "INLINE_SVG":
                # Can't easily extract inline SVG, skip
                continue

            if not isinstance(url, str):
                continue

            print(f"    Trying logo URL: {url[:80]}...")
            success, msg = download_image(url, dest)
            if success:
                entry["status"] = "downloaded"
                entry["source"] = "website"
                entry["logoUrl"] = url
                entry["downloadedFile"] = msg
                results["downloaded"].append(slug)
                print(f"    ✅ {msg}")
                downloaded = True
                break

        if not downloaded:
            entry["status"] = "failed"
            entry["error"] = "No logo image found on website"
            results["failed"].append((slug, "No logo found"))
            print(f"    ❌ No logo image found")

        time.sleep(0.5)  # Be polite

    # Save updated manifest
    with open(manifest_path, "w") as f:
        json.dump(manifest, f, indent=2)

    # Print summary
    print(f"\n{'='*60}")
    print(f"SUMMARY")
    print(f"{'='*60}")
    print(f"Downloaded: {len(results['downloaded'])}")
    print(f"Failed:     {len(results['failed'])}")
    print(f"Skipped:    {len(results['skipped'])}")
    print(f"\nDownloaded operators:")
    for slug in results["downloaded"]:
        print(f"  ✅ {slug}")
    print(f"\nFailed operators:")
    for slug, reason in results["failed"]:
        print(f"  ❌ {slug}: {reason}")

    # Save results summary
    results_path = BASE_DIR / "download-results.json"
    with open(results_path, "w") as f:
        json.dump({
            "downloaded": results["downloaded"],
            "failed": [{"slug": s, "reason": r} for s, r in results["failed"]],
            "skipped": results["skipped"],
        }, f, indent=2)
    print(f"\nResults saved to {results_path}")

if __name__ == "__main__":
    main()
