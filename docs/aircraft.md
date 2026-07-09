# Aircraft Image Asset Guide

This guide governs how aircraft photographs are collected, stored, and maintained for the **type-rating search** feature. It is written for both human maintainers and AI agents so that every image download follows the same standards.

---

## 1. Purpose

Aircraft images are used as **hero / search result visuals** for a type-rating search. They should look **cinematic, professional, and instantly recognizable** as the aircraft type.

The user is searching for aircraft types, not for cockpit tutorials, engine manuals, or airline liveries. Prioritize **clear exterior shots** that show the whole aircraft.

---

## 2. Folder System

Images live under the Next.js `public/` directory so they can be served as static assets.

```text
public/images/manufacturers/
├── cessna/
│   ├── single-engine/
│   │   ├── cessna-140/
│   │   ├── cessna-150/
│   │   ├── cessna-152/
│   │   └── ...
│   └── multi-engine/
│       └── ...
├── piper/
│   └── ...
└── beechcraft/
    └── ...
```

### Folder rules

- **Depth:** `public/images/manufacturers/<manufacturer>/<category>/<model>/`
- **Case:** lowercase, kebab-case.
  - Good: `cessna/single-engine/cessna-172/`
  - Bad: `Cessna/SingleEngine/Cessna 172/`
- **Category:** `single-engine`, `multi-engine`, `turboprop`, `jet`, etc.
- **Target count:** exactly **5 images per model folder**.
  - If a folder drops below 5 after cleanup, backfill to 5.
  - Do not exceed 5 unless the product team explicitly requests a gallery.

---

## 3. What Photos to Download

Every image in a model folder should be a **clear exterior photograph** of that aircraft type.

### Preferred shot types

- Side profile on the ground (tarmac or grass).
- Front-quarter / 3/4 view.
- In-flight against sky.
- Taxiing or taking off.
- Floats / skis variant (if relevant to the type).

### Good subjects

- Real, full-scale aircraft.
- Common paint schemes and registrations.
- Clean backgrounds (sky, runway, grass, hangar).
- Sharp focus, daylight or good ambient light.

### Acceptable variations

- Historical black-and-white photos (for vintage types).
- Military / utility variants if they clearly show the aircraft type.
- Slightly older photos if they are the only high-quality option.

---

## 4. What Photos NOT to Download

Do **not** add these to a model folder, even if they show the aircraft name in the caption.

| Reject reason                    | Examples                                                        |
| -------------------------------- | --------------------------------------------------------------- |
| **Cockpit / interior**           | instrument panels, yokes, seats, G1000 screens, cabin photos    |
| **Detail / component close-ups** | propeller spinner, engine nacelle, landing gear only, wing tip  |
| **Diagrams / line art**          | 3-view drawings, blueprint scans, technical illustrations       |
| **Models / toys**                | RC planes, desk models, scale replicas                          |
| **Display mounts**               | aircraft mounted on a building, store sign, restaurant decor    |
| **Unrelated objects**            | car interiors, license plates, road signs, boats                |
| **People-centric**               | photos where the aircraft is tiny and people dominate the frame |
| **Portrait orientation**         | avoid unless no landscape alternative exists                    |
| **Excessive clutter**            | aircraft blocked by tents, vehicles, crowds, or other planes    |

If the thumbnail is ambiguous, open the full image and verify that the **entire aircraft** is visible and recognizable.

---

## 5. Quality Standards

| Attribute        | Minimum                    | Preferred                                | Hard Limit                             |
| ---------------- | -------------------------- | ---------------------------------------- | -------------------------------------- |
| **Longest edge** | 1000 px                    | 1600–1920 px                             | use original up to 1920 px             |
| **Aspect ratio** | landscape (width ≥ height) | 3:2, 16:9, or 4:3                        | no portrait orientation                |
| **Format**       | JPEG                       | JPEG                                     | PNG/WebP only if source is transparent |
| **File size**    | —                          | 500 KB – 2 MB                            | 4 MB                                   |
| **Compression**  | —                          | resize to 1920 px wide, 85% JPEG quality | never above 4 MB                       |

### Post-processing rule

If the source image is wider than 1920 px or larger than ~2 MB, compress it:

```bash
magick input.jpg -resize 1920x> -quality 85 output.jpg
```

Or with legacy ImageMagick:

```bash
convert input.jpg -resize 1920x\> -quality 85 output.jpg
```

The `>` flag means "only resize if the image is larger than 1920 px."

---

## 6. File Naming Convention

Files must be lowercase and use kebab-case.

```text
<model-folder-prefix>-<brief-description>.jpg
```

### Examples

- `cessna-152/cessna-152-d-evuw-portimao-2014.jpg`
- `cessna-182/cessna-182-n7155n-skylane.jpg`
- `cessna-400/cessna-400-vh-csv-wagga-wagga.jpg`

### Rules

1. Start with the folder / model prefix.
2. Include registration or location when useful.
3. Do not use spaces or special characters except hyphens and periods.
4. Keep names under ~80 characters.
5. Avoid generic names like `image.jpg`, `photo.jpg`, or `aviacionavion.png`.

---

## 7. Recommended Sources

### Primary: Wikimedia Commons

Use the Wikimedia Commons search API or the `wikimedia-image-search` MCP tool.

Example searches:

- `Cessna 152`
- `Cessna 182 Skylane`
- `Cessna 400 Corvalis`

### Secondary: Wikipedia page infobox

Many Wikipedia aircraft pages embed a high-quality infobox photo. Use the Wikimedia file link from the infobox rather than scraping the article directly.

### License requirements

Only use images that are:

- **Public domain**
- **CC BY** (any version)
- **CC BY-SA** (any version)
- **GFDL**

Do not use:

- All-rights-reserved images.
- Editorial-only stock photos.
- Images with unknown provenance.

---

## 8. Workflow for Adding Images

Follow this order. Do not skip the verification step.

### 8.1 Check current state

```bash
for d in public/images/manufacturers/cessna/single-engine/*/; do
  echo "$(basename "$d"): $(find "$d" -type f ! -name '.DS_Store' | wc -l)"
done
```

Identify folders below 5 images.

### 8.2 Search for candidates

Use the `wikimedia-image_images` MCP tool or query Commons directly. Review **at least the caption and description** before downloading.

### 8.3 Download the right resolution

Wikimedia thumbnail URLs look like:

```text
https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Filename.jpg/330px-Filename.jpg
```

Replace `330px` with `1920px` to get a web-friendly full-resolution image.

```text
https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Filename.jpg/1920px-Filename.jpg
```

If `1920px` exceeds the original width, Wikimedia returns the original.

### 8.4 Inspect every downloaded image

Open each downloaded image and confirm:

- It shows the full aircraft exterior.
- The aircraft type matches the folder.
- It is not a cockpit, diagram, model, or unrelated object.
- Orientation is landscape.

### 8.5 Resize / compress if needed

```bash
magick "$file" -resize 1920x\> -quality 85 "$file"
```

### 8.6 Deduplicate

Run an MD5 check across the target folder. Do not add images with the same content as an existing file, even if the filenames differ.

```bash
md5 -r public/images/manufacturers/cessna/single-engine/cessna-172/*
```

### 8.7 Verify final state

- 5 images per folder.
- No exact MD5 duplicates.
- No files over 4 MB.
- All files are valid images.

```bash
find public/images/manufacturers/cessna/single-engine -type f ! -name '.DS_Store' -size +4M
```

### 8.8 Commit

Stage only the aircraft image changes:

```bash
git add public/images/manufacturers/cessna/single-engine
git commit -m "fix(assets): add unique exterior <model> images"
git push origin main
```

---

## 9. Common Search Pitfalls

| Search term           | Pitfall                                                                          |
| --------------------- | -------------------------------------------------------------------------------- |
| `Cessna 205`          | Also matches Mercedes-Benz C 205 Coupe car photos. Always verify aircraft.       |
| `Cessna 206`          | Cockpit panel images are common. Filter by exterior.                             |
| `Cessna 152`          | Cockpit training photos are common. Avoid.                                       |
| `Cessna 182 Skylane`  | May return aircraft mounted on buildings as advertising displays. Reject.        |
| `Cessna 170`          | May return RC model photos (e.g. Flex Innovations Cessna 170 G2). Reject.        |
| `Cessna 400 Corvalis` | May return unrelated "T-1A" military jet because of filename collisions. Verify. |

When in doubt, read the Wikimedia description field before downloading.

---

## 10. Cleanup Rules

If a folder contains bad images:

1. Remove the bad files immediately.
2. Note how many replacements are needed to restore 5 images.
3. Search Commons for that specific model.
4. Download, verify, compress, deduplicate.
5. Commit the cleanup in the same PR.

Do **not** leave a folder with fewer than 5 images overnight.

---

## 11. Verification Checklist

Before committing any aircraft image change, confirm:

- [ ] Every folder has exactly 5 images.
- [ ] Every image is a real, full-scale aircraft exterior.
- [ ] No cockpit, interior, diagram, model, sign, car, or unrelated object images.
- [ ] All images are landscape orientation.
- [ ] No image exceeds 4 MB; preferred under 2 MB.
- [ ] No exact MD5 duplicate groups across the model folder.
- [ ] Filenames are lowercase kebab-case and start with the model prefix.
- [ ] Only appropriate-licensed images were used (public domain / CC BY / CC BY-SA / GFDL).

---

## 12. Quick Reference Commands

```bash
# Count images per folder
for d in public/images/manufacturers/cessna/single-engine/*/; do
  echo "$(basename "$d"): $(find "$d" -type f ! -name '.DS_Store' | wc -l)"
done

# Find oversized files
find public/images/manufacturers/cessna/single-engine -type f ! -name '.DS_Store' -size +4M

# Compress a large image
magick input.jpg -resize 1920x\> -quality 85 output.jpg

# Check image dimensions
sips -g pixelWidth -g pixelHeight image.jpg

# Validate all files are images
find public/images/manufacturers/cessna/single-engine -type f ! -name '.DS_Store' -exec file {} +
```

---

## 13. Examples: Keep vs Remove

### Keep

- `cessna-180-spirit-columbus.jpg` — full side profile on grass, clear sky.
- `cessna-210-1976-cessna-210l-n732gd-5359315231.jpg` — in-flight against blue sky.
- `cessna-188-cessna188agwagonzkcse.jpg` — crop duster spraying low over a field.

### Remove

- `cessna-152-cessna-152-t-cockpit.jpg` — cockpit instrument panel.
- `cessna-206-7panel-03-01-08.jpg` — Garmin G1000 glass cockpit.
- `cessna-177-n34289-perry.jpg` — technical 3-view line drawing.
- `cessna-170-flex-innovations-cessna-170-g2-60e-11-2-2024.jpg` — RC model airplane.
- `cessna-205-mb-c205-interior.jpg` — car interior, not an aircraft.
- `cessna-205-rooken-bordje-ntm-c205.jpg` — wooden sign, not an aircraft.
- `cessna-182-cessna-182-skylane-cessna-skylane-20090914282.jpg` — aircraft mounted vertically on a building display.

---

## 14. Contact

If a source license is unclear, an aircraft type cannot be found with acceptable photos, or the folder count cannot reach 5, escalate to the product team before committing low-quality images.
